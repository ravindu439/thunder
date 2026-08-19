// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, ButtonBase, useTheme} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import useIsDarkMode from '../../hooks/useIsDarkMode';

interface BlogCategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function BlogCategoryFilter({categories, active, onChange}: BlogCategoryFilterProps): JSX.Element {
  const theme = useTheme();
  const isLight = !useIsDarkMode();
  const options = ['All', ...categories];

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.75}}>
      {options.map((option) => {
        const isActive = active === option;
        return (
          <ButtonBase
            key={option}
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            sx={{
              px: 1.75,
              py: 0.75,
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              border: '1px solid',
              userSelect: 'none',
              transition: 'all 0.15s ease',
              borderColor: isActive ? 'rgba(54,136,255,0.5)' : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              bgcolor: isActive ? 'rgba(54,136,255,0.12)' : 'transparent',
              color: isActive ? theme.vars?.palette.primary.main : isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {option}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
