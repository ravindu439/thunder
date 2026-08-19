// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {IdentityProvider} from './identity-provider';

/**
 * Identity Provider Request Model
 *
 * Data structure used when creating or updating an identity provider.
 * This model is used for POST and PUT operations.
 *
 * @public
 * @example
 * ```typescript
 * const createGoogleIdp: IdentityProviderRequest = {
 *   name: 'Google',
 *   description: 'Login with Google',
 *   type: IdentityProviderTypes.GOOGLE,
 *   properties: [
 *     { name: 'clientId', value: 'your-client-id', isSecret: true },
 *     { name: 'clientSecret', value: 'your-client-secret', isSecret: true },
 *     { name: 'redirect_uri', value: 'https://localhost:5091/signin', isSecret: false },
 *     { name: 'scopes', value: 'openid,email,profile', isSecret: false }
 *   ]
 * };
 * ```
 */
export type IdentityProviderRequest = Omit<IdentityProvider, 'id'>;
