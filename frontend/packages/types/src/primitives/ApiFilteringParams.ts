// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Common query parameters for list API endpoints.
 *
 * @public
 * @remarks
 * Represents optional filtering and pagination values accepted by list APIs,
 * where `limit` controls page size, `offset` controls the starting index, and
 * `filter` contains service-specific filter expressions.
 */
export interface ApiFilteringParams {
  /**
   * Maximum number of resources to return.
   */
  limit?: number;

  /**
   * Number of resources to skip before collecting results.
   */
  offset?: number;

  /**
   * Filter expression used to narrow the result set.
   */
  filter?: string;
}
