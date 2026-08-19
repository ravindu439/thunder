// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {LayoutConfig} from '../models/layout';
import type {DesignResolveResponse} from '../models/responses';

/**
 * Extracts layout configuration from design resolve data.
 *
 * @param design - The resolved design configuration
 * @returns The LayoutConfig object if found, or `undefined`
 *
 * @public
 */
export default function extractLayoutFromDesign(design?: DesignResolveResponse): LayoutConfig | undefined {
  return design?.layout;
}
