// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const AgentCreateFlowStep = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
  NAME: 'NAME',
  PROFILE: 'PROFILE',
  OWNER: 'OWNER',
} as const;

export type AgentCreateFlowStep = keyof typeof AgentCreateFlowStep;
