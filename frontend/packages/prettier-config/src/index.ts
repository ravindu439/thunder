// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const config = {
  embeddedLanguageFormatting: 'auto',
  arrowParens: 'always',
  bracketSpacing: false,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 120,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  // Adds trailing commas at the end of all objects.
  // 1. Easier to add an item or re-order items.
  // 2. Removes the need to have one line item be special because it lacks the ,.
  // 3. Allows for cleaner Git diffs. (New properties can be added without modifying the previous last line.)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas
  trailingComma: 'all',
  useTabs: false,
};

export default config;
