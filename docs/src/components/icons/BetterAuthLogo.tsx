// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function BetterAuthLogo({size = 28}: {size?: number}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 400 300">
      <path fill="currentColor" d="M200 0h200v300H200V200h100V100H200zM0 0h100v100h100v100H100v100H0z" />
    </svg>
  );
}
