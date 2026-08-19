// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cn} from '@thunderid/utils';
import {Box} from '@wso2/oxygen-ui';
import * as OxygenIcons from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import type React from 'react';
import type {FlowComponent} from '../../../models/flow';

interface IconAdapterProps {
  component: FlowComponent;
}

export default function IconAdapter({component}: IconAdapterProps): JSX.Element | null {
  const iconName = component.name ?? 'ArrowLeftRight';
  const icons = OxygenIcons as unknown as Record<
    string,
    React.ComponentType<{fontSize?: number | string; sx?: Record<string, unknown>}>
  >;
  if (!Object.keys(icons).includes(iconName)) return null;
  const IconComponent = icons[iconName];
  if (!IconComponent) return null;

  return (
    <Box
      id={component.id}
      className={[cn('Flow--icon'), component.classes].filter(Boolean).join(' ')}
      sx={{display: 'flex', alignItems: 'center'}}
    >
      <IconComponent fontSize={component.size ?? 24} sx={{color: component.color ?? 'currentColor'}} />
    </Box>
  );
}
