// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const AUTH_CONFIG = {
  isRedirectBased: import.meta.env.VITE_AUTH_IS_REDIRECT_BASED !== "false",
  isVerbose: import.meta.env.VITE_AUTH_IS_VERBOSE === "true",
};

const AI_FEATURES_ENABLED = import.meta.env.VITE_AI_FEATURES_ENABLED === "true";

export const BOOKING_SCOPES = [
  "openid",
  "profile",
  "email",
  "ou",
  "booking:read",
  "booking:create",
  "booking:cancel",
];

export const CHAT_SCOPES = AI_FEATURES_ENABLED ? ["agent:access"] : [];

export const SCOPES = BOOKING_SCOPES;
