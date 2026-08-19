// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

const noShadows = Array(25).fill('none') as Shadows;

const theme = createTheme({
  shadows: noShadows,
  cssVariables: {
    colorSchemeSelector: 'data-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#F87643',
        },
        secondary: {
          main: '#e8e8e8',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#40404B',
          secondary: '#40404B',
        },
        divider: '#e0e0e0',
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#F87643',
        },
        secondary: {
          main: '#3c3c3c',
        },
        background: {
          default: '#121212',
          paper: '#0F0F0F',
        },
        text: {
          primary: '#efefef',
          secondary: '#D0D3E2',
        },
        divider: '#fefefe',
      },
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            color: theme.palette.primary.dark,
            textDecoration: 'underline',
          },
        }),
      },
    }
  },
});

export default theme;
