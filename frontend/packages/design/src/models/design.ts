// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Enumeration of supported design resolution types.
 * Used to specify the type of entity for which design configuration should be resolved.
 */
export const DesignResolveType = {
  /** Application-level design */
  APP: 'APP',

  /** Organizational Unit-level design */
  OU: 'OU',
} as const;

/**
 * Union type representing the possible design resolution types.
 * @example 'APP' | 'OU'
 */
export type DesignResolveType = (typeof DesignResolveType)[keyof typeof DesignResolveType];
