#!/usr/bin/env node

// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @thunderid/copyright-header, no-console, no-undef */

import('../dist/cli.js')
  .then((module) => {
    module.default();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
