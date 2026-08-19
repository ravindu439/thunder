// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Standard API Error Structure
 *
 * Represents the error response body returned by the API
 * when an operation fails.
 *
 * @public
 * @remarks
 * This structure is used for error handling in API responses.
 * The `code` field contains a machine-readable error identifier,
 * while `message` and `description` provide human-readable details.
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   code: 'APP-1020',
 *   message: 'Application already exists',
 *   description: 'An application with the same name already exists'
 * };
 * ```
 */
export interface ApiError {
  /**
   * Machine-readable error code
   * @example 'APP-1020'
   */
  code: string;

  /**
   * Short error message
   * @example 'Application already exists'
   */
  message: string;

  /**
   * Detailed error description
   * @example 'An application with the same name already exists'
   */
  description: string;
}
