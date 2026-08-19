// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, CircularProgress} from '@wso2/oxygen-ui';
import type {JSX} from 'react';

export default function PageLoadingAnimation(): JSX.Element {
  return (
    <Box
      role="status"
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%'}}
    >
      <CircularProgress aria-label="Loading content" />
    </Box>
  );
}
