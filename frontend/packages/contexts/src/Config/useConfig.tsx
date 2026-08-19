// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import ConfigContext, {ConfigContextType} from './ConfigContext';

/**
 * React hook for accessing runtime configuration throughout the application.
 *
 * This hook provides access to the configuration loaded from window object
 * or falls back to default values. It must be used within a component tree wrapped by
 * `ConfigProvider`, otherwise it will throw an error.
 *
 * The hook returns a context object containing the complete configuration and utility
 * methods for common operations like getting server URLs, hostnames, ports, and
 * checking HTTP-only mode.
 *
 * @returns The configuration context containing config data and utility methods
 *
 * @throws {Error} Throws an error if used outside of ConfigProvider
 *
 * @example
 * Basic usage:
 * ```tsx
 * import useConfig from './useConfig';
 *
 * function MyComponent() {
 *   const { config, getServerUrl, isHttpOnly, getClientUuid } = useConfig();
 *
 *   return (
 *     <div>
 *       <p>Server: {getServerUrl()}</p>
 *       <p>Protocol: {isHttpOnly() ? 'HTTP' : 'HTTPS'}</p>
 *       <p>Port: {config.server.port}</p>
 *       <p>Client UUID: {getClientUuid() || 'Not available'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Getting client UUID for design resolution:
 * ```tsx
 * import useConfig from './useConfig';
 * import useGetDesignResolve from './useGetDesignResolve';
 *
 * function DesignedComponent() {
 *   const { getClientUuid } = useConfig();
 *   const clientUuid = getClientUuid();
 *
 *   const { data: design } = useGetDesignResolve({
 *     type: 'APP',
 *     id: clientUuid || ''
 *   });
 *
 *   return <div>Component with design...</div>;
 * }
 * ```
 *
 * @example
 * Using with error boundary:
 * ```tsx
 * import useConfig from './useConfig';
 *
 * function ServerStatus() {
 *   try {
 *     const { getServerHostname, getServerPort } = useConfig();
 *     return <span>{getServerHostname()}:{getServerPort()}</span>;
 *   } catch (error) {
 *     return <span>Configuration not available</span>;
 *   }
 * }
 * ```
 *
 * @public
 */
export default function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return context;
}
