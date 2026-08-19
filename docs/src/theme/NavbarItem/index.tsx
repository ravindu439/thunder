// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import OriginalNavbarItem from '@theme-original/NavbarItem';
import React from 'react';
import GitHubStarButton from './GitHubStarButton';
import PersonaDropdown from './PersonaDropdown';

type OriginalProps = Omit<React.ComponentProps<typeof OriginalNavbarItem>, 'type' | 'mobile'> & {
  type?: string;
  mobile?: boolean;
};

export default function NavbarItem({type = undefined, mobile = undefined, ...rest}: OriginalProps): React.ReactElement {
  if (type === 'custom-PersonaDropdown') {
    return <PersonaDropdown />;
  }
  if (type === 'custom-GitHubStarButton') {
    return <GitHubStarButton mobile={mobile} />;
  }
  return <OriginalNavbarItem type={type} mobile={mobile} {...rest} />;
}
