// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type LogLevel from './log-level';
import type Transport from './transport';

/**
 * Configuration for creating a transport instance.
 */
export interface TransportConfig {
  /**
   * The type of transport to create.
   * Built-in types: 'console', 'stdout', 'http'
   * Custom types can be registered via the transport factory.
   */
  type: string;

  /**
   * Minimum log level this transport should handle.
   * @default LogLevel.DEBUG
   */
  level?: LogLevel;

  /**
   * Transport-specific configuration options.
   */
  options?: Record<string, unknown>;
}

/**
 * Factory function type for creating custom transports.
 */
export type TransportFactory = (config: TransportConfig) => Transport;

export default TransportConfig;
