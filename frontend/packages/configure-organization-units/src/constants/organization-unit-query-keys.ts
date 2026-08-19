// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for organization units feature cache management.
 *
 * @public
 * @remarks
 * These constants are used with TanStack Query to manage caching,
 * invalidation, and refetching of organization unit-related data.
 */
const OrganizationUnitQueryKeys = {
  /**
   * Base key for all organization unit list queries
   */
  ORGANIZATION_UNITS: 'organization-units',
  /**
   * Key for a single organization unit query
   */
  ORGANIZATION_UNIT: 'organization-unit',
  /**
   * Key for child organization units of a specific OU
   */
  CHILD_ORGANIZATION_UNITS: 'child-organization-units',
  /**
   * Key for users belonging to a specific OU
   */
  ORGANIZATION_UNIT_USERS: 'organization-unit-users',
  /**
   * Key for groups belonging to a specific OU
   */
  ORGANIZATION_UNIT_GROUPS: 'organization-unit-groups',
} as const;

export default OrganizationUnitQueryKeys;
