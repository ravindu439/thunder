// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useGetUserType} from '@thunderid/configure-user-types';
import {Autocomplete, Box, Button, IconButton, MenuItem, Select, Stack, TextField, Typography} from '@wso2/oxygen-ui';
import {Plus, Trash2} from '@wso2/oxygen-ui-icons-react';
import {type JSX, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {SCIM_FIELD_CATALOG} from '../../constants/scim-field-catalog';
import type {ScimAttributeMapping} from '../../models/scim-connection';
import {flattenUserTypeAttributes} from '../../utils/attributeConfiguration';

interface ScimAttributeMappingTableProps {
  /** The chosen core user type's id, used to fetch its schema for the right-column options. */
  userTypeId: string | undefined;
  value: ScimAttributeMapping[];
  onChange: (mappings: ScimAttributeMapping[]) => void;
}

/**
 * Attribute-mapping list for a SCIM inbound connection: only the SCIM fields the admin has
 * actually mapped are shown, each as a row with a "SCIM field" picker (choosing among the
 * catalog fields not already used by another row) and a "local attribute" input. "+ Add mapping"
 * appends a new pending row; it's disabled while a row's field is unpicked or every catalog field
 * is already used. Mirrors `AttributeMappingSection`'s add/remove row interaction.
 */
export default function ScimAttributeMappingTable({
  userTypeId,
  value,
  onChange,
}: ScimAttributeMappingTableProps): JSX.Element {
  const {t} = useTranslation('connections');
  const userTypeQuery = useGetUserType(userTypeId);
  const localAttributeOptions: string[] = useMemo(
    () => flattenUserTypeAttributes(userTypeQuery.data?.schema),
    [userTypeQuery.data],
  );

  // Seed with the catalog fields that have a matching schema attribute, once the schema is known
  // and nothing has been mapped yet. Fields without a match are simply left out — the admin adds
  // them explicitly via "+ Add mapping" rather than seeing a table of blank/unmapped rows.
  useEffect(() => {
    if (value.length > 0 || localAttributeOptions.length === 0) {
      return;
    }
    const lowerOptions = new Set(localAttributeOptions.map((option) => option.toLowerCase()));
    const seeded = SCIM_FIELD_CATALOG.filter((entry) => lowerOptions.has(entry.defaultLocalAttribute.toLowerCase())).map(
      (entry) => ({scimField: entry.field, localAttribute: entry.defaultLocalAttribute}),
    );
    if (seeded.length > 0) {
      onChange(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localAttributeOptions]);

  const usedFields = new Set(value.map((row) => row.scimField).filter((field) => field !== ''));
  const remainingCatalog = SCIM_FIELD_CATALOG.filter((entry) => !usedFields.has(entry.field));
  const hasPendingRow: boolean = value.some((row) => row.scimField === '');
  const canAddRow: boolean = !hasPendingRow && remainingCatalog.length > 0;

  const updateRow = (index: number, patch: Partial<ScimAttributeMapping>): void => {
    onChange(value.map((row, i) => (i === index ? {...row, ...patch} : row)));
  };

  const removeRow = (index: number): void => {
    onChange(value.filter((_row, i) => i !== index));
  };

  const addRow = (): void => {
    onChange([...value, {scimField: '', localAttribute: ''}]);
  };

  const fieldOptionsFor = (row: ScimAttributeMapping): typeof SCIM_FIELD_CATALOG =>
    row.scimField === '' ? remainingCatalog : [SCIM_FIELD_CATALOG.find((entry) => entry.field === row.scimField)!, ...remainingCatalog];

  return (
    <Stack direction="column" spacing={1.5} data-testid="scim-attribute-mapping-table">
      {value.length > 0 && (
        <Stack direction="row" spacing={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{flex: 1}}>
            {t('scim.mapping.scimField', 'SCIM field')}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{flex: 1}}>
            {t('scim.mapping.localAttribute', 'Local attribute')}
          </Typography>
          <Box sx={{width: 40}} />
        </Stack>
      )}
      {value.map((row, index) => (
        <Stack
          key={row.scimField || 'pending'}
          direction="row"
          spacing={1.5}
          alignItems="center"
          data-testid={`scim-attribute-mapping-row-${row.scimField || 'pending'}`}
        >
          <Select
            fullWidth
            displayEmpty
            value={row.scimField}
            onChange={(e) => updateRow(index, {scimField: e.target.value})}
            renderValue={(fieldValue) => {
              const entry = SCIM_FIELD_CATALOG.find((catalogEntry) => catalogEntry.field === fieldValue);
              return entry ? t(entry.labelKey, entry.labelDefault) : t('scim.mapping.scimField.placeholder', 'Select a field');
            }}
            inputProps={{'aria-label': t('scim.mapping.scimField', 'SCIM field')}}
          >
            {fieldOptionsFor(row).map((entry) => (
              <MenuItem key={entry.field} value={entry.field}>
                {t(entry.labelKey, entry.labelDefault)}
              </MenuItem>
            ))}
          </Select>
          <Autocomplete
            fullWidth
            freeSolo
            options={localAttributeOptions}
            inputValue={row.localAttribute}
            onInputChange={(_event, inputValue) => updateRow(index, {localAttribute: inputValue})}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('scim.mapping.localAttribute.placeholder', 'Attribute name')}
                inputProps={{...params.inputProps, 'aria-label': t('scim.mapping.localAttribute', 'Local attribute')}}
              />
            )}
          />
          <IconButton
            onClick={() => removeRow(index)}
            aria-label={t('scim.mapping.remove', 'Remove mapping')}
            data-testid={`scim-attribute-mapping-remove-${row.scimField || 'pending'}`}
          >
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      ))}
      <Box>
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={addRow}
          disabled={!canAddRow}
          data-testid="scim-attribute-mapping-add"
        >
          {t('scim.mapping.add', 'Add mapping')}
        </Button>
      </Box>
    </Stack>
  );
}
