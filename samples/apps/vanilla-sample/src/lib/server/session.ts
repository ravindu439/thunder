// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'server-only';
import { cookies } from 'next/headers';
import { decodeAssertion } from './jwt';

// The one place the raw auth assertion is held. It never travels back to the browser as JSON,
// only as this httpOnly cookie, which client-side JavaScript cannot read.
const SESSION_COOKIE_NAME = 'tid_session';
const DEFAULT_MAX_AGE_SECONDS = 3600;

const resolveMaxAge = (assertion: string): number => {
    const exp = decodeAssertion(assertion)?.payload?.exp;
    if (typeof exp === 'number') {
        // An already-expired (or expiring-now) assertion must not fall back to the default
        // lifetime, since that would outlive the token it's supposed to track.
        return Math.max(0, exp - Math.floor(Date.now() / 1000));
    }
    return DEFAULT_MAX_AGE_SECONDS;
};

/**
 * Stores the auth assertion issued on flow completion in an httpOnly, secure cookie.
 */
export const setSessionCookie = async (assertion: string): Promise<void> => {
    const store = await cookies();
    store.set(SESSION_COOKIE_NAME, assertion, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: resolveMaxAge(assertion),
    });
};

/**
 * Reads the current session's auth assertion, or null if there isn't one.
 */
export const getSessionAssertion = async (): Promise<string | null> => {
    const store = await cookies();
    return store.get(SESSION_COOKIE_NAME)?.value ?? null;
};

/**
 * Ends the session by clearing the cookie.
 */
export const clearSessionCookie = async (): Promise<void> => {
    const store = await cookies();
    store.delete(SESSION_COOKIE_NAME);
};
