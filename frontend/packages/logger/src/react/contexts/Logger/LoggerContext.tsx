// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Context, createContext} from 'react';
import type Logger from '../../../core/Logger';

/**
 * Logger context interface that provides access to the logger instance.
 *
 * @public
 */
export type LoggerContextType = Logger | null;

/**
 * React context for accessing the logger instance throughout the application.
 *
 * This context provides access to the logger configured via the LoggerProvider.
 * It should be used within a `LoggerProvider` component.
 *
 * @example
 * ```tsx
 * import LoggerContext from './LoggerContext';
 * import { useContext } from 'react';
 *
 * const MyComponent = () => {
 *   const logger = useContext(LoggerContext);
 *   if (!logger) {
 *     throw new Error('Component must be used within LoggerProvider');
 *   }
 *
 *   logger.info('Component rendered');
 *   return <div>Hello World</div>;
 * };
 * ```
 *
 * @public
 */
const LoggerContext: Context<LoggerContextType> = createContext<LoggerContextType>(null);

export default LoggerContext;
