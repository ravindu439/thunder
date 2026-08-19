// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {QRCodeSVG} from 'qrcode.react';
import type {JSX} from 'react';

export interface QrCodeProps {
  /** The value encoded into the QR code. */
  value: string;
  /** Side length in pixels. Defaults to 220. */
  size?: number;
}

/** Renders a QR code as an inline SVG. */
export default function QrCode({value, size = 220}: QrCodeProps): JSX.Element {
  return <QRCodeSVG value={value} size={size} />;
}
