// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for agent types feature cache management.
 */
const AgentTypeQueryKeys = {
  /**
   * Base key for all agent type list queries
   */
  AGENT_TYPES: 'agent-types',
  /**
   * Key for a single agent type query
   */
  AGENT_TYPE: 'agent-type',
} as const;

export default AgentTypeQueryKeys;
