// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {prismjsInjectCore} from '../prismjs-inject-core';

function transform(id: string, code = 'Prism.languages.python = {};') {
  const plugin = prismjsInjectCore();
  const hook = plugin.transform as (code: string, id: string) => {code: string; map: null} | null;
  return hook.call(plugin, code, id);
}

describe('prismjsInjectCore', () => {
  it('has the expected plugin name', () => {
    expect(prismjsInjectCore().name).toBe('prismjs-inject-core');
  });

  it('injects a Prism import for a POSIX language file path', () => {
    const result = transform('/repo/node_modules/prismjs/components/prism-python.js');
    expect(result?.code).toBe("import Prism from 'prismjs';\nPrism.languages.python = {};");
    expect(result?.map).toBeNull();
  });

  it('injects a Prism import for a Windows-style language file path', () => {
    const result = transform('C:\\repo\\node_modules\\prismjs\\components\\prism-python.js');
    expect(result?.code).toBe("import Prism from 'prismjs';\nPrism.languages.python = {};");
  });

  it('does not inject an import for the core module itself', () => {
    expect(transform('/repo/node_modules/prismjs/components/prism-core.js')).toBeNull();
  });

  it('does not inject an import for files outside prismjs/components', () => {
    expect(transform('/repo/src/components/prism-python.js')).toBeNull();
  });

  it('does not inject an import for unrelated modules', () => {
    expect(transform('/repo/src/index.ts')).toBeNull();
  });
});
