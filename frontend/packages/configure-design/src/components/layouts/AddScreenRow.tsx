// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Button, Stack, TextField} from '@wso2/oxygen-ui';
import {Plus} from '@wso2/oxygen-ui-icons-react';
import {useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';

export interface AddScreenRowProps {
  baseScreens: string[];
  onAdd: (name: string, extendsBase: string) => void;
}

export default function AddScreenRow({baseScreens, onAdd}: AddScreenRowProps): JSX.Element {
  const {t} = useTranslation('design');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleAdd = (): void => {
    const trimmed = name.trim();
    if (!trimmed || baseScreens.length === 0) return;
    onAdd(trimmed, baseScreens[0]);
    setName('');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        size="small"
        variant="text"
        color="primary"
        startIcon={<Plus size={13} />}
        onClick={() => setOpen(true)}
        sx={{
          textTransform: 'none',
          fontSize: '0.8rem',
          justifyContent: 'flex-start',
          px: 1.5,
          py: 0.75,
          borderRadius: 1.5,
          width: '100%',
        }}
      >
        {t('layouts.forms.add_screen.actions.add.label', 'Add screen')}
      </Button>
    );
  }

  return (
    <Box sx={{px: 0.5, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.75}}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') {
            setOpen(false);
            setName('');
          }
        }}
        placeholder={t('layouts.forms.add_screen.fields.name.placeholder', 'Screen name…')}
        size="small"
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '0.8125rem',
          },
        }}
      />
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={handleAdd}
          sx={{textTransform: 'none', fontSize: '0.75rem', flex: 1, py: 0.4, borderRadius: 1}}
        >
          {t('layouts.forms.add_screen.actions.add_confirm.label', 'Add')}
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={() => {
            setOpen(false);
            setName('');
          }}
          sx={{textTransform: 'none', fontSize: '0.75rem', py: 0.4, borderRadius: 1}}
        >
          {t('layouts.forms.add_screen.actions.cancel.label', 'Cancel')}
        </Button>
      </Stack>
    </Box>
  );
}
