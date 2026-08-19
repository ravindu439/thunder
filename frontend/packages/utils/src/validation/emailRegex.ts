// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Regex pattern for basic email address validation.
 * Checks that the value has a local part, an `@` symbol, and a domain part with a dot.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
