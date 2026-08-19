// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cn} from '@thunderid/utils';
import {Divider} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import type {FlowComponent} from '../../../models/flow';

interface DividerAdapterProps {
  component: FlowComponent;
  resolve: (template: string | undefined) => string | undefined;
}

export default function DividerAdapter({component, resolve}: DividerAdapterProps): JSX.Element {
  const {t} = useTranslation();
  const label = resolve(component.label);

  return (
    <Divider
      id={component.id}
      className={[cn('Flow--divider', 'Divider--root'), component.classes].filter(Boolean).join(' ')}
      orientation={component.variant === 'VERTICAL' ? 'vertical' : 'horizontal'}
      sx={{my: 2}}
    >
      {label ? t(label) : undefined}
    </Divider>
  );
}
