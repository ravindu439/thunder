// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMemo, useRef, type PropsWithChildren} from 'react';
import LoggerContext from './LoggerContext';
import Logger, {createLogger} from '../../../core/Logger';
import type LoggerConfig from '../../../models/logger-config';

/**
 * Props for the LoggerProvider component.
 *
 * @public
 */
export interface LoggerProviderProps extends PropsWithChildren {
  /**
   * Logger instance or configuration.
   * If a Logger instance is provided, it will be used directly.
   * If configuration is provided, a new Logger will be created.
   * If not provided, a default logger will be created.
   */
  logger?: Logger | LoggerConfig;
}

/**
 * React context provider component that provides a logger instance
 * to all child components.
 *
 * This component accepts either a Logger instance or configuration and provides
 * it through React context. Child components can access the logger using the
 * `useLogger` hook.
 *
 * **Performance Note:** When passing a Logger instance, it should be stable
 * (created outside the component or memoized). When passing LoggerConfig,
 * the provider will maintain a stable logger instance across renders.
 *
 * @param props - The component props
 * @param props.logger - Logger instance or configuration
 * @param props.children - React children to be wrapped with the logger context
 *
 * @returns JSX element that provides logger context to children
 *
 * @example
 * Using with configuration:
 * ```tsx
 * import LoggerProvider from './LoggerProvider';
 * import { LogLevel } from '@thunderid/logger';
 * import App from './App';
 *
 * function Root() {
 *   return (
 *     <LoggerProvider logger={{ level: LogLevel.INFO }}>
 *       <App />
 *     </LoggerProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Using with Logger instance (recommended for better performance):
 * ```tsx
 * import LoggerProvider from './LoggerProvider';
 * import { Logger } from '@thunderid/logger';
 *
 * // Create logger outside component to maintain stable reference
 * const logger = new Logger({ level: LogLevel.DEBUG });
 *
 * function Root() {
 *   return (
 *     <LoggerProvider logger={logger}>
 *       <App />
 *     </LoggerProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function LoggerProvider({logger, children}: LoggerProviderProps) {
  // Use ref to maintain stable logger instance when config is passed
  const loggerInstanceRef = useRef<Logger | null>(null);
  const configHashRef = useRef<string>('');

  const loggerInstance = useMemo(() => {
    // If logger is a Logger instance, use it directly
    if (logger instanceof Logger) {
      loggerInstanceRef.current = logger;
      return logger;
    }

    // If no logger provided, create default once
    if (!logger) {
      loggerInstanceRef.current ??= createLogger();

      return loggerInstanceRef.current;
    }

    // For LoggerConfig, create a stable hash to detect changes
    const configHash = JSON.stringify({
      level: logger.level,
      enabled: logger.enabled,
      transportCount: logger.transports?.length ?? 0,
      component: logger.component,
      maskSensitiveData: logger.maskSensitiveData,
    });

    // Only recreate logger if config actually changed
    if (configHash !== configHashRef.current || !loggerInstanceRef.current) {
      configHashRef.current = configHash;
      loggerInstanceRef.current = createLogger(logger);
    }

    return loggerInstanceRef.current;
  }, [logger]);

  return <LoggerContext.Provider value={loggerInstance}>{children}</LoggerContext.Provider>;
}
