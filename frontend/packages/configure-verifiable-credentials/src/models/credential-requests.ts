// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ClaimMapping, CredentialDisplay} from './vc';

/** Request body for creating a credential configuration. */
export interface CreateVerifiableCredentialRequest {
  handle: string;
  ouId: string;
  name?: string;
  description?: string;
  format?: string;
  vct: string;
  claims?: ClaimMapping[];
  display?: CredentialDisplay;
  validitySeconds?: number;
}

/** Request body for updating a credential configuration. */
export type UpdateVerifiableCredentialRequest = CreateVerifiableCredentialRequest;
