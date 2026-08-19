// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  Autocomplete,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  type AutocompleteRenderInputParams,
} from '@wso2/oxygen-ui';
import {useMemo, useState, type ReactNode, type SyntheticEvent} from 'react';
import {useTranslation} from 'react-i18next';
import type {CommonResourcePropertiesPropsInterface} from '@/features/flows/components/resource-property-panel/CommonResourceProperties';
import useResourceFieldError from '@/features/flows/hooks/useResourceFieldError';
import {ElementTypes, type Element} from '@/features/flows/models/elements';

/**
 * Props interface of {@link FieldExtendedProperties}
 */
export type FieldExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The FieldExtendedProperties component.
 */
function FieldExtendedProperties({resource, onChange}: FieldExtendedPropertiesPropsInterface): ReactNode {
  const {t} = useTranslation();

  const attributes: string[] = useMemo(() => ['email', 'username', 'given_name'], []);
  const credentialAttributes: string[] = useMemo(() => ['password', 'pin', 'secret'], []);

  const resourceRef = (resource as Element & {ref?: string})?.ref;

  // Use local state to track the selected value immediately (avoids revert on blur due to debounced updates)
  // Initialize with the resourceRef value directly (supports free-solo values not in the predefined list)
  const [localSelectedValue, setLocalSelectedValue] = useState<string | null>(() => resourceRef ?? null);

  // Sync local state when resource changes (e.g., when switching to a different element)
  const [prevResourceRef, setPrevResourceRef] = useState(resourceRef);
  if (resourceRef !== prevResourceRef) {
    setPrevResourceRef(resourceRef);
    setLocalSelectedValue(resourceRef ?? null);
  }

  /**
   * Get the error message for the ref field.
   */
  const errorMessage: string = useResourceFieldError(resource?.id, 'ref');

  return (
    <Stack>
      <Autocomplete
        freeSolo={resource.type !== ElementTypes.PasswordInput}
        disablePortal
        key={resource.id}
        options={(resource.type === ElementTypes.PasswordInput ? credentialAttributes : attributes) ?? []}
        getOptionLabel={(attribute: string) => attribute}
        sx={{width: '100%'}}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <>
            <FormLabel htmlFor="attribute-select">{t('flows:core.fieldExtendedProperties.attribute')}</FormLabel>
            <TextField
              {...params}
              id="attribute-select"
              placeholder={t('flows:core.fieldExtendedProperties.selectAttribute')}
              error={!!errorMessage}
            />
          </>
        )}
        value={localSelectedValue}
        onChange={(_: SyntheticEvent, attribute: string | null) => {
          setLocalSelectedValue(attribute);
          onChange('ref', attribute ?? '', resource);
        }}
        onInputChange={(_: SyntheticEvent, value: string, reason: string) => {
          // Handle free-form input (when user types a custom value)
          if (reason === 'input') {
            setLocalSelectedValue(value);
            onChange('ref', value, resource, true);
          }
        }}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </Stack>
  );
}

export default FieldExtendedProperties;
