// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import type RuntimeEnvironment from '../models/runtime-environment';

interface ImportMetaEnv {
  DEV?: boolean;
  PROD?: boolean;
  [key: string]: unknown;
}

interface ImportMeta {
  env?: ImportMetaEnv;
}

/**
 * Detect the current runtime environment.
 * @returns Runtime environment information
 */
export default function detectEnvironment(): RuntimeEnvironment {
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isNode = typeof process !== 'undefined' && process.versions?.node != null;

  // Detect development mode
  let isDevelopment = false;
  let isProduction = false;

  try {
    // Try Vite environment detection
    if (typeof import.meta !== 'undefined' && (import.meta as ImportMeta).env !== undefined) {
      isDevelopment = (import.meta as ImportMeta).env?.DEV === true;
      isProduction = (import.meta as ImportMeta).env?.PROD === true;
    }
  } catch {
    // import.meta may not be available in all contexts
  }

  // Fallback to Node.js environment detection
  if (!isDevelopment && !isProduction && isNode) {
    isDevelopment = process.env['NODE_ENV'] === 'development';
    isProduction = process.env['NODE_ENV'] === 'production';
  }

  return {
    isBrowser,
    isNode,
    isDevelopment,
    isProduction,
  };
}

/**
 * Safely check if console is available.
 * @returns True if console is available
 */
export function hasConsole(): boolean {
  return typeof console !== 'undefined' && typeof console.log === 'function';
}

/**
 * Safely check if process is available.
 * @returns True if process is available
 */
export function hasProcess(): boolean {
  return typeof process !== 'undefined' && typeof process.stdout !== 'undefined';
}
