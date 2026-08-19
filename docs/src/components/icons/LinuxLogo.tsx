// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function LinuxLogo({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.2c1.8 0 3.2 1.4 3.2 3.2v2.1c0 .9-.4 1.8-1 2.4.8.8 1.4 1.9 1.4 3.2v1.7c0 1.8-1.5 3.3-3.3 3.3h-.6c-1.8 0-3.3-1.5-3.3-3.3v-1.7c0-1.3.5-2.4 1.4-3.2-.7-.6-1-1.5-1-2.4V5.4c0-1.8 1.4-3.2 3.2-3.2Z"
        fill="currentColor"
      />
      <circle cx="10.5" cy="6.4" r=".8" fill="#fff" />
      <circle cx="13.5" cy="6.4" r=".8" fill="#fff" />
      <path d="M6.7 17.2c1.1 0 2 .9 2 2v.9c0 1-.9 1.9-2 1.9s-2-.9-2-1.9v-.9c0-1.1.9-2 2-2Z" fill="currentColor" />
      <path d="M17.3 17.2c1.1 0 2 .9 2 2v.9c0 1-.9 1.9-2 1.9s-2-.9-2-1.9v-.9c0-1.1.9-2 2-2Z" fill="currentColor" />
      <path d="M10.2 9.8c.5.3 1.1.5 1.8.5s1.3-.2 1.8-.5" stroke="#fff" strokeWidth=".9" strokeLinecap="round" />
    </svg>
  );
}
