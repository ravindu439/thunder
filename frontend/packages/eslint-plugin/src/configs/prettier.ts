// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Linter} from 'eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

const prettierConfig: Linter.Config[] = [eslintConfigPrettier];

export default prettierConfig;
