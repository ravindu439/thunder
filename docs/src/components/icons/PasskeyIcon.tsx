// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function PasskeyIcon({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="9" r="7" />
      <circle cx="15" cy="9" r="2" />
      <path d="M3.5 20.5L9.5 14.5" />
      <path d="M6 21L4.5 19.5M6.5 17.5L8 19" />
    </svg>
  );
}
