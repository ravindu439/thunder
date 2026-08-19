// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Avatar} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import {getInitials} from './helpers';

interface BlogAvatarProps {
  name: string;
  imageURL?: string;
  size?: number;
}

export default function BlogAvatar({name, imageURL = undefined, size = 30}: BlogAvatarProps): JSX.Element {
  return (
    <Avatar
      src={imageURL}
      alt={name}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        fontWeight: 600,
        background: 'linear-gradient(135deg,#1d5eb4,#3688ff)',
        color: '#fff',
      }}
    >
      {getInitials(name)}
    </Avatar>
  );
}
