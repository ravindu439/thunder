// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type LogEntry from '../models/log-entry';
import LogLevel, {LOG_LEVEL_PRIORITY} from '../models/log-level';
import type Transport from '../models/transport';

/**
 * Abstract base class for transport implementations.
 * Provides common functionality for log level filtering.
 */
export default abstract class BaseTransport implements Transport {
  protected level: LogLevel;

  protected name: string;

  constructor(name: string, level?: LogLevel) {
    this.name = name;
    this.level = level ?? LogLevel.DEBUG;
  }

  getName(): string {
    return this.name;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.level];
  }

  abstract write(entry: LogEntry): Promise<void>;

  async flush(): Promise<void> {
    // Default implementation does nothing
    // Subclasses can override for buffering support
  }

  async close(): Promise<void> {
    // Default implementation does nothing
    // Subclasses can override for cleanup
  }
}
