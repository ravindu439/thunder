// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import type {TrustedIssuerFormData} from '../../models/trusted-issuer';
import isTrustedIssuerFormDirty from '../isTrustedIssuerFormDirty';

const BASELINE: TrustedIssuerFormData = {
  name: 'Acme Okta',
  issuer: 'https://acme.okta.com',
  jwksEndpoint: 'https://acme.okta.com/keys',
  idJagEnabled: true,
  tokenExchangeEnabled: false,
  trustedTokenAudience: undefined,
};

describe('isTrustedIssuerFormDirty', () => {
  it('should return false when values equal the baseline', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE}, BASELINE)).toBe(false);
  });

  it('should return false when key order differs but values are equal', () => {
    const values: TrustedIssuerFormData = {
      trustedTokenAudience: undefined,
      tokenExchangeEnabled: false,
      idJagEnabled: true,
      jwksEndpoint: 'https://acme.okta.com/keys',
      issuer: 'https://acme.okta.com',
      name: 'Acme Okta',
    };

    expect(isTrustedIssuerFormDirty(values, BASELINE)).toBe(false);
  });

  it('should return false when trustedTokenAudience is an empty string and baseline is undefined', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, trustedTokenAudience: ''}, BASELINE)).toBe(false);
  });

  it('should return true when name changes', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, name: 'Beta AD'}, BASELINE)).toBe(true);
  });

  it('should return true when issuer changes', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, issuer: 'https://beta.example.com'}, BASELINE)).toBe(true);
  });

  it('should return true when jwksEndpoint changes', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, jwksEndpoint: 'https://beta.example.com/keys'}, BASELINE)).toBe(true);
  });

  it('should return true when idJagEnabled changes', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, idJagEnabled: false}, BASELINE)).toBe(true);
  });

  it('should return true when tokenExchangeEnabled changes', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, tokenExchangeEnabled: true}, BASELINE)).toBe(true);
  });

  it('should return true when trustedTokenAudience changes to a non-empty value', () => {
    expect(isTrustedIssuerFormDirty({...BASELINE, trustedTokenAudience: 'my-external-client-id'}, BASELINE)).toBe(true);
  });
});
