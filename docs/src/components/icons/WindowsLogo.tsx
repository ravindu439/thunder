// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function WindowsLogo({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 3.2 11 2v9H2V3.2Zm10 7.8h10V0.8L12 1.9V11Zm0 1v9.1l10 1.1V12H12ZM2 12v7.8l9 1.1V12H2Z" />
    </svg>
  );
}
