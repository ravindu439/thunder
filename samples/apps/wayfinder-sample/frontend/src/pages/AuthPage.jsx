// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { Navigate } from "react-router";
import { AUTH_CONFIG } from "../auth/config";
import { NativeAuthPage } from "./NativeAuthPage";
import { NativeVerboseAuthPage } from "./NativeVerboseAuthPage";

export function AuthPage() {
  if (AUTH_CONFIG.isRedirectBased) return <Navigate to="/" replace />;
  if (AUTH_CONFIG.isVerbose) return <NativeVerboseAuthPage />;
  return <NativeAuthPage />;
}
