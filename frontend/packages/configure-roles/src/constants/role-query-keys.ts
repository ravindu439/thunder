// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for the roles feature cache management.
 */
const RoleQueryKeys = {
  /** Base key for all role list queries */
  ROLES: 'roles',
  /** Key for a single role query */
  ROLE: 'role',
  /** Key for role assignments queries */
  ROLE_ASSIGNMENTS: 'role-assignments',
} as const;

export default RoleQueryKeys;
