// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface RegexOrigin {
  regex: string;
}

/**
 * A single allowed origin: a literal string (including the `"null"` literal) or a regex entry.
 */
export type AllowedOrigin = string | RegexOrigin;

export interface CorsValue {
  allowedOrigins: AllowedOrigin[];
}

/**
 * A server-config section returned as three layers: `readOnly` (declarative), `writable`
 * (runtime-mutable), and `merged` (effective).
 */
export interface ServerConfigLayers<T> {
  /** Declarative baseline, not editable at runtime */
  readOnly: T;
  /** Runtime-mutable layer edited through the console */
  writable: T;
  /** Effective union of the read-only and writable layers */
  merged: T;
}

export type CorsConfigResponse = ServerConfigLayers<CorsValue>;
