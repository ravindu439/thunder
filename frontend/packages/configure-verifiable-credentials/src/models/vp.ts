// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * An OpenID4VP presentation definition managed in the console. Trusted issuers
 * and the verifier identity are deployment-level configuration shared by all
 * definitions (global trust) and are not part of this model.
 */
export interface VerifiablePresentation {
  id: string;
  handle: string;
  ouId: string;
  ouHandle?: string;
  name?: string;
  description?: string;
  vct: string;
  format: string;
  mandatoryClaims?: string[];
  optionalClaims?: string[];
  /**
   * Per-claim value constraints (claim path -> allowed values). When a
   * constrained claim is disclosed, its value must match one of these.
   */
  claimValues?: Record<string, string[]>;
  /**
   * When set, overrides the deployment default for whether issuer trust is
   * enforced for this definition. Omitted means inherit the default.
   */
  enforceTrustedIssuer?: boolean;
  /**
   * Names of the trust anchors accepted for this definition. Empty or omitted
   * means accept any configured trust anchor.
   */
  trustedAuthorities?: string[];
}

/**
 * Minimal projection returned by the list endpoint — only the fields the
 * management table renders. Use VerifiablePresentation for the detail view.
 */
export interface VerifiablePresentationSummary {
  id: string;
  handle: string;
  ouId: string;
  ouHandle?: string;
  name?: string;
  vct: string;
  format: string;
}

/** The list endpoint returns a plain array of presentation definition summaries. */
export type VPListResponse = VerifiablePresentationSummary[];

/** Response of initiating an OpenID4VP verification transaction. */
export interface InitiateVerificationResponse {
  txn_id: string;
  wallet_url: string;
  status_url?: string;
  expires_at?: string;
}

/** Status of an OpenID4VP verification transaction. */
export interface VerificationStatusResponse {
  status: string;
  result_token?: string;
  error?: string;
}

/** A registered trust anchor (issuer trust) returned by the server. */
export interface TrustAnchor {
  name: string;
  subject: string;
  ski: string;
  not_after: string;
}
