// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const response = await fetch("/runtime.json");
const runtimeConfig = (await response.json()) as {
    baseUrl?: string;
    clientId?: string;
    scopes?: string[] | string;
};

const normalizeScopes = (input?: string[] | string): string[] | undefined => {
    if (!input) {
        return undefined;
    }

    const parsedScopes = Array.isArray(input) ? input : input.split(/[\s,]+/);

    const scopes = parsedScopes
        .map((scope) => scope.trim())
        .filter((scope) => scope.length > 0);

    return scopes.length > 0 ? [...new Set(scopes)] : undefined;
};

const config = {
    clientId:
        runtimeConfig.clientId || import.meta.env.VITE_REACT_APP_CLIENT_ID,
    baseUrl: runtimeConfig.baseUrl || import.meta.env.VITE_THUNDERID_BASE_URL,
    scopes: normalizeScopes(
        runtimeConfig.scopes ?? import.meta.env.VITE_REACT_APP_SCOPES,
    ),
};

export default config;
