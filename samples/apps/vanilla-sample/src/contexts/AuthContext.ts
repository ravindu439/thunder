// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';
import type { UserProfile } from '../services/userProfileService';

/**
 * The decoded (non-secret) claims of the session's auth assertion, as returned by GET
 * /api/session. The raw, replayable JWT string never reaches the browser.
 */
export interface DecodedAssertion {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
}

/**
 * AuthContext provides authentication state management for the application. No bearer token is
 * held here; the assertion lives only in an httpOnly cookie set by the server. This context just
 * mirrors what the server already knows.
 */
type AuthContextType = {
    isAuthenticated: boolean;
    isInitializing: boolean;
    assertion: DecodedAssertion | null;
    userProfile: UserProfile | null;
    /** Re-checks the session with the server. Call after a flow response reports assertionIssued. */
    completeAuthentication: () => Promise<void>;
    /** Clears local auth state only. Used to reset stale UI state before a new flow attempt. */
    resetAuthState: () => void;
    /** Ends the session on the server and clears local state. */
    logout: () => Promise<void>;
    refreshUserProfile: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
