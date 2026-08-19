// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ApiPaginationLink} from '@thunderid/types';
import type {AgentTypeListItem} from './agent-type';

/**
 * Response for `GET /agent-types` (list with pagination).
 */
export interface AgentTypeListResponse {
  totalResults: number;
  startIndex: number;
  count: number;
  types: AgentTypeListItem[];
  links?: ApiPaginationLink[];
}
