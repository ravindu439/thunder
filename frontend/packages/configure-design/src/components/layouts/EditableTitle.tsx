// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Stack, TextField, Typography} from '@wso2/oxygen-ui';
import {Edit} from '@wso2/oxygen-ui-icons-react';
import {useEffect, useRef, useState, type JSX} from 'react';

export interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
}

function EditableTitle({value, onChange}: EditableTitleProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = (): void => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <TextField
        inputRef={inputRef}
        size="small"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            setDraft(value);
            setEditing(false);
          }
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
        variant="standard"
        slotProps={{
          input: {sx: {fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace', py: 0}, disableUnderline: false},
        }}
        sx={{maxWidth: 140}}
      />
    );
  }

  return (
    <Stack direction="row" alignItems="center" gap={0.25} sx={{overflow: 'hidden', minWidth: 0}}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Typography>
      <Box
        component="span"
        role="button"
        aria-label="Edit title"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setEditing(true);
          }
        }}
        sx={{
          display: 'flex',
          flexShrink: 0,
          cursor: 'pointer',
          color: 'text.disabled',
          borderRadius: 0.5,
          p: 0.25,
          '&:hover': {color: 'text.secondary'},
        }}
      >
        <Edit size={12} />
      </Box>
    </Stack>
  );
}

export default EditableTitle;
