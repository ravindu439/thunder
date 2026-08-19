// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, TextField, Chip, IconButton} from '@wso2/oxygen-ui';
import {Plus} from '@wso2/oxygen-ui-icons-react';
import {useState} from 'react';

/**
 * Array input component for adding multiple values as chips
 */
function ArrayFieldInput({
  value,
  onChange,
  fieldLabel,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  fieldLabel: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const currentValue = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...currentValue, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (indexToDelete: number) => {
    onChange(currentValue.filter((_, index) => index !== indexToDelete));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box>
      <Box sx={{display: 'flex', gap: 1, mb: 1}}>
        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${fieldLabel.toLowerCase()}`}
          fullWidth
          size="small"
          variant="outlined"
        />
        <IconButton size="small" onClick={handleAdd} disabled={!inputValue.trim()}>
          <Plus size={16} />
        </IconButton>
      </Box>
      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
        {currentValue.length > 0 &&
          currentValue.map((item, itemIndex) => (
            <Chip
              key={`chip-${item}`}
              label={String(item)}
              onDelete={() => handleDelete(itemIndex)}
              variant="outlined"
              size="medium"
            />
          ))}
      </Box>
    </Box>
  );
}

export default ArrayFieldInput;
