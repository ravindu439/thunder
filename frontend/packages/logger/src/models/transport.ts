// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type LogEntry from './log-entry';
import type LogLevel from './log-level';

/**
 * Interface that all transport implementations must satisfy.
 * Transports are responsible for outputting log entries to their destination.
 */
interface Transport {
  /**
   * Get the name/type of this transport.
   */
  getName(): string;

  /**
   * Write a log entry to the transport's destination.
   * @param entry - The log entry to write
   * @returns Promise that resolves when the write is complete
   */
  write(entry: LogEntry): Promise<void>;

  /**
   * Flush any buffered log entries.
   * @returns Promise that resolves when all buffered entries are written
   */
  flush(): Promise<void>;

  /**
   * Close the transport and release any resources.
   * @returns Promise that resolves when the transport is closed
   */
  close(): Promise<void>;

  /**
   * Get the minimum log level this transport handles.
   */
  getLevel(): LogLevel;

  /**
   * Check if this transport should handle a given log level.
   * @param level - The log level to check
   */
  shouldLog(level: LogLevel): boolean;
}

export default Transport;
