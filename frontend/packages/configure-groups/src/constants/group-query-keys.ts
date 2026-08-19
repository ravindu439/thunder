// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for the groups feature cache management.
 */
const GroupQueryKeys = {
  /** Base key for all group list queries */
  GROUPS: 'groups',
  /** Key for a single group query */
  GROUP: 'group',
  /** Key for group members queries */
  GROUP_MEMBERS: 'group-members',
} as const;

export default GroupQueryKeys;
