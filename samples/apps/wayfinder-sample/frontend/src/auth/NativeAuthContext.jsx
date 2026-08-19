// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "wf_native_token";

export const NativeAuthContext = createContext(null);

function decodeJWTPayload(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJWTPayload(token);
  if (!payload?.exp) return false;
  return Date.now() / 1000 >= payload.exp;
}

export function NativeAuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && isTokenExpired(stored)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  });

  const user = token ? decodeJWTPayload(token) : null;

  function setToken(accessToken) {
    sessionStorage.setItem(STORAGE_KEY, accessToken);
    setTokenState(accessToken);
  }

  function clearToken() {
    sessionStorage.removeItem(STORAGE_KEY);
    setTokenState(null);
  }

  async function getAccessToken() {
    if (!token) return null;
    if (isTokenExpired(token)) {
      clearToken();
      return null;
    }
    return token;
  }

  return (
    <NativeAuthContext.Provider
      value={{
        isSignedIn: Boolean(token),
        isLoading: false,
        user,
        token,
        setToken,
        clearToken,
        getAccessToken,
      }}
    >
      {children}
    </NativeAuthContext.Provider>
  );
}

export function useNativeAuth() {
  return useContext(NativeAuthContext);
}
