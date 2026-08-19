// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { FLOW_ENDPOINT, UPSTREAM_TIMEOUT_MS, requireApplicationId, requireFlowSecret } from '@/lib/server/thunderid';
import { setSessionCookie } from '@/lib/server/session';

/**
 * Proxies POST /flow/execute for the browser. This is the whole point of the sample: the browser
 * never talks to the flow API directly, so it never needs (and never sees) the Flow Secret.
 *
 * - Initiation (no executionId in the request): the applicationId is pinned from server-side env
 *   rather than trusted from the client, and the Flow Secret is attached as the `Flow-Secret`
 *   header required for app-native flow initiation.
 * - Continuation (has executionId): forwarded unchanged. The flow execution guard only runs on
 *   initiation, so no secret is needed here.
 *
 * On flow completion, the issued assertion is captured into an httpOnly cookie and stripped from
 * the JSON handed back to the browser, replaced with `assertionIssued: true` so the client can
 * still tell a completed sign-in apart from a registration-only completion with no auto-login.
 *
 * When SSO is enabled on a flow, the server tracks it with its own per-flow, httpOnly cookie (see
 * backend/internal/flow/session/transport.go) so a later /flow/execute call, including the SIGNOUT
 * flow this sample's sign-out drives, can find the same session. That cookie is set for whichever
 * origin the browser sees the response coming from, and Node's fetch has no cookie jar of its own
 * (unlike a browser), so both directions of the relay are done explicitly here rather than left to
 * the platform: the browser's incoming Cookie header is forwarded to the upstream call, and every
 * Set-Cookie the upstream call returns is copied onto the response handed back to the browser.
 */
export async function POST(request: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: { defaultValue: 'Invalid request body.' } }, { status: 400 });
    }
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return NextResponse.json({ message: { defaultValue: 'Invalid request body.' } }, { status: 400 });
    }

    const isInitiation = !body.executionId;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const upstreamBody: Record<string, unknown> = { ...body };

    const incomingCookie = request.headers.get('cookie');
    if (incomingCookie) {
        headers['Cookie'] = incomingCookie;
    }

    if (isInitiation) {
        try {
            upstreamBody.applicationId = requireApplicationId();
            headers['Flow-Secret'] = requireFlowSecret();
        } catch (configError) {
            return NextResponse.json(
                { message: { defaultValue: (configError as Error).message } },
                { status: 500 },
            );
        }
    }

    let upstreamResponse: Response;
    try {
        upstreamResponse = await fetch(`${FLOW_ENDPOINT}/execute`, {
            method: 'POST',
            headers,
            body: JSON.stringify(upstreamBody),
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
    } catch (error) {
        console.error('Failed to reach the ThunderID flow API:', error);
        return NextResponse.json(
            { message: { defaultValue: 'A network error occurred while contacting the ThunderID server.' } },
            { status: 503 },
        );
    }

    const data = await upstreamResponse.json().catch(() => ({} as Record<string, unknown>));

    if (data.flowStatus === 'COMPLETE' && typeof data.assertion === 'string') {
        await setSessionCookie(data.assertion);
        delete data.assertion;
        data.assertionIssued = true;
    }

    const response = NextResponse.json(data, { status: upstreamResponse.status });
    for (const cookie of upstreamResponse.headers.getSetCookie()) {
        response.headers.append('Set-Cookie', cookie);
    }
    return response;
}
