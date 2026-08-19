// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Linter} from 'eslint';
import {createTypeScriptImportResolver} from 'eslint-import-resolver-typescript';
import tseslint from 'typescript-eslint';
import createParserOptions from '../utils/tsconfig-resolver';

const typescriptConfig: Linter.Config[] = [
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: createParserOptions(),
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    name: 'thunderid/typescript-resolver',
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({alwaysTryTypes: true})],
    },
  },
  {
    name: 'thunderid/typescript-overrides',
    rules: {
      // Disallow the use of the `any` type to encourage more precise typings.
      // https://typescript-eslint.io/rules/no-explicit-any/
      '@typescript-eslint/no-explicit-any': 'error',
      'object-curly-spacing': ['error', 'never'],
      // Allow imports without file extensions for TypeScript files
      // This is especially useful for path aliases and modern module resolution
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  },
];

export default typescriptConfig;
