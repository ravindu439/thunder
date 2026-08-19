// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cliDir = path.resolve(__dirname, '../../cli');
const cliDist = path.join(cliDir, 'dist');
const npxDist = path.resolve(__dirname, '../dist');

if (process.platform === 'win32') {
  execSync(
    `powershell.exe -ExecutionPolicy Bypass -File "${path.join(cliDir, 'scripts', 'build.ps1')}"`,
    { stdio: 'inherit' },
  );
} else {
  execSync(`bash "${path.join(cliDir, 'scripts', 'build.sh')}"`, {
    stdio: 'inherit',
  });
}

fs.mkdirSync(npxDist, { recursive: true });
for (const file of fs.readdirSync(cliDist)) {
  fs.copyFileSync(path.join(cliDist, file), path.join(npxDist, file));
}

console.log('Done. Binaries available in npx/dist/');
