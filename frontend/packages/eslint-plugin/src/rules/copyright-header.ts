// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {SourceCode, Rule} from 'eslint';
import {Comment} from 'estree';

interface CopyrightHeaderOptions {
  excludePatterns?: string[];
  template?: string;
  allowShebang?: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();

const REQUIRED_COPYRIGHT_HEADER = `// Copyright ${CURRENT_YEAR} The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0`;

const copyrightHeaderRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce the Apache 2.0 SPDX copyright header in all source files',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          excludePatterns: {
            type: 'array',
            items: {type: 'string'},
          },
          template: {
            type: 'string',
          },
          allowShebang: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingHeader: 'Missing Apache 2.0 SPDX copyright header',
      incorrectHeader: 'Incorrect copyright header format',
    },
  },
  create(context: Rule.RuleContext) {
    const options: CopyrightHeaderOptions = (context.options?.[0] as CopyrightHeaderOptions) ?? {};
    const excludePatterns: string[] = options.excludePatterns ?? [];
    const template: string = options.template ?? REQUIRED_COPYRIGHT_HEADER;
    const allowShebang: boolean = options.allowShebang ?? false;
    const filename: string = context.filename;

    // Check if file should be excluded
    if (excludePatterns.some((pattern: string) => new RegExp(pattern).test(filename))) {
      return {};
    }

    // Skip certain file types
    if (/\.(json|md|yml|yaml|xml|txt)$/.exec(filename)) {
      return {};
    }

    return {
      Program(node: unknown) {
        const sourceCode: SourceCode = context.sourceCode;
        const allComments: Comment[] = sourceCode.getAllComments();

        const hasShebang = allowShebang && (allComments[0]?.type as string) === 'Shebang';
        const shebangComment = hasShebang ? allComments[0] : undefined;
        const comments: Comment[] = hasShebang ? allComments.slice(1) : allComments;

        const firstComment: Comment | undefined = comments[0];

        // Collect the leading comment region: the run of consecutive leading line
        // comments (the SPDX header is two `//` lines), or a single leading block
        // comment (a legacy header to be replaced).
        const region: Comment[] = [];
        if (firstComment?.type === 'Line') {
          for (const comment of comments) {
            if (comment.type !== 'Line') {
              break;
            }
            region.push(comment);
          }
        } else if (firstComment?.type === 'Block') {
          region.push(firstComment);
        }

        const regionText: string = region.map((comment: Comment) => comment.value).join('\n');
        const normalized: string = regionText.replace(/\s+/g, ' ').trim();

        // The year is intentionally not validated, so historical years pass unchanged.
        if (
          normalized.includes('The ThunderID Authors') &&
          normalized.includes('SPDX-License-Identifier: Apache-2.0')
        ) {
          return;
        }

        // Only treat the leading comment as a stale header when it looks like one,
        // so unrelated leading comments are never clobbered.
        const isHeaderLike: boolean = region.length > 0 && /copyright|license|spdx/i.test(regionText);

        if (!isHeaderLike) {
          context.report({
            // @ts-expect-error TODO: Update to the latest ESLint and remove `@types/eslint`.
            node,
            messageId: 'missingHeader',
            fix(fixer: Rule.RuleFixer) {
              if (shebangComment) {
                // @ts-expect-error TODO: Update to the latest ESLint and remove `@types/eslint`.
                return fixer.insertTextAfter(shebangComment, `\n\n${template}`);
              }
              // @ts-expect-error TODO: Update to the latest ESLint and remove `@types/eslint`.
              return fixer.insertTextBefore(node, `${template}\n\n`);
            },
          });
          return;
        }

        context.report({
          node: region[0],
          messageId: 'incorrectHeader',
          fix(fixer: Rule.RuleFixer) {
            const start: number = region[0].range?.[0] ?? 0;
            const end: number = region[region.length - 1].range?.[1] ?? 0;
            return fixer.replaceTextRange([start, end], template);
          },
        });
      },
    };
  },
};

export default copyrightHeaderRule;
