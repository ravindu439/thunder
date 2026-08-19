// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * General user constants.
 */
const UserConstants = {
  /**
   * Fallback avatar prefix rendered when a user has no picture set. Append the user's initials as `content`.
   */
  DEFAULT_AVATAR_PREFIX: 'avatar:shape=circle,variant=two_letter,colors=0,content=',
} as const;

export default UserConstants;
