// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useConfig} from '@thunderid/contexts';
import {
  useDesign,
  FontImporter,
  StylesheetInjector,
  DefaultTheme,
  getFontImportURL,
  getCspNonce,
  type Theme,
} from '@thunderid/design';
import {LanguageSwitcher} from '@thunderid/react';
import {
  OxygenUIThemeProvider,
  ColorSchemeToggle,
  CircularProgress,
  Box,
  HighContrastTheme,
  Button,
  Menu,
  MenuItem,
  Typography,
  createOxygenTheme,
} from '@wso2/oxygen-ui';
import {ChevronDown} from '@wso2/oxygen-ui-icons-react';
import {useState, type JSX, type ComponentType, type MouseEvent} from 'react';
import Head from '../components/Head';

export default function withTheme<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithTheme(props: P): JSX.Element {
    const {config} = useConfig();
    const {theme, isLoading, design} = useDesign(DefaultTheme as Theme);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
      <OxygenUIThemeProvider
        nonce={getCspNonce()}
        themes={[
          {key: 'highContrast', label: 'High Contrast Theme', theme: HighContrastTheme},
          {key: 'default', label: 'Default Theme', theme: theme ?? DefaultTheme},
          ...(config?.brand?.design?.themes?.map((theme) => ({
            key: theme.key,
            label: theme.label,
            theme: typeof theme.theme === 'string' ? theme.theme : createOxygenTheme(theme.theme),
          })) ?? []),
        ]}
        initialTheme={config?.brand?.design?.initialTheme ?? 'default'}
      >
        <Head />
        <StylesheetInjector />
        <FontImporter importURL={getFontImportURL(design?.theme)} />
        <ColorSchemeToggle
          sx={{
            position: 'fixed',
            top: '2.3rem',
            right: '3rem',
            zIndex: 2,
          }}
        />
        <LanguageSwitcher>
          {({languages, currentLanguage, onLanguageChange, isLoading: langLoading}) => {
            if (languages.length < 2) {
              return null;
            }

            const current = languages.find((l) => l.code === currentLanguage);
            const open = Boolean(anchorEl);

            return (
              <>
                <Button
                  disabled={langLoading}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
                  startIcon={<Typography component="span">{current?.emoji ?? '🌐'}</Typography>}
                  endIcon={<ChevronDown size={14} />}
                  sx={{position: 'fixed', top: '2.3rem', right: '8rem', zIndex: 2}}
                >
                  {current?.displayName ?? currentLanguage}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                  {languages.map((lang) => (
                    <MenuItem
                      key={lang.code}
                      selected={lang.code === currentLanguage}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setAnchorEl(null);
                      }}
                    >
                      <Typography component="span" sx={{mr: 1}}>
                        {lang.emoji}
                      </Typography>
                      {lang.displayName}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            );
          }}
        </LanguageSwitcher>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '100vw',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <WrappedComponent {...props} />
        )}
      </OxygenUIThemeProvider>
    );
  };
}
