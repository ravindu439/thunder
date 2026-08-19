// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Button} from '@wso2/oxygen-ui';
import {QRCodeSVG} from 'qrcode.react';
import type {JSX} from 'react';
import type {FlowComponent} from '../../../models/flow';

interface QrCodeAdapterProps {
  additionalData?: Record<string, unknown>;
  component: FlowComponent;
}

export default function QrCodeAdapter({component, additionalData = {}}: QrCodeAdapterProps): JSX.Element | null {
  const sourceKey = (component as FlowComponent & {source?: string}).source;
  const rawValue = sourceKey && additionalData ? additionalData[sourceKey] : undefined;
  const uri = typeof rawValue === 'string' ? rawValue : '';

  if (!uri) {
    return null;
  }

  return (
    <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}>
      <QRCodeSVG value={uri} size={220} />
      <Button fullWidth variant="outlined" href={uri}>
        Open wallet on this device
      </Button>
    </Box>
  );
}
