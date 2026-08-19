// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useToast} from '@thunderid/contexts';
import {Box, Button, FormControl, FormHelperText, FormLabel, TextField} from '@wso2/oxygen-ui';
import {Copy} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';

interface ReadOnlyCopyFieldProps {
  id: string;
  label: string;
  value: string;
  helperText?: string;
}

export default function ReadOnlyCopyField({
  id,
  label,
  value,
  helperText = undefined,
}: ReadOnlyCopyFieldProps): JSX.Element {
  const {t} = useTranslation('connections');
  const {showToast} = useToast();

  const handleCopy = (): void => {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => showToast(t('form.copied'), 'success'))
      .catch(() => {
        // Clipboard write can fail silently (e.g. permissions); no user-facing error needed.
      });
  };

  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-start'}}>
        <TextField
          id={id}
          fullWidth
          value={value}
          slotProps={{input: {readOnly: true, sx: {fontFamily: 'monospace'}}}}
        />
        <Button variant="outlined" startIcon={<Copy size={16} />} onClick={handleCopy} data-testid={`${id}-copy`}>
          {t('form.copy')}
        </Button>
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
