// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * User type creation step identifiers used in the creation wizard flow
 * to track the current step and navigate between steps.
 *
 * @public
 */
export const UserTypeCreateFlowStep = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
  NAME: 'NAME',
  PROPERTIES: 'PROPERTIES',
} as const;

/**
 * User type creation step type
 *
 * @public
 */
export type UserTypeCreateFlowStep = keyof typeof UserTypeCreateFlowStep;
