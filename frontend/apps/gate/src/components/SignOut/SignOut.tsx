// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDesign, AuthPageLayout} from '@thunderid/design';
import {useThunderID} from '@thunderid/react';
import {ParticleBackground} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import SignOutBox from './SignOutBox';
// Reuse the shared product-branding hero (logo + feature list) so the sign-out page matches sign-in.
import SignInSlogan from '../SignIn/SignInSlogan';

export default function SignOut(): JSX.Element {
  const {isMetaLoading} = useThunderID();
  const {isDesignEnabled, isLoading: isDesignLoading} = useDesign();

  const showSlogan = !isDesignLoading && !isDesignEnabled;

  return (
    <AuthPageLayout isLoading={isMetaLoading || isDesignLoading} variant="Recovery">
      {showSlogan && <ParticleBackground opacity={0.5} />}
      {showSlogan && <SignInSlogan />}
      <SignOutBox />
    </AuthPageLayout>
  );
}
