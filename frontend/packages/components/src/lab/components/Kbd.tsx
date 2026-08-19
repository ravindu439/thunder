// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {PropsWithChildren} from 'react';

/**
 * Props for the {@link Kbd} component.
 */
type KbdProps = PropsWithChildren;

/**
 * Renders keyboard key labels styled as a `<kbd>` element.
 *
 * @param props - Component props
 * @returns A styled keyboard key element
 */
export default function Kbd({children}: KbdProps) {
  return (
    <kbd
      style={{
        display: 'inline-block',
        padding: '1px 5px',
        fontSize: '0.7rem',
        fontFamily: 'inherit',
        lineHeight: '1.4',
        color: 'inherit',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.18)',
        borderRadius: '4px',
        boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.12)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </kbd>
  );
}
