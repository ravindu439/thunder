// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {BasicIdentityProvider, IdentityProvider} from './identity-provider';

/**
 * Type alias for basic identity provider list responses
 * @public
 */
export type IdentityProviderListResponse = BasicIdentityProvider[];

/**
 * Type alias for full identity provider response
 * @public
 */
export type IdentityProviderResponse = IdentityProvider;
