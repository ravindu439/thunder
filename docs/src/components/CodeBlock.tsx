// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import DocusaurusCodeBlock from '@theme/CodeBlock';
import React, {type JSX, ReactNode} from 'react';

interface CodeBlockProps {
  /**
   * The programming language for syntax highlighting
   */
  lang?: string;
  /**
   * Label for the code block tab (used by CodeGroup component)
   */
  // eslint-disable-next-line react/no-unused-prop-types
  label?: string;
  /**
   * The code content
   */
  children: string | ReactNode;
  /**
   * Title for the code block
   */
  title?: string;
  /**
   * Whether to show line numbers
   */
  showLineNumbers?: boolean;
}

/**
 * CodeBlock component for displaying code with syntax highlighting
 *
 * @example
 * ```tsx
 * <CodeBlock lang="bash" label="npm">
 *   npm install @example/react
 * </CodeBlock>
 * ```
 */
export default function CodeBlock({
  lang = 'text',
  children,
  title = undefined,
  showLineNumbers = undefined,
}: CodeBlockProps): JSX.Element {
  // Extract text content from children (handles React elements from MDX)
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }

    if (typeof node === 'number') {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(getTextContent).join('');
    }

    if (React.isValidElement(node)) {
      const props = node.props as {children?: ReactNode};
      if (props.children) {
        return getTextContent(props.children);
      }
    }

    return '';
  };

  const code = getTextContent(children).trim();

  return (
    <DocusaurusCodeBlock language={lang} title={title} showLineNumbers={showLineNumbers}>
      {code}
    </DocusaurusCodeBlock>
  );
}
