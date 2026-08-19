// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import BaseTransport from '../core/BaseTransport';
import type LogEntry from '../models/log-entry';
import type LogLevel from '../models/log-level';
import {hasProcess} from '../utils/detectEnvironment';
import formatTimestamp from '../utils/formatTimestamp';
import serializeError from '../utils/serializeError';

/**
 * Options for configuring the stdout transport.
 */
export interface StdoutTransportOptions {
  /**
   * Whether to output as JSON lines.
   * @default true
   */
  json?: boolean;

  /**
   * Whether to include timestamps.
   * @default true
   */
  timestamps?: boolean;
}

/**
 * Stdout transport for Node.js environments.
 * Writes structured JSON logs to stdout.
 */
export default class StdoutTransport extends BaseTransport {
  private options: Required<StdoutTransportOptions>;

  constructor(level?: LogLevel, options: StdoutTransportOptions = {}) {
    super('stdout', level);
    this.options = {
      json: options.json ?? true,
      timestamps: options.timestamps ?? true,
    };
  }

  write(entry: LogEntry): Promise<void> {
    if (!hasProcess()) {
      return Promise.resolve();
    }

    const {level, message, timestamp, context, component, error} = entry;

    if (this.options.json) {
      // Structured JSON output
      const logObject: Record<string, unknown> = {
        level,
        message,
      };

      if (this.options.timestamps) {
        logObject['timestamp'] = formatTimestamp(timestamp);
      }

      if (component) {
        logObject['component'] = component;
      }

      if (context && Object.keys(context).length > 0) {
        logObject['context'] = context;
      }

      if (error) {
        logObject['error'] = serializeError(error);
      }

      // Write to stdout
      process.stdout.write(`${JSON.stringify(logObject)}\n`);
    } else {
      // Plain text output
      const parts: string[] = [];

      if (this.options.timestamps) {
        parts.push(`[${formatTimestamp(timestamp)}]`);
      }

      parts.push(`[${level.toUpperCase()}]`);

      if (component) {
        parts.push(`[${component}]`);
      }

      parts.push(message);

      let output = parts.join(' ');

      if (context && Object.keys(context).length > 0) {
        output += ` ${JSON.stringify(context)}`;
      }

      if (error) {
        output += ` Error: ${JSON.stringify(serializeError(error))}`;
      }

      process.stdout.write(`${output}\n`);
    }

    return Promise.resolve();
  }
}
