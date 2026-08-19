// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { UPSTREAM_TIMEOUT_MS, USERS_ENDPOINT } from '@/lib/server/thunderid';
import { getSessionAssertion } from '@/lib/server/session';

/**
 * Proxies a password update for the current user.
 */
export async function POST(request: NextRequest) {
    const assertion = await getSessionAssertion();
    if (!assertion) {
        return NextResponse.json({ message: { defaultValue: 'Not authenticated.' } }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: { defaultValue: 'Invalid request body.' } }, { status: 400 });
    }

    let response: Response;
    try {
        response = await fetch(`${USERS_ENDPOINT}/me/update-credentials`, {
            method: 'POST',
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
        return NextResponse.json(
            { message: { defaultValue: 'A network error occurred while contacting the ThunderID server.' } },
            { status: 503 },
        );
    }

    // 204 No Content on success. A Response cannot carry a body at this status.
    if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
}
