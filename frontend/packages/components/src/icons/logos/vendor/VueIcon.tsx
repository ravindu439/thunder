// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX} from 'react';

export interface VueIconProps {
  size?: number;
}

/** Vue.js's wordmark, used to identify Vue quickstart guides. */
export default function VueIcon({size = 20}: VueIconProps): JSX.Element {
  return (
    <svg width={size} height={(size * 170.02) / 196.32} viewBox="0 0 196.32 170.02">
      <path fill="#42b883" d="M120.83 0L98.16 39.26 75.49 0H0l98.16 170.02L196.32 0h-75.49z" />
      <path fill="#35495e" d="M120.83 0L98.16 39.26 75.49 0H39.26l58.9 102.01L157.06 0h-36.23z" />
    </svg>
  );
}
