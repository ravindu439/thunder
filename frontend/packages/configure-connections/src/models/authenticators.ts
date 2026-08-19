// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Authenticator Types
 *
 * Supported authenticator types in the platform.
 * These represent different authentication methods and protocols.
 *
 * @public
 */
export const AuthenticatorTypes = {
  CREDENTIALS_AUTH: 'credentials_auth',
  PASSKEY: 'passkey',
  MAGIC_LINK: 'magic_link',
} as const;

/**
 * Authenticator Type
 *
 * Type alias that derives all supported authenticator values
 * from {@link AuthenticatorTypes}.
 *
 * @public
 * @example
 * ```ts
 * const authenticator: AuthenticatorType = AuthenticatorTypes.CREDENTIALS_AUTH;
 * ```
 */
export type AuthenticatorType = (typeof AuthenticatorTypes)[keyof typeof AuthenticatorTypes];
