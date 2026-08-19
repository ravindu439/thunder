// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function AuthJsLogo({size = 28}: {size?: number}) {
  return (
    <img
      src="/assets/images/authjs-logo.png"
      alt="Auth.js"
      width={size}
      height={size}
      style={{objectFit: 'contain'}}
    />
  );
}
