// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {EmbeddedFlowTextVariant} from '@thunderid/react';
import type {TypographyVariant} from '@wso2/oxygen-ui';

/**
 * Maps EmbeddedFlowTextVariant enum values to corresponding MUI Typography variants
 * for consistent text styling across embedded flow components.
 *
 * @param variant - The EmbeddedFlowTextVariant to map
 * @returns The corresponding MUI TypographyVariant
 *
 * @example
 * ```tsx
 * import {mapEmbeddedFlowTextVariant} from '@thunderid/design';
 *
 * const variant = mapEmbeddedFlowTextVariant(EmbeddedFlowTextVariant.Heading1);
 * // Returns 'h2'
 *
 * <Typography variant={variant}>
 *   My Heading
 * </Typography>
 * ```
 */
export function mapEmbeddedFlowTextVariant(variant: EmbeddedFlowTextVariant | string | undefined): TypographyVariant {
  switch (variant) {
    case EmbeddedFlowTextVariant.Heading1:
      return 'h1';
    case EmbeddedFlowTextVariant.Heading2:
      return 'h2';
    case EmbeddedFlowTextVariant.Heading3:
      return 'h3';
    case EmbeddedFlowTextVariant.Heading4:
      return 'h4';
    case EmbeddedFlowTextVariant.Heading5:
      return 'h5';
    case EmbeddedFlowTextVariant.Heading6:
      return 'h6';
    case EmbeddedFlowTextVariant.Subtitle1:
      return 'subtitle1';
    case EmbeddedFlowTextVariant.Subtitle2:
      return 'subtitle2';
    case EmbeddedFlowTextVariant.Body1:
      return 'body1';
    case EmbeddedFlowTextVariant.Body2:
      return 'body2';
    case EmbeddedFlowTextVariant.Caption:
      return 'caption';
    case EmbeddedFlowTextVariant.Overline:
      return 'overline';
    default:
      // Default fallback for unknown or undefined variants
      return 'body1';
  }
}

export default mapEmbeddedFlowTextVariant;
