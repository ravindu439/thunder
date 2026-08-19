// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AuthPageLayout, useDesign} from '@thunderid/design';
import {useThunderID} from '@thunderid/react';
import {ParticleBackground} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import SignUpBox from './SignUpBox';

export default function SignUp(): JSX.Element {
  const {isMetaLoading} = useThunderID();
  const {isDesignEnabled, isLoading: isDesignLoading} = useDesign();

  const showSlogan = !isDesignLoading && !isDesignEnabled;

  return (
    <AuthPageLayout isLoading={isMetaLoading} variant="SignUp">
      {showSlogan && <ParticleBackground opacity={0.5} />}
      <SignUpBox />
    </AuthPageLayout>
  );
}
