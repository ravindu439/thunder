// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cn} from '@thunderid/utils';
import {Box, Stack} from '@wso2/oxygen-ui';
import type {JSX, ReactNode} from 'react';
import type {FlowComponent} from '../../../models/flow';
import getStackGridSx from '../../../utils/getStackGridSx';

interface StackContainerProps {
  component: FlowComponent;
  children: ReactNode;
}

/**
 * Layout container for STACK flow elements. Renders a CSS grid when the stack sets
 * `items` slots across its main axis, and keeps the flex stack layout otherwise.
 */
export default function StackContainer({component, children}: StackContainerProps): JSX.Element {
  const className = [cn('Flow--stack'), component.classes].filter(Boolean).join(' ');
  const gridSx = getStackGridSx(component);

  if (gridSx) {
    return (
      <Box id={component.id} className={className} sx={gridSx}>
        {children}
      </Box>
    );
  }

  return (
    <Stack
      id={component.id}
      className={className}
      direction={component.direction ?? 'column'}
      spacing={component.gap ?? 2}
      alignItems={component.align ?? 'center'}
      justifyContent={component.justify ?? 'flex-start'}
      // Wrap like the flow builder canvas and the SDK do, instead of squeezing
      // children onto one line. `useFlexGap` keeps the spacing gap based, which is
      // the wrap-safe mode.
      useFlexGap
      sx={{flexWrap: 'wrap'}}
    >
      {children}
    </Stack>
  );
}
