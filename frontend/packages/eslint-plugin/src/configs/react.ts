// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Linter} from 'eslint';
import {createTypeScriptImportResolver} from 'eslint-import-resolver-typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import createParserOptions from '../utils/tsconfig-resolver';

const reactConfig: Linter.Config[] = [
  reactPlugin.configs.flat['recommended'],
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  reactRefresh.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: createParserOptions(),
    },
  },
  {
    name: 'thunderid/react-settings',
    settings: {
      react: {
        version: 'detect',
      },
      'import-x/resolver-next': [createTypeScriptImportResolver({alwaysTryTypes: true})],
    },
  },
  {
    name: 'thunderid/react-overrides',
    rules: {
      // Disallow the use of `dangerouslySetInnerHTML` to prevent potential XSS vulnerabilities.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
      'react/no-danger': ['error', {customComponentNames: ['*']}],
      // Enforce removing unused prop types to maintain clean and efficient code.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
      'react/no-unused-prop-types': 'error',
      // Enforce the use of fragments when a component returns multiple elements to avoid unnecessary wrapper nodes in the DOM.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
      'react/jsx-no-useless-fragment': 'error',
      // Turn on `react/no-array-index-key` to prevent potential issues with list rendering and reconciliation in React.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
      'react/no-array-index-key': 'error',
      // Turn off the requirement to have React in scope for JSX.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c9f5eb264e881f7de66188cbb20904fa8edf3985/docs/rules/jsx-use-react.md
      'react/jsx-use-react': 'off',
      // Turn off the requirement to have React in scope for JSX.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/c9f5eb264e881f7de66188cbb20904fa8edf3985/docs/rules/react-in-jsx-scope.md
      'react/react-in-jsx-scope': 'off',
      // Override the default `airbnb` rule to avoid the deprecated `defaultProps` usage.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/958954de7422c5c78e8758fa02fc8b6aa2db67ec/docs/rules/require-default-props.md
      'react/require-default-props': [
        'error',
        {
          forbidDefaultForRequired: true,
          classes: 'ignore',
          functions: 'defaultArguments',
        },
      ],
      // Allow imports without file extensions for TypeScript/JavaScript files
      // This is especially useful for path aliases like @/ that resolve to TypeScript files
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

export default reactConfig;
