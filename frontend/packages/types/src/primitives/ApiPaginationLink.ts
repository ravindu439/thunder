// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Pagination link object included in list API responses.
 *
 * @public
 * @remarks
 * Represents a navigation link for paginated resources, where `rel`
 * identifies the link relation (for example `next` or `prev`) and `href`
 * provides the target URL.
 */
export interface ApiPaginationLink {
  /**
   * Target URL of the pagination link.
   */
  href: string;

  /**
   * Relation type of the pagination link.
   */
  rel: string;
}
