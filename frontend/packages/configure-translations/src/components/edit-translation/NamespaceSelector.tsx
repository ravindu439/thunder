// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Autocomplete, Box, FormControl, FormHelperText, FormLabel, TextField} from '@wso2/oxygen-ui';
import {type JSX} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the {@link NamespaceSelector} component.
 *
 * @public
 */
export interface NamespaceSelectorProps {
  /** Available namespace options. */
  namespaces: string[];
  /** Currently selected namespace, or null if none. */
  value: string | null;
  /** Whether the namespace list is still loading. */
  loading: boolean;
  /** Called when the user selects a different namespace. */
  onChange: (namespace: string) => void;
}

/**
 * Autocomplete control for selecting a translation namespace.
 *
 * Formats camelCase namespace keys into human-readable labels and shows a
 * helper text below the input.
 *
 * @param props - The component props
 *
 * @returns JSX element rendering the namespace selector
 *
 * @public
 */
export default function NamespaceSelector({namespaces, value, loading, onChange}: NamespaceSelectorProps): JSX.Element {
  const {t} = useTranslation('translations');

  return (
    <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2}}>
      <FormControl sx={{maxWidth: 600}}>
        <FormLabel htmlFor="namespace-selector">{t('editor.namespace')}</FormLabel>
        <Autocomplete
          id="namespace-selector"
          options={namespaces}
          value={value ?? ''}
          onChange={(_, v) => v && onChange(v)}
          disableClearable
          size="small"
          loading={loading}
          renderInput={(params) => <TextField {...params} />}
          getOptionLabel={(opt) =>
            opt
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (c) => c.toUpperCase())
              .trim()
          }
        />
        <FormHelperText>{t('editor.namespace.helperText')}</FormHelperText>
      </FormControl>
    </Box>
  );
}
