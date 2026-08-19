// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { useThunderID } from "@thunderid/react";
import { useNavigate } from "react-router";
import { clearChatAccessToken } from "./chatTokenService";
import { AUTH_CONFIG } from "./config";
import { useNativeAuth } from "./NativeAuthContext";
import { signOutNatively } from "./nativeAuthService";

export function useAuth() {
  const thunderIDCtx = useThunderID();
  const nativeCtx = useNativeAuth();
  const navigate = useNavigate();

  if (AUTH_CONFIG.isRedirectBased) {
    return {
      isSignedIn: thunderIDCtx.isSignedIn,
      isLoading: thunderIDCtx.isLoading,
      user: thunderIDCtx.user,
      signIn: () => thunderIDCtx.signIn({ acr_values: "urn:thunder:auth:user" }),
      // OIDC RP-initiated logout: the SDK redirects to the end_session_endpoint, which ends the
      // SSO session server-side and returns the browser to afterSignOutUrl. That URL must be
      // registered as a post-logout redirect URI on the application. On success the SDK navigates
      // away, so the fallback below only runs if the logout redirect could not be issued.
      signOut: async () => {
        clearChatAccessToken();
        try {
          await thunderIDCtx.signOut();
        } catch {
          window.location.replace("/flights");
        }
      },
      getAccessToken: thunderIDCtx.getAccessToken,
    };
  }

  return {
    isSignedIn: nativeCtx?.isSignedIn ?? false,
    isLoading: nativeCtx?.isLoading ?? false,
    user: nativeCtx?.user ?? null,
    signIn: () => navigate("/signin"),
    // App-native sign out: the sign-out flow is driven through the flow API, exactly like
    // sign-in, so no redirect out of the app is needed to end the SSO session.
    signOut: async () => {
      clearChatAccessToken();
      try {
        await signOutNatively();
      } catch (error) {
        console.error("Failed to end the SSO session", error);
      }
      nativeCtx?.clearToken();
      window.location.replace("/flights");
    },
    getAccessToken: nativeCtx?.getAccessToken ?? (() => Promise.resolve(null)),
  };
}
