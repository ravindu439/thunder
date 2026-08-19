// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// TEMPORARY: mirrors apps/console/src/features/agents/constants/agent-query-keys.ts. The agents
// feature hasn't been extracted into @thunderid/configure-agents yet; once it is, this file
// should be deleted and AddAssignmentDialog should import from that package instead.

const AgentQueryKeys = {
  AGENTS: 'agents',
  AGENT: 'agent',
  AGENT_GROUPS: 'agentGroups',
  AGENT_ROLES: 'agentRoles',
} as const;

export default AgentQueryKeys;
