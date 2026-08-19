// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import { decodeAssertion } from '@/lib/server/jwt';
import { clearSessionCookie, getSessionAssertion } from '@/lib/server/session';

/**
 * Reports whether the browser has an active session, and hands back the decoded (non-secret)
 * claims from the assertion so the sample can still display "what's in your auth assertion";
 * the raw, replayable JWT string itself never leaves the server.
 */
export async function GET() {
    const assertion = await getSessionAssertion();
    if (!assertion) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
        authenticated: true,
        assertion: decodeAssertion(assertion),
    });
}

/**
 * Logs the current session out by clearing the session cookie.
 */
export async function DELETE() {
    await clearSessionCookie();
    return NextResponse.json({ authenticated: false });
}
