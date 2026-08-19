// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// React-specific exports
export {default as LoggerContext} from './react/contexts/Logger/LoggerContext';
export type {LoggerContextType} from './react/contexts/Logger/LoggerContext';

export {default as LoggerProvider} from './react/contexts/Logger/LoggerProvider';
export type {LoggerProviderProps} from './react/contexts/Logger/LoggerProvider';

export {default as useLogger} from './react/contexts/Logger/useLogger';

// Re-export core logger class and types for convenience
export {default as Logger} from './core/Logger';
export {default as LogLevel} from './models/log-level';
export type {default as LoggerConfig} from './models/logger-config';
export type {default as LogContext} from './models/log-context';

// Re-export transports for convenience
export {default as ConsoleTransport} from './transports/ConsoleTransport';
export {default as StdoutTransport} from './transports/StdoutTransport';
export {default as HttpTransport} from './transports/HttpTransport';
