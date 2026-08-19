// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Linter} from 'eslint';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import createParserOptions from '../utils/tsconfig-resolver.js';

const vueConfig: Linter.Config[] = [
  ...vuePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ...createParserOptions(),
        // vue-eslint-parser handles .vue files; delegate <script> blocks to the TS parser
        parser: '@typescript-eslint/parser',
      },
    },
  },
  {
    name: 'thunderid/vue-overrides',
    rules: {
      // Vue 3 Composition API doesn't require multi-word component names
      'vue/multi-word-component-names': 'off',
    },
  },
];

export default vueConfig;
