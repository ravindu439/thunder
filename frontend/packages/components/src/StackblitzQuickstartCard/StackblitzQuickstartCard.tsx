// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Stack, Typography} from '@wso2/oxygen-ui';
import {ArrowRight} from '@wso2/oxygen-ui-icons-react';
import type {JSX, ReactNode} from 'react';
import WEB_CONTAINER_SPRITE_DATA_URI from './webContainerSprite';
import StackblitzIcon from '../icons/logos/vendor/StackblitzIcon';

export interface StackblitzQuickstartCardProps {
  /**
   * The StackBlitz fork/edit URL to open in a new tab.
   */
  url: string;
  /**
   * Primary heading line, e.g. "Try the live quickstart".
   */
  heading: string;
  /**
   * Secondary heading line rendered below the heading with less emphasis, e.g. "Run Bifrost in StackBlitz".
   * Accepts a node so callers can emphasize part of it, e.g. the app name in a monospace tag.
   */
  subheading?: ReactNode;
  /**
   * Label for the call-to-action, e.g. "Open on StackBlitz".
   */
  ctaLabel: string;
}

/**
 * A dark banner card linking out to a StackBlitz-hosted quickstart sample for the resource's
 * template. Shared across resource overview tabs (applications, agents, etc.) that offer a
 * live, runnable quickstart.
 */
export default function StackblitzQuickstartCard({
  url,
  heading,
  subheading = undefined,
  ctaLabel,
}: StackblitzQuickstartCardProps): JSX.Element {
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        background:
          'radial-gradient(ellipse 70% 90% at 8% 118%, rgba(168,85,247,0.35), transparent 60%),' +
          'radial-gradient(ellipse 60% 80% at 95% -10%, rgba(45,212,191,0.28), transparent 60%),' +
          '#0a0a12',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          px: 5,
          py: 4.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1.75,
        }}
      >
        <Box sx={{color: 'rgba(255,255,255,0.7)'}}>
          <StackblitzIcon size={16} />
        </Box>
        <Stack sx={{gap: 0.5}}>
          <Typography sx={{fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3}}>
            {heading}
          </Typography>
          {subheading && (
            <Typography sx={{fontSize: '1.375rem', fontWeight: 400, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3}}>
              {subheading}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{color: 'primary.main'}}>
          <Typography sx={{fontSize: '1rem', fontWeight: 600, color: 'inherit'}}>{ctaLabel}</Typography>
          <ArrowRight size={18} />
        </Stack>
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: 320,
          flexShrink: 0,
          display: {xs: 'none', sm: 'block'},
          backgroundImage: `url(${WEB_CONTAINER_SPRITE_DATA_URI})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(100deg, transparent, #000 22%)',
          WebkitMaskImage: 'linear-gradient(100deg, transparent, #000 22%)',
        }}
      />
    </Box>
  );
}
