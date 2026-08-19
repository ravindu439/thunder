// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {BasicApplication} from './application';

/**
 * Application List Response
 *
 * Response structure for paginated application list queries.
 * Contains pagination metadata along with the list of applications.
 *
 * @public
 * @remarks
 * This is the response structure from GET /applications endpoint.
 * Includes total count and current page count for pagination support.
 *
 * @example
 * ```typescript
 * const response: ApplicationListResponse = {
 *   totalResults: 25,
 *   count: 10,
 *   applications: [
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440000',
 *       name: 'My Web App',
 *       description: 'Customer portal',
 *       clientId: 'my_client_id',
 *       isRegistrationFlowEnabled: true
 *     }
 *   ]
 * };
 * ```
 */
export interface ApplicationListResponse {
  /**
   * Total number of applications available
   * @example 25
   */
  totalResults: number;

  /**
   * Number of applications in the current response
   * @example 10
   */
  count: number;

  /**
   * Array of basic application information
   */
  applications: BasicApplication[];
}
