// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AuthPageLayout} from '@thunderid/design';
import {useThunderID} from '@thunderid/react';
import type {JSX} from 'react';
import RecoveryBox from './RecoveryBox';

export default function Recovery(): JSX.Element {
  const {isMetaLoading} = useThunderID();

  return (
    <AuthPageLayout isLoading={isMetaLoading} variant="Recovery">
      <RecoveryBox />
    </AuthPageLayout>
  );
}
