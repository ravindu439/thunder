// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {TypographyProps} from '@wso2/oxygen-ui';

/**
 * Maps flow typography color enum names to Material UI color values.
 */
export const COLOR_ENUM_TO_MUI_MAP: Record<string, TypographyProps['color']> = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
  INFO: 'info',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};
