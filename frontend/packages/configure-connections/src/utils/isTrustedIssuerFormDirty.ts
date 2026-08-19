// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {TrustedIssuerFormData} from '../models/trusted-issuer';

/** Fields compared to detect unsaved changes, in the order they appear on the form. */
const TRUSTED_ISSUER_FORM_FIELDS: (keyof TrustedIssuerFormData)[] = [
  'name',
  'issuer',
  'jwksEndpoint',
  'idJagEnabled',
  'tokenExchangeEnabled',
  'trustedTokenAudience',
];

/** Fields where the form maps an empty string to `undefined`, so the two should compare equal. */
const EMPTY_STRING_AS_UNDEFINED_FIELDS: (keyof TrustedIssuerFormData)[] = ['trustedTokenAudience'];

function normalize(field: keyof TrustedIssuerFormData, value: unknown): unknown {
  if (EMPTY_STRING_AS_UNDEFINED_FIELDS.includes(field) && value === '') {
    return undefined;
  }
  return value;
}

/**
 * Whether `values` differs from `baseline` on any known trusted-issuer form field. Compares
 * fields individually (rather than via `JSON.stringify`) so that key order and `undefined` vs.
 * missing keys don't produce false positives.
 */
export default function isTrustedIssuerFormDirty(
  values: TrustedIssuerFormData,
  baseline: TrustedIssuerFormData,
): boolean {
  return TRUSTED_ISSUER_FORM_FIELDS.some(
    (field) => normalize(field, values[field]) !== normalize(field, baseline[field]),
  );
}
