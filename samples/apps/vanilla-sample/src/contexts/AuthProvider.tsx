// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import AuthContext, { type DecodedAssertion } from './AuthContext';
import { getCurrentUserProfile, type UserProfile } from '../services/userProfileService';

/**
 * AuthProvider component to manage authentication state.
 *
 * Session state lives server-side in an httpOnly cookie (see src/lib/server/session.ts); this
 * provider is just a client-side cache of what GET /api/session reports.
 *
 * @param children - The children components to be wrapped by the AuthProvider.
 */
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [assertion, setAssertion] = useState<DecodedAssertion | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Bumped whenever a request should invalidate any older, still in-flight one. A response
    // arriving after resetAuthState() or a newer call is a stale result and must not overwrite
    // state set since it started.
    const requestIdRef = useRef(0);

    const completeAuthentication = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        try {
            const response = await fetch('/api/session', { headers: { Accept: 'application/json' } });
            const data = await response.json() as { authenticated?: boolean; assertion?: DecodedAssertion };
            if (requestIdRef.current !== requestId) return;
            setIsAuthenticated(Boolean(data.authenticated));
            setAssertion(data.assertion ?? null);
        } catch {
            if (requestIdRef.current !== requestId) return;
            setIsAuthenticated(false);
            setAssertion(null);
        }
    }, []);

    useEffect(() => {
        completeAuthentication().finally(() => setIsInitializing(false));
    }, [completeAuthentication]);

    const refreshUserProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setUserProfile(null);
            return null;
        }

        const requestId = ++requestIdRef.current;
        try {
            const profile = await getCurrentUserProfile();
            if (requestIdRef.current !== requestId) return null;
            setUserProfile(profile);
            return profile;
        } catch {
            if (requestIdRef.current !== requestId) return null;
            setUserProfile(null);
            return null;
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserProfile(null);
            return;
        }

        void refreshUserProfile();
    }, [isAuthenticated, refreshUserProfile]);

    const resetAuthState = useCallback(() => {
        requestIdRef.current++;
        setIsAuthenticated(false);
        setAssertion(null);
        setUserProfile(null);
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch('/api/session', { method: 'DELETE' });
        } finally {
            resetAuthState();
        }
    }, [resetAuthState]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isInitializing,
                assertion,
                userProfile,
                completeAuthentication,
                resetAuthState,
                logout,
                refreshUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
