// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for the mocked SCIM connections store. Kept separate from
 * `ConnectionQueryKeys` since this list is not backed by the real `/connections` API.
 */
const ScimConnectionQueryKeys = {
  LIST: 'scim-connections',
  DETAIL: 'scim-connection',
} as const;

export default ScimConnectionQueryKeys;
