// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Linter, RuleTester} from 'eslint';
import copyrightHeaderRule from '../copyright-header.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
} as Linter.Config);

const getCurrentYear = (): number => new Date().getFullYear();

const VALID_COPYRIGHT = `// Copyright ${getCurrentYear()} The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0`;

const LEGACY_HEADER = `/**
 * Copyright (c) 2020, Example Inc.
 *
 * Licensed under a legacy header format.
 */`;

ruleTester.run('copyright-header', copyrightHeaderRule, {
  valid: [
    {
      code: `${VALID_COPYRIGHT}

export const foo = 'bar';`,
    },
    {
      code: `${VALID_COPYRIGHT}

function hello() {
  return 'world';
}`,
    },
    {
      // The year is not validated, so historical years remain valid.
      code: `// Copyright 2020 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const foo = 'bar';`,
    },
  ],
  invalid: [
    {
      code: `export const foo = 'bar';`,
      output: `${VALID_COPYRIGHT}

export const foo = 'bar';`,
      errors: [
        {
          messageId: 'missingHeader',
        },
      ],
    },
    {
      // A stale, non-SPDX header is replaced with the SPDX header.
      code: `${LEGACY_HEADER}

export const foo = 'bar';`,
      output: `${VALID_COPYRIGHT}

export const foo = 'bar';`,
      errors: [
        {
          messageId: 'incorrectHeader',
        },
      ],
    },
    {
      // An unrelated leading comment is preserved; the header is inserted after it.
      code: `// Single line comment

export const foo = 'bar';`,
      output: `// Single line comment

${VALID_COPYRIGHT}

export const foo = 'bar';`,
      errors: [
        {
          messageId: 'missingHeader',
        },
      ],
    },
  ],
});
