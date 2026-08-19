// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Serialize an error object to a plain object.
 * @param error - The error to serialize
 * @returns Plain object representation of the error
 */
export default function serializeError(error: Error): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...Object.getOwnPropertyNames(error).reduce(
      (acc, key) => {
        if (key !== 'name' && key !== 'message' && key !== 'stack') {
          acc[key] = (error as unknown as Record<string, unknown>)[key];
        }
        return acc;
      },
      {} as Record<string, unknown>,
    ),
  };
}
