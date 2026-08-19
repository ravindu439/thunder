// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Runtime environment detection results.
 */
interface RuntimeEnvironment {
  /**
   * Whether the code is running in a browser.
   */
  isBrowser: boolean;

  /**
   * Whether the code is running in Node.js.
   */
  isNode: boolean;

  /**
   * Whether the code is running in development mode.
   */
  isDevelopment: boolean;

  /**
   * Whether the code is running in production mode.
   */
  isProduction: boolean;
}

export default RuntimeEnvironment;
