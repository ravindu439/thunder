// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AuthPageLayout} from '@thunderid/design';
import type {JSX} from 'react';
import AcceptInviteBox from '../components/AcceptInvite/AcceptInviteBox';

/**
 * AcceptInvitePage - Page for end users to accept an invite and set their password.
 *
 * This page is accessed via an invite link containing executionId and inviteToken query parameters.
 * Example: /invite?executionId=xxx&inviteToken=yyy
 */
export default function AcceptInvitePage(): JSX.Element {
  return (
    <AuthPageLayout isLoading={false}>
      <AcceptInviteBox />
    </AuthPageLayout>
  );
}
