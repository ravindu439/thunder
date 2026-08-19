// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type EmbeddedFlowComponent} from '@thunderid/react';
import {cn} from '@thunderid/utils';
import {Box, Button} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import type {FlowComponent} from '../../../models/flow';
import getIntegrationIcon from '../../../utils/getIntegrationIcon';

interface StandaloneTriggerAdapterProps {
  component: FlowComponent;
  index: number;
  isLoading: boolean;
  resolve: (template: string | undefined) => string | undefined;
  onSubmit: (action: EmbeddedFlowComponent, inputs: Record<string, string>) => void;
  values: Record<string, string>;
}

export default function StandaloneTriggerAdapter({
  component,
  index,
  isLoading,
  resolve,
  onSubmit,
  values,
}: StandaloneTriggerAdapterProps): JSX.Element {
  const {t} = useTranslation();
  const resolvedStartIcon = resolve(component.startIcon ?? component.image ?? '');

  const iconElement =
    resolvedStartIcon && /^https?:\/\//i.test(resolvedStartIcon) ? (
      <Box component="img" src={resolvedStartIcon} sx={{width: 20, height: 20, objectFit: 'contain'}} />
    ) : (
      getIntegrationIcon(String(component.label ?? ''), resolvedStartIcon ?? '')
    );

  return (
    <Button
      key={component.id ?? index}
      fullWidth
      className={cn(
        'Flow--standaloneTrigger',
        'Button--root',
        component.variant === 'OUTLINED' ? 'Button--outlined' : 'Button--secondary',
      )}
      variant={component.variant === 'OUTLINED' ? 'outlined' : 'contained'}
      disabled={isLoading}
      startIcon={iconElement}
      onClick={() => onSubmit(component, values)}
      sx={{mt: 1}}
    >
      {t(resolve(component.label)!)}
    </Button>
  );
}
