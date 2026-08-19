// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@wso2/oxygen-ui';
import {ChevronDown} from '@wso2/oxygen-ui-icons-react';
import type {JSX, ReactNode} from 'react';

export interface ConfigCardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}

/**
 * ConfigCard - A collapsible card component for builder mode sections.
 * Used to group related configuration options within theme and layout editors.
 */
export default function ConfigCard({
  title,
  children,
  defaultOpen = true,
  action = undefined,
}: ConfigCardProps): JSX.Element {
  return (
    <Accordion
      defaultExpanded={defaultOpen}
      disableGutters
      square
      sx={{
        backgroundColor: 'transparent',
        '&:before': {
          display: 'none',
        },
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      <AccordionSummary expandIcon={<ChevronDown size={16} />}>
        <Typography variant="body2" sx={{fontWeight: 600, fontSize: '0.9375rem', flex: 1}}>
          {title}
        </Typography>
        {action && (
          <Box onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            {action}
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
