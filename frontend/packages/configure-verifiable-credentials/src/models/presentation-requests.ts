// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/** Request body for creating a presentation definition. */
export interface CreateVerifiablePresentationRequest {
  handle: string;
  ouId: string;
  name?: string;
  description?: string;
  vct: string;
  format?: string;
  mandatoryClaims?: string[];
  optionalClaims?: string[];
  claimValues?: Record<string, string[]>;
  enforceTrustedIssuer?: boolean;
  trustedAuthorities?: string[];
}

/** Request body for updating a presentation definition. */
export type UpdateVerifiablePresentationRequest = CreateVerifiablePresentationRequest;
