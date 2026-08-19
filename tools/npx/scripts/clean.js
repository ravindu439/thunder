// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const { rmSync } = require('fs');
const { join } = require('path');

rmSync(join(__dirname, '..', 'dist'), { recursive: true, force: true });
