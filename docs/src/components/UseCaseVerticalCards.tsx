// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box} from '@wso2/oxygen-ui';
import React, {JSX} from 'react';

export interface UseCaseCardSectionProps {
  label: string;
  children: React.ReactNode;
}

export function UseCaseCardSection({label, children}: UseCaseCardSectionProps): JSX.Element {
  const darkMode = `html[data-theme='dark'] &`;
  return (
    <Box sx={{marginBottom: '0.5rem'}}>
      <Box
        sx={{
          color: 'var(--ifm-color-primary, #0050b3)',
          fontSize: '0.95rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          marginBottom: '0.25rem',
          [darkMode]: {color: 'var(--ifm-color-primary-dark, #7dc4fa)'},
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          color: 'var(--ifm-font-color-base, #222)',
          fontSize: '1.05rem',
          lineHeight: 1.5,
          [darkMode]: {color: 'var(--ifm-font-color-base, #e6eaf3)'},
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
UseCaseCardSection.displayName = 'UseCaseCardSection';

export interface UseCaseVerticalCardProps {
  children: React.ReactNode;
}

export function UseCaseVerticalCard({children}: UseCaseVerticalCardProps): JSX.Element {
  const darkMode = `html[data-theme='dark'] &`;
  return (
    <Box
      sx={{
        background: 'var(--ifm-card-background, #fff)',
        borderRadius: '12px',
        boxShadow: 'var(--ifm-global-shadow-lw, 0 2px 8px rgba(0,0,0,0.06))',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '100%',
        padding: '1.5rem 1.25rem',
        transition: 'background 0.2s, color 0.2s',
        width: '100%',
        [darkMode]: {
          background: 'var(--ifm-background-color, #18191a)',
          border: '1px solid var(--ifm-color-emphasis-200, #23272f)',
          boxShadow: 'var(--ifm-global-shadow-lw, 0 2px 8px rgba(0,0,0,0.18))',
        },
      }}
    >
      {children}
    </Box>
  );
}
UseCaseVerticalCard.displayName = 'UseCaseVerticalCard';

export function UseCaseVerticalCards({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {children}
    </Box>
  );
}
