// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ApiPaginationLink, User} from '@thunderid/types';
import type {OrganizationUnit} from './organization-unit';

/**
 * Organization Unit List Response
 *
 * Response structure for paginated organization unit list queries.
 * Contains pagination metadata along with the list of organization units.
 *
 * @public
 * @remarks
 * This is the response structure from GET /organization-units endpoint.
 * Includes total count, start index, and current page count for pagination support.
 *
 * @example
 * ```typescript
 * const response: OrganizationUnitListResponse = {
 *   totalResults: 50,
 *   startIndex: 0,
 *   count: 10,
 *   organizationUnits: [
 *     {
 *       id: '550e8400-e29b-41d4-a716-446655440000',
 *       handle: 'engineering',
 *       name: 'Engineering Department',
 *       description: 'Software engineering team'
 *     }
 *   ],
 *   links: [{ rel: 'next', href: '/organization-units?offset=10&limit=10' }]
 * };
 * ```
 */
export interface OrganizationUnitListResponse {
  /**
   * Total number of organization units available
   * @example 50
   */
  totalResults: number;

  /**
   * Starting index of the current page
   * @example 0
   */
  startIndex: number;

  /**
   * Number of organization units in the current response
   * @example 10
   */
  count: number;

  /**
   * Array of organization units in the current page
   */
  organizationUnits: OrganizationUnit[];

  /**
   * Pagination links for navigating between pages
   */
  links?: {
    /** Link relation type (e.g., 'next', 'prev') */
    rel: string;
    /** Link URL */
    href: string;
  }[];
}

export interface OrganizationUnitUserListResponse {
  /**
   * Total number of users in the organization unit
   * @example 100
   */
  totalResults: number;

  /**
   * Starting index of the current page
   * @example 0
   */
  startIndex: number;

  /**
   * Number of users in the current response
   * @example 30
   */
  count: number;

  /**
   * Array of users belonging to the organization unit in the current page
   */
  users: User[];

  /**
   * Pagination links for navigating between pages
   */
  links?: ApiPaginationLink[];
}
