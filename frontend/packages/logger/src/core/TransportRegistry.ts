// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type Transport from '../models/transport';

/**
 * Transport registry for managing and retrieving transports.
 * Follows the executor registry pattern from backend.
 */
export default class TransportRegistry {
  private transports: Map<string, Transport>;

  constructor() {
    this.transports = new Map();
  }

  /**
   * Register a transport with the registry.
   * @param transport - The transport instance to register
   */
  register(transport: Transport): void {
    this.transports.set(transport.getName(), transport);
  }

  /**
   * Get a transport by name.
   * @param name - The name of the transport
   * @returns The transport instance or undefined if not found
   */
  get(name: string): Transport | undefined {
    return this.transports.get(name);
  }

  /**
   * Check if a transport is registered.
   * @param name - The name of the transport
   * @returns True if the transport is registered
   */
  has(name: string): boolean {
    return this.transports.has(name);
  }

  /**
   * Get all registered transports.
   * @returns Array of all transport instances
   */
  getAll(): Transport[] {
    return Array.from(this.transports.values());
  }

  /**
   * Unregister a transport.
   * @param name - The name of the transport to unregister
   * @returns True if the transport was unregistered
   */
  unregister(name: string): boolean {
    return this.transports.delete(name);
  }

  /**
   * Clear all registered transports.
   */
  clear(): void {
    this.transports.clear();
  }

  /**
   * Get the number of registered transports.
   */
  size(): number {
    return this.transports.size;
  }
}
