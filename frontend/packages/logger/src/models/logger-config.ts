// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type LogContext from './log-context';
import type LogLevel from './log-level';
import type Transport from './transport';

/**
 * Configuration options for a logger instance.
 */
interface LoggerConfig {
  /**
   * Minimum log level to process. Logs below this level will be ignored.
   * @default LogLevel.INFO
   */
  level?: LogLevel | 'debug' | 'info' | 'warn' | 'error' | 'none';

  /**
   * Whether logging is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Array of transports to use for log output.
   * If not provided, a default transport will be automatically selected
   * based on the runtime environment (Console for browser, Stdout for Node.js).
   */
  transports?: Transport[];

  /**
   * Default context to include in all log entries from this logger.
   */
  context?: LogContext;

  /**
   * Component name to identify the source of logs.
   */
  component?: string;

  /**
   * Whether to mask sensitive data in logs.
   * @default false
   */
  maskSensitiveData?: boolean;
}

export default LoggerConfig;
