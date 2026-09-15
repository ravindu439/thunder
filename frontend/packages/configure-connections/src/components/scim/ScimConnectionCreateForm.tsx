// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useGetUserTypes} from '@thunderid/configure-user-types';
import {OrganizationUnitTreePicker} from '@thunderid/configure-organization-units';
import {getErrorMessage} from '@thunderid/utils';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@wso2/oxygen-ui';
import {ChevronLeft} from '@wso2/oxygen-ui-icons-react';
import {useMemo, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router';
import useCreateScimConnection from '../../api/useCreateScimConnection';
import useConnectionRoutes from '../../hooks/useConnectionRoutes';
import type {ScimAttributeMapping} from '../../models/scim-connection';
import isConflictError from '../../utils/isConflictError';
import ScimAttributeMappingTable from './ScimAttributeMappingTable';

interface ScimConnectionCreateFormProps {
  /** Connection name collected on the wizard's name step. */
  name: string;
  /** Call when the create request 409s on a duplicate name, to bounce back to the name step. */
  onNameConflict: () => void;
  /** Call when the wizard's Back button is pressed, to return to the name step. */
  onBack: () => void;
}

/**
 * The SCIM inbound provisioning create form: core user type, target OU, attribute mapping, and
 * a mocked credentials preview, then submission via `useCreateScimConnection`. Renders its own
 * Back + submit footer, matching `TrustedIssuerCreateForm`'s contract, so the wizard's CONFIGURE
 * step can render either one identically.
 */
export default function ScimConnectionCreateForm({
  name,
  onNameConflict,
  onBack,
}: ScimConnectionCreateFormProps): JSX.Element {
  const {t} = useTranslation('connections');
  const navigate = useNavigate();
  const routes = useConnectionRoutes();
  const createConnection = useCreateScimConnection();

  const userTypesQuery = useGetUserTypes();
  const userTypes = useMemo(() => userTypesQuery.data?.types ?? [], [userTypesQuery.data]);

  const [coreUserTypeId, setCoreUserTypeId] = useState<string>('');
  const [targetOuId, setTargetOuId] = useState<string>('');
  const [mappings, setMappings] = useState<ScimAttributeMapping[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // A fresh form with exactly one user type: auto-select it, same UX as
  // AttributeMappingSection's single-user-type auto-fill.
  if (coreUserTypeId === '' && userTypes.length === 1) {
    setCoreUserTypeId(userTypes[0].id);
  }

  const selectedType = userTypes.find((type) => type.id === coreUserTypeId);

  const formValid: boolean = coreUserTypeId !== '' && targetOuId !== '';

  const clearCreateError = (): void => {
    setGeneralError(null);
    if (createConnection.isError) {
      createConnection.reset();
    }
  };

  const handleCreate = (): void => {
    if (!formValid || !selectedType) {
      return;
    }
    setGeneralError(null);
    createConnection.mutate(
      {
        name,
        coreUserType: selectedType.name,
        coreUserTypeId: selectedType.id,
        targetOuId,
        attributeMappings: mappings,
      },
      {
        onSuccess: (created) => {
          void navigate(routes.scimConnections.detail(created.id));
        },
        onError: (error) => {
          if (isConflictError(error)) {
            onNameConflict();
          } else {
            setGeneralError(getErrorMessage(error, t, 'create.error', 'Failed to create connection.'));
          }
        },
      },
    );
  };

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="column" spacing={1}>
        <Typography variant="h1" gutterBottom>
          {t('scim.create.title', 'Configure SCIM inbound provisioning')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t(
            'scim.create.subtitle',
            'Choose which user type external SCIM clients provision, where their users land, and how SCIM fields map to your attributes.',
          )}
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{p: 3}}>
        <Stack direction="column" spacing={3}>
          <FormControl sx={{maxWidth: 360}} required>
            <FormLabel sx={{mb: 0.75}} htmlFor="scim-core-user-type">
              {t('scim.create.coreUserType.label', 'Core user type')}
            </FormLabel>
            <Select
              id="scim-core-user-type"
              displayEmpty
              value={coreUserTypeId}
              onChange={(e) => {
                clearCreateError();
                setCoreUserTypeId(e.target.value);
                setTargetOuId('');
                setMappings([]);
              }}
              renderValue={(value) =>
                value ? (userTypes.find((type) => type.id === value)?.name ?? value) : t('scim.create.coreUserType.placeholder', 'Select a user type')
              }
              data-testid="scim-core-user-type-select"
            >
              {userTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedType && (
            <FormControl required>
              <FormLabel sx={{mb: 0.75}}>{t('scim.create.targetOu.label', 'Target organization unit')}</FormLabel>
              <OrganizationUnitTreePicker
                value={targetOuId}
                onChange={(ouId) => {
                  clearCreateError();
                  setTargetOuId(ouId);
                }}
                rootOuId={selectedType.ouId}
              />
            </FormControl>
          )}

          {selectedType && (
            <Box>
              <Typography variant="subtitle2" sx={{mb: 1.5}}>
                {t('scim.create.mapping.title', 'Attribute mapping')}
              </Typography>
              <ScimAttributeMappingTable userTypeId={selectedType.id} value={mappings} onChange={setMappings} />
            </Box>
          )}
        </Stack>
      </Paper>

      {generalError && (
        <Alert severity="error" onClose={clearCreateError}>
          {generalError}
        </Alert>
      )}

      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Button variant="outlined" startIcon={<ChevronLeft size={16} />} onClick={onBack}>
          {t('common:actions.back')}
        </Button>
        <Button
          variant="contained"
          disabled={!formValid || createConnection.isPending}
          onClick={handleCreate}
          data-testid="scim-connection-create-submit"
        >
          {createConnection.isPending ? t('common:status.saving') : t('form.actions.create', 'Create connection')}
        </Button>
      </Box>
    </Stack>
  );
}
