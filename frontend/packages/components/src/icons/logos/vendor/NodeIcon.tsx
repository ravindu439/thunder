// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX} from 'react';

export interface NodeIconProps {
  size?: number;
}

/** Node.js's hexagon logo, used to identify Node.js quickstart guides. */
export default function NodeIcon({size = 20}: NodeIconProps): JSX.Element {
  return (
    <svg width={size} height={(size * 50) / 44} viewBox="0 0 44 50">
      <defs>
        <clipPath id="node-hex-clip">
          <path d="M22.8725 0.4166C22.136 0 21.2616 0 20.5253 0.4166L1.1505 11.6694C0.4142 12.0862 0 12.8733 0 13.707V36.2584C0 37.0921 0.4602 37.8791 1.1505 38.296L20.5253 49.5487C21.2616 49.9653 22.136 49.9653 22.8725 49.5487L42.2471 38.296C42.9836 37.8791 43.3976 37.0921 43.3976 36.2584V13.707C43.3976 12.8733 42.9375 12.0862 42.2471 11.6694L22.8725 0.4166Z" />
        </clipPath>
        <linearGradient id="node-main" x1="30.33" y1="8.56" x2="14.9" y2="44.7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3F8B3D" />
          <stop offset="0.64" stopColor="#3F873F" />
          <stop offset="0.93" stopColor="#3DA92E" />
          <stop offset="1" stopColor="#3DAE2B" />
        </linearGradient>
        <linearGradient id="node-r1" x1="18.8" y1="26.8" x2="68" y2="0.4" gradientUnits="userSpaceOnUse">
          <stop offset="0.14" stopColor="#3F873F" />
          <stop offset="0.4" stopColor="#52A044" />
          <stop offset="0.71" stopColor="#64B749" />
          <stop offset="0.91" stopColor="#6ABF4B" />
        </linearGradient>
        <linearGradient id="node-r2" x1="0.25" y1="24.5" x2="44" y2="24.5" gradientUnits="userSpaceOnUse">
          <stop offset="0.09" stopColor="#6ABF4B" />
          <stop offset="0.29" stopColor="#64B749" />
          <stop offset="0.6" stopColor="#52A044" />
          <stop offset="0.86" stopColor="#3F873F" />
        </linearGradient>
      </defs>
      <path
        fill="url(#node-main)"
        d="M22.8725 0.4166C22.136 0 21.2616 0 20.5253 0.4166L1.1505 11.6694C0.4142 12.0862 0 12.8733 0 13.707V36.2584C0 37.0921 0.4602 37.8791 1.1505 38.296L20.5253 49.5487C21.2616 49.9653 22.136 49.9653 22.8725 49.5487L42.2471 38.296C42.9836 37.8791 43.3976 37.0921 43.3976 36.2584V13.707C43.3976 12.8733 42.9375 12.0862 42.2471 11.6694L22.8725 0.4166Z"
      />
      <polygon
        fill="url(#node-r1)"
        clipPath="url(#node-hex-clip)"
        points="21.698901,-1.046618 43.20532,11.948247 21.698901,51.072715 0.152778,38.055107"
      />
      <polygon
        fill="url(#node-r2)"
        clipPath="url(#node-hex-clip)"
        points="21.698901,-1.046618 0.152778,11.948247 21.698901,51.072715 43.20532,38.055107"
      />
    </svg>
  );
}
