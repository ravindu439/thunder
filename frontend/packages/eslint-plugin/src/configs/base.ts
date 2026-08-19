// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Linter} from 'eslint';

const baseConfig: Linter.Config[] = [
  {
    name: 'thunderid/copyright-header',
    rules: {'@thunderid/copyright-header': 'error'},
  },
];

export default baseConfig;
