// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {AuthenticatorTypes} from '../authenticators';
import type {AuthenticatorType} from '../authenticators';

describe('AuthenticatorTypes', () => {
  it('should have CREDENTIALS_AUTH defined with correct value', () => {
    expect(AuthenticatorTypes.CREDENTIALS_AUTH).toBe('credentials_auth');
  });

  it('should have PASSKEY defined with correct value', () => {
    expect(AuthenticatorTypes.PASSKEY).toBe('passkey');
  });

  it('should have MAGIC_LINK defined with correct value', () => {
    expect(AuthenticatorTypes.MAGIC_LINK).toBe('magic_link');
  });

  it('should be a const object with expected keys', () => {
    expect(Object.keys(AuthenticatorTypes)).toEqual(['CREDENTIALS_AUTH', 'PASSKEY', 'MAGIC_LINK']);
  });

  it('should allow type-safe assignment', () => {
    const authenticator: AuthenticatorType = AuthenticatorTypes.CREDENTIALS_AUTH;
    expect(authenticator).toBe('credentials_auth');
  });

  it('should allow type-safe assignment for PASSKEY', () => {
    const authenticator: AuthenticatorType = AuthenticatorTypes.PASSKEY;
    expect(authenticator).toBe('passkey');
  });

  it('should allow type-safe assignment for MAGIC_LINK', () => {
    const authenticator: AuthenticatorType = AuthenticatorTypes.MAGIC_LINK;
    expect(authenticator).toBe('magic_link');
  });
});
