// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Plugin} from 'vite';

// prismjs language files reference `Prism` as a global with no import — add one so
// Rollup sees the dependency edge and evaluates the core before any language file.
export function prismjsInjectCore(): Plugin {
  return {
    name: 'prismjs-inject-core',
    transform(code: string, id: string) {
      if (/[/\\]prismjs[/\\]components[/\\]prism-(?!core)/.test(id)) {
        // map: null intentionally omitted — prepending a line shifts devtools line numbers by 1.
        return {code: `import Prism from 'prismjs';\n${code}`, map: null};
      }
      return null;
    },
  };
}
