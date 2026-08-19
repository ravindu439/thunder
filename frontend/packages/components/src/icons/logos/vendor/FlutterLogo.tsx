// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX} from 'react';

export interface FlutterLogoProps {
  size?: number;
}

/** Flutter's full-color twin-peaks mark, used to identify Flutter quickstart guides. */
export default function FlutterLogo({size = 64}: FlutterLogoProps): JSX.Element {
  return (
    <svg width={size} height={size * 1.238} viewBox="0 0 300 371.43">
      <defs>
        <linearGradient
          id="flutter-gradient"
          x1="6254.1"
          y1="5576.56"
          x2="6424.34"
          y2="5406.31"
          gradientTransform="translate(-1404 -1054.53) scale(0.25)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1a237e" stopOpacity="0.4" />
          <stop offset="1" stopColor="#1a237e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="#54c5f8"
        d="M300 171.43l-100 100 100 100H185.72l-42.86-42.86h0L85.71 271.42l100-100ZM185.72 0 0 185.72l57.15 57.15L300 0Z"
      />
      <path fill="#01579b" d="M142.85 328.57 185.72 371.44H300l-100-100z" />
      <path fill="url(#flutter-gradient)" d="M142.85 328.57 227.61 299.24 200.01 271.44z" />
      <path fill="#29b6f6" d="M102.45 231.03h80.81l-40.41 40.4z" />
    </svg>
  );
}
