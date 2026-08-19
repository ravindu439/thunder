// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Role creation step identifiers used in the creation wizard flow
 * to track the current step and navigate between steps.
 *
 * @public
 */
export const RoleCreateFlowStep = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
  BASIC_INFO: 'BASIC_INFO',
  PERMISSIONS: 'PERMISSIONS',
} as const;

/**
 * Role creation step type.
 *
 * @public
 */
export type RoleCreateFlowStep = keyof typeof RoleCreateFlowStep;
