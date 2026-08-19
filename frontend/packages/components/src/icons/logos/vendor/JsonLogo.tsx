// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX} from 'react';

export interface JsonLogoProps {
  size?: number;
}

/** JSON's curly-brace icon with the "JSON" wordmark. */
export default function JsonLogo({size = 18}: JsonLogoProps): JSX.Element {
  return (
    <svg width={(size * 108) / 32} height={size} viewBox="0 0 108 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left curly brace */}
      <path
        d="M14 4C10 4 8 6 8 9L8 13C8 15 6 16 4 16C6 16 8 17 8 19L8 23C8 26 10 28 14 28"
        stroke="#F89820"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right curly brace */}
      <path
        d="M18 4C22 4 24 6 24 9L24 13C24 15 26 16 28 16C26 16 24 17 24 19L24 23C24 26 22 28 18 28"
        stroke="#F89820"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* J */}
      <path
        d="M48 6 V21 C48 25 44 27 41 26"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* S */}
      <path
        d="M66 9 C66 7 64 6 61 6 C57 6 54 8 54 12 C54 16 66 16 66 20 C66 24 64 26 61 26 C57 26 54 25 54 22"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* O */}
      <ellipse cx="77" cy="16" rx="6" ry="10" stroke="currentColor" strokeWidth="3.5" />
      {/* N */}
      <path
        d="M88 26 L88 6 L103 26 L103 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
