// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {existsSync, rmSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';
import {describe, it, expect, afterEach} from 'vitest';
import ensureDir from '../ensureDir';

describe('ensureDir', () => {
  const testDir = join(tmpdir(), 'create-test-ensure-dir');

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, {recursive: true, force: true});
    }
  });

  it('should create a directory if it does not exist', () => {
    const dirPath = join(testDir, 'new-dir');

    expect(existsSync(dirPath)).toBe(false);
    ensureDir(dirPath);
    expect(existsSync(dirPath)).toBe(true);
  });

  it('should not throw if directory already exists', () => {
    const dirPath = join(testDir, 'existing-dir');

    ensureDir(dirPath);
    expect(existsSync(dirPath)).toBe(true);

    // Should not throw on second call
    expect(() => ensureDir(dirPath)).not.toThrow();
    expect(existsSync(dirPath)).toBe(true);
  });

  it('should create nested directories recursively', () => {
    const nestedPath = join(testDir, 'level1', 'level2', 'level3');

    expect(existsSync(nestedPath)).toBe(false);
    ensureDir(nestedPath);
    expect(existsSync(nestedPath)).toBe(true);
  });

  it('should handle multiple levels of non-existent directories', () => {
    const deepPath = join(testDir, 'a', 'b', 'c', 'd', 'e');

    ensureDir(deepPath);
    expect(existsSync(deepPath)).toBe(true);
    expect(existsSync(join(testDir, 'a'))).toBe(true);
    expect(existsSync(join(testDir, 'a', 'b'))).toBe(true);
    expect(existsSync(join(testDir, 'a', 'b', 'c'))).toBe(true);
  });
});
