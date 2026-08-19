// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Contextual information attached to log entries.
 * Can include any metadata relevant to the log message.
 */
type LogContext = Record<string, unknown>;

export default LogContext;
