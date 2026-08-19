// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {Outlet} from 'react-router';

export default function DefaultLayout(): JSX.Element {
  return (
    <Box sx={{height: '100%'}}>
      <Outlet />
    </Box>
  );
}
