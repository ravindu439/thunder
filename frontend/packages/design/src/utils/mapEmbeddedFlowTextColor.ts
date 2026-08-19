// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {TypographyProps} from '@wso2/oxygen-ui';

/**
 * Maps flow typography color enum names to Material UI color values
 * for consistent text styling across embedded flow components.
 *
 * @param colorEnum - The color enum value (e.g., 'ERROR', 'SUCCESS')
 * @returns The mapped MUI color value (e.g., 'error', 'success'), or undefined if not found
 */
export function mapEmbeddedFlowTextColor(colorEnum: string | undefined): TypographyProps['color'] | undefined {
  switch (colorEnum) {
    case 'ERROR':
      return 'error';
    case 'WARNING':
      return 'warning';
    case 'SUCCESS':
      return 'success';
    case 'INFO':
      return 'info';
    case 'PRIMARY':
      return 'primary';
    case 'SECONDARY':
      return 'secondary';
    default:
      return undefined;
  }
}

export default mapEmbeddedFlowTextColor;
