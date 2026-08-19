// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineConfig} from 'i18next-cli';

export default defineConfig({
  locales: ['en-US'],
  extract: {
    input: 'apps/**/*.{jsx,tsx,ts}',
    output: '../backend/cmd/server/bootstrap/i18n/{{language}}.json',
    mergeNamespaces: true,
  },
});
