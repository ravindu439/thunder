// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Group creation step identifiers used in the creation wizard flow
 * to track the current step and navigate between steps.
 *
 * @public
 */
export const GroupCreateFlowStep = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
  NAME: 'NAME',
} as const;

/**
 * Group creation step type
 *
 * @public
 */
export type GroupCreateFlowStep = keyof typeof GroupCreateFlowStep;
