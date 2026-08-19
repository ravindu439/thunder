// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {dirname} from 'path';
import {fileURLToPath} from 'url';
import thunderIdPlugin, {createParserOptions} from '@thunderid/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export default [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**', '.docusaurus/**', 'plugins/**/*.js'],
  },
  ...thunderIdPlugin.configs.react,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: createParserOptions({
        tsconfigRootDir: __dirname,
        project: './tsconfig.eslint.json',
      }),
    },
    rules: {
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['^@docusaurus/', '^@theme/', '^@theme-original/', '^@generated/', '^@site/'],
        },
      ],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import-x/extensions': 'off',
      '@thunderid/copyright-header': ['error', {allowShebang: true}],
    },
  },
  {
    files: ['plugins/shims/*.cjs'],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        exports: 'writable',
      },
    },
  },
];
