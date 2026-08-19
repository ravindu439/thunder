// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {createContext, type Context} from 'react';
import type {LayoutConfig} from '../../models/layout';
import type {DesignResolveResponse} from '../../models/responses';
import type {Theme} from '../../models/theme';

/**
 * Design context interface that provides access to design configuration
 * and utility methods for design-related operations.
 *
 * @public
 */
export interface DesignContextType {
  /**
   * The complete design data resolved from the server
   */
  design?: DesignResolveResponse;

  /**
   * Whether design is enabled and loaded
   */
  isDesignEnabled: boolean;

  /**
   * Whether design data is currently being loaded
   */
  isLoading: boolean;

  /**
   * Any error that occurred while loading design data
   */
  error?: Error | null;

  /**
   * The theme resolved from design data (directly accessible)
   */
  theme?: Theme;

  /**
   * The layout configuration from design data (directly accessible)
   */
  layout?: LayoutConfig;
}

/**
 * React context for accessing design configuration throughout the application.
 *
 * This context provides access to the design data loaded from the server, resolved theme,
 * and layout configuration. It should be used within a `DesignProvider` component.
 *
 * @public
 */
const DesignContext: Context<DesignContextType | undefined> = createContext<DesignContextType | undefined>(undefined);

export default DesignContext;
