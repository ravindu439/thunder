// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {PermissionDelimiter} from '../models/permissions';

export interface DelimiterOption {
  value: PermissionDelimiter;
  labelKey: string;
  labelFallback: string;
}

export const DELIMITER_OPTIONS: DelimiterOption[] = [
  {
    value: ':',
    labelKey: 'resourceServers:create.separator.colon',
    labelFallback: 'Colon ( : )',
  },
  {
    value: '.',
    labelKey: 'resourceServers:create.separator.dot',
    labelFallback: 'Dot ( . )',
  },
  {
    value: '/',
    labelKey: 'resourceServers:create.separator.slash',
    labelFallback: 'Slash ( / )',
  },
  {
    value: '-',
    labelKey: 'resourceServers:create.separator.hyphen',
    labelFallback: 'Hyphen ( - )',
  },
  {
    value: '_',
    labelKey: 'resourceServers:create.separator.underscore',
    labelFallback: 'Underscore ( _ )',
  },
];
