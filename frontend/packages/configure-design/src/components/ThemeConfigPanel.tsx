// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useGetTheme, useUpdateTheme, type Theme} from '@thunderid/design';
import {getErrorMessage} from '@thunderid/utils';
import {
  Alert,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  type CssVarsPalette,
} from '@wso2/oxygen-ui';
import {useCallback, useEffect, useImperativeHandle, useRef, useState, type JSX, type RefObject} from 'react';
import {useTranslation} from 'react-i18next';
import ColorBuilderContent from './themes/ColorBuilderContent';
import ShapeBuilderContent from './themes/ShapeBuilderContent';
import TypographyBuilderContent from './themes/TypographyBuilderContent';
import ColorSchemeOptions from '../constants/ColorSchemeOptions';
import useThemeBuilder from '../contexts/ThemeBuilder/useThemeBuilder';
import type {ThemeSection} from '../models/theme-builder';

interface ThemeConfigPanelProps {
  themeId: string | null;
  saveHandlerRef?: RefObject<() => void>;
  /** Callback invoked when the save pending state changes. */
  onSavingChange?: (saving: boolean) => void;
  /** When set, renders only that section's content (builder mode, no accordions) */
  activeSection?: ThemeSection;
}

// ── Main panel component ────────────────────────────────────────────────────

export default function ThemeConfigPanel({
  themeId,
  saveHandlerRef = undefined,
  onSavingChange = undefined,
  activeSection = undefined,
}: ThemeConfigPanelProps): JSX.Element {
  const {t} = useTranslation('design');
  // useGetTheme is kept here only to obtain save metadata (displayName, description, id).
  // React Query deduplicates the request — the provider already issues the same call.
  const {data: theme, isLoading} = useGetTheme(themeId ?? '');
  const {mutateAsync, isPending} = useUpdateTheme();

  // Notify the parent when the save pending state changes.
  useEffect(() => {
    onSavingChange?.(isPending);
  }, [isPending, onSavingChange]);

  // Draft state lives in the context so ThemePreviewPanel always sees the latest changes.
  const {draftTheme, setDraftTheme, setIsDirty, setPreviewColorScheme} = useThemeBuilder();

  const [colorSchemeTab, setColorSchemeTab] = useState<'light' | 'dark'>('light');
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Apply an updater function to a deep-cloned copy of draftTheme and push the
   * result back into the context so the preview panel re-renders automatically.
   */
  const updateDraft = (updater: (d: Theme) => void): void => {
    setSaveError(null);
    setDraftTheme(
      (() => {
        if (!draftTheme) return draftTheme;
        const next = JSON.parse(JSON.stringify(draftTheme)) as Theme;
        updater(next);
        return next;
      })(),
    );
    setIsDirty(true);
  };

  const updateColorScheme = (scheme: 'light' | 'dark', updater: (c: CssVarsPalette) => void): void => {
    updateDraft((d) => {
      const colors = d.colorSchemes?.[scheme]?.palette;
      if (colors) updater(colors);
    });
  };

  const handleSave = useCallback(() => {
    if (!draftTheme || !theme) return;
    setSaveError(null);
    mutateAsync({
      themeId: theme.id,
      data: {handle: theme.handle, displayName: theme.displayName, description: theme.description, theme: draftTheme},
    })
      .then(() => setIsDirty(false))
      .catch((err: Error) => {
        setSaveError(
          getErrorMessage(err, t, 'themes.config.errors.save.message', 'Failed to save theme. Please try again.'),
        );
      });
  }, [draftTheme, theme, mutateAsync, setIsDirty, t]);

  const handleSaveLatest = useRef(handleSave);

  useEffect(() => {
    handleSaveLatest.current = handleSave;
  }, [handleSave]);

  useImperativeHandle(saveHandlerRef, () => () => handleSaveLatest.current(), []);

  if (!themeId) {
    return (
      <Box sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3}}>
        <Typography variant="body2" color="text.secondary" align="center">
          {t('themes.config.select_theme.message', 'Select a theme to view configuration')}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!theme || !draftTheme) {
    return (
      <Box sx={{p: 2}}>
        <Typography variant="body2" color="text.secondary">
          {t('themes.config.errors.load.message', 'Failed to load theme configuration.')}
        </Typography>
      </Box>
    );
  }

  const lightColors = draftTheme.colorSchemes?.light?.palette as CssVarsPalette;
  const darkColors = draftTheme.colorSchemes?.dark?.palette as CssVarsPalette;

  return (
    <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
      {saveError && (
        <Alert severity="error" sx={{mb: 2}} onClose={() => setSaveError(null)}>
          {saveError}
        </Alert>
      )}

      {/* Light / Dark toggle — only for Colors section */}
      {activeSection === 'colors' && (
        <ToggleButtonGroup
          value={colorSchemeTab}
          exclusive
          size="small"
          onChange={(_, val: 'light' | 'dark') => {
            if (!val) return;
            setColorSchemeTab(val);
            setPreviewColorScheme(val);
          }}
          fullWidth
        >
          {ColorSchemeOptions.filter((o) => o.id !== 'system').map((o) => (
            <ToggleButton
              key={o.id}
              value={o.id}
              sx={{gap: 0.75, px: 2, textTransform: 'capitalize', fontSize: '0.75rem'}}
            >
              {o.icon}
              {o.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      <Box sx={{flex: 1, minHeight: 0, overflowY: 'auto', mt: 2}}>
        {activeSection === 'colors' && colorSchemeTab === 'light' && lightColors && (
          <ColorBuilderContent colors={lightColors} onUpdate={(up) => updateColorScheme('light', up)} />
        )}
        {activeSection === 'colors' && colorSchemeTab === 'dark' && darkColors && (
          <ColorBuilderContent colors={darkColors} onUpdate={(up) => updateColorScheme('dark', up)} />
        )}
        {activeSection === 'shape' && draftTheme.shape !== undefined && (
          <ShapeBuilderContent draft={draftTheme} onUpdate={updateDraft} />
        )}
        {activeSection === 'typography' && draftTheme.typography && (
          <TypographyBuilderContent draft={draftTheme} onUpdate={updateDraft} />
        )}
      </Box>
    </Box>
  );
}
