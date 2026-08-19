// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { UPSTREAM_TIMEOUT_MS, USERS_ENDPOINT } from '@/lib/server/thunderid';
import { getSessionAssertion } from '@/lib/server/session';

const notAuthenticated = () =>
    NextResponse.json({ message: { defaultValue: 'Not authenticated.' } }, { status: 401 });

const upstreamUnreachable = () =>
    NextResponse.json(
        { message: { defaultValue: 'A network error occurred while contacting the ThunderID server.' } },
        { status: 503 },
    );

/**
 * Proxies the current user's profile read. The session's auth assertion is attached as the
 * Bearer token server-side; the browser never holds it.
 */
export async function GET() {
    const assertion = await getSessionAssertion();
    if (!assertion) {
        return notAuthenticated();
    }

    let response: Response;
    try {
        response = await fetch(`${USERS_ENDPOINT}/me?include=display`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${assertion}`,
            },
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
    } catch (error) {
        console.error('Failed to reach the ThunderID users API:', error);
        return upstreamUnreachable();
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
}

/**
 * Proxies a profile attribute update.
 */
export async function PUT(request: NextRequest) {
    const assertion = await getSessionAssertion();
    if (!assertion) {
        return notAuthenticated();
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: { defaultValue: 'Invalid request body.' } }, { status: 400 });
    }

    let response: Response;
    try {
        response = await fetch(`${USERS_ENDPOINT}/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${assertion}`,
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
    } catch (error) {
        console.error('Failed to reach the ThunderID users API:', error);
        return upstreamUnreachable();
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
}
