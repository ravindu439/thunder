// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type LogContext from './log-context';
import type LogLevel from './log-level';

/**
 * A structured log entry containing all information about a log event.
 */
interface LogEntry {
  /**
   * The severity level of the log message.
   */
  level: LogLevel;

  /**
   * The log message text.
   */
  message: string;

  /**
   * Timestamp when the log was created.
   */
  timestamp: Date;

  /**
   * Optional contextual metadata for the log entry.
   */
  context?: LogContext;

  /**
   * Optional component or module name that generated the log.
   */
  component?: string;

  /**
   * Optional error object for error-level logs.
   */
  error?: Error;
}

export default LogEntry;
