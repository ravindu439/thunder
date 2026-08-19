// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function MarkdownIcon({size = 16}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="2.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M3 10.5V5.5L5.5 8.5L8 5.5V10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 7.5L13 10.5M13 10.5L11 10.5M13 10.5V7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
