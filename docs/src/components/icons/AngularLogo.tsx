// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


export default function AngularLogo({size = 64}: {size?: number}) {
  return (
    <svg width={size} height={size * 1.067} viewBox="0 0 30 32" fill="none">
      <mask
        id="angular-mask"
        width="30"
        height="32"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{maskType: 'luminance'}}
      >
        <path fill="#fff" d="M0 0h30v32H0z" />
      </mask>
      <g mask="url(#angular-mask)">
        <path
          fill="url(#angular-gradient-1)"
          d="M29.876 5.314 28.797 22.39 18.483 0zm-7.144 22.078-7.794 4.482-7.794-4.482L8.73 23.52h12.418l1.585 3.872ZM14.938 8.498l4.084 10.008h-8.168zm-13.87 13.89L0 5.314 11.393 0z"
        />
        <path
          fill="url(#angular-gradient-2)"
          d="M29.876 5.314 28.797 22.39 18.483 0zm-7.144 22.078-7.794 4.482-7.794-4.482L8.73 23.52h12.418l1.585 3.872ZM14.938 8.498l4.084 10.008h-8.168zm-13.87 13.89L0 5.314 11.393 0z"
        />
      </g>
      <defs>
        <linearGradient
          id="angular-gradient-1"
          x1="6.593"
          x2="30.449"
          y1="28.983"
          y2="17.735"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e40035" />
          <stop offset=".24" stopColor="#f60a48" />
          <stop offset=".352" stopColor="#f20755" />
          <stop offset=".494" stopColor="#dc087d" />
          <stop offset=".745" stopColor="#9717e7" />
          <stop offset="1" stopColor="#6c00f5" />
        </linearGradient>
        <linearGradient
          id="angular-gradient-2"
          x1="5.519"
          x2="21.225"
          y1="3.843"
          y2="21.619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff31d9" />
          <stop offset="1" stopColor="#ff5be1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
