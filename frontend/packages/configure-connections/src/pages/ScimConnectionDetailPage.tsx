// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useGetUserType} from '@thunderid/configure-user-types';
import {OrganizationUnitTreePicker} from '@thunderid/configure-organization-units';
import {QueryErrorNotice, SettingsCard, UnsavedChangesBar} from '@thunderid/components';
import {getErrorMessage} from '@thunderid/utils';
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  ListingTable,
  PageContent,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@wso2/oxygen-ui';
import {AlertCircle, ChevronLeft, Trash2} from '@wso2/oxygen-ui-icons-react';
import {useMemo, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router';
import useScimConnection from '../api/useScimConnection';
import useUpdateScimConnection from '../api/useUpdateScimConnection';
import ReadOnlyCopyField from '../components/ReadOnlyCopyField';
import ScimAttributeMappingTable from '../components/scim/ScimAttributeMappingTable';
import ScimConnectionDeleteDialog from '../components/scim/ScimConnectionDeleteDialog';
import useConnectionRoutes from '../hooks/useConnectionRoutes';
import type {ScimAttributeMapping} from '../models/scim-connection';

interface EditableFields {
  name: string;
  targetOuId: string;
  attributeMappings: ScimAttributeMapping[];
}

export default function ScimConnectionDetailPage(): JSX.Element {
  const {t} = useTranslation('connections');
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>();
  const routes = useConnectionRoutes();

  const connectionQuery = useScimConnection(id);
  const updateMutation = useUpdateScimConnection(id ?? '');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<EditableFields>>({});

  const connection = connectionQuery.data;
  const isLoading: boolean = connectionQuery.isLoading;
  const notFound: boolean = !isLoading && !connection;

  // The target OU picker is scoped to the core user type's own OU subtree, same as at create time.
  const coreUserTypeQuery = useGetUserType(connection?.coreUserTypeId);

  const baseline: EditableFields = useMemo(
    () => ({
      name: connection?.name ?? '',
      targetOuId: connection?.targetOuId ?? '',
      attributeMappings: connection?.attributeMappings ?? [],
    }),
    [connection],
  );
  const values: EditableFields = {...baseline, ...editedValues};

  const dirty: boolean =
    values.name !== baseline.name ||
    values.targetOuId !== baseline.targetOuId ||
    JSON.stringify(values.attributeMappings) !== JSON.stringify(baseline.attributeMappings);
  const valid: boolean = values.name.trim() !== '' && values.targetOuId !== '';

  const clearUpdateError = (): void => {
    setGeneralError(null);
    if (updateMutation.isError) {
      updateMutation.reset();
    }
  };

  const setField = <K extends keyof EditableFields>(field: K, value: EditableFields[K]): void => {
    clearUpdateError();
    setEditedValues((prev) => ({...prev, [field]: value}));
  };

  const resetEdits = (): void => {
    setEditedValues({});
    setGeneralError(null);
  };

  const handleSave = (): void => {
    if (!valid || !id) return;

    setGeneralError(null);
    updateMutation.mutate(
      {
        name: values.name.trim(),
        targetOuId: values.targetOuId,
        attributeMappings: values.attributeMappings,
      },
      {
        onSuccess: () => {
          resetEdits();
        },
        onError: (error) => {
          setGeneralError(getErrorMessage(error, t, 'update.error', 'Failed to update connection. Please try again.'));
        },
      },
    );
  };

  return (
    <PageContent>
      <Button
        variant="text"
        startIcon={<ChevronLeft size={16} />}
        onClick={() => void navigate(routes.connections.list())}
        sx={{mb: 2, alignSelf: 'flex-start'}}
      >
        {t('scim.detail.back', 'Back to connections')}
      </Button>

      {isLoading ? (
        <Skeleton variant="rounded" height={480} />
      ) : connectionQuery.error ? (
        <QueryErrorNotice
          error={connectionQuery.error}
          t={t}
          variant="block"
          title={t('scim.detail.loadError', 'Failed to load SCIM connection')}
          onRetry={() => void connectionQuery.refetch()}
        />
      ) : notFound ? (
        <ListingTable.EmptyState
          illustration={<AlertCircle size={40} />}
          title={t('scim.detail.notFound.title', 'SCIM connection not found')}
          description={t(
            'scim.detail.notFound.description',
            'This connection may have been deleted or the link is incorrect.',
          )}
          action={
            <Button variant="outlined" onClick={() => void navigate(routes.connections.list())}>
              {t('scim.detail.back', 'Back to connections')}
            </Button>
          }
        />
      ) : (
        connection && (
          <>
            <Stack direction="column" spacing={0.5} sx={{mb: 3}}>
              <Typography variant="h5" fontWeight={700}>
                {connection.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('scim.detail.subtitle', 'SCIM inbound provisioning')}
              </Typography>
            </Stack>

            {generalError && (
              <Alert severity="error" onClose={clearUpdateError} sx={{mb: 3}}>
                {generalError}
              </Alert>
            )}

            <Stack direction="column" spacing={4}>
              <SettingsCard title={t('scim.detail.overview.title', 'Overview')}>
                <Stack direction="column" spacing={3}>
                  <FormControl fullWidth required>
                    <FormLabel htmlFor="scim-detail-name">{t('scim.detail.name.label', 'Name')}</FormLabel>
                    <TextField
                      id="scim-detail-name"
                      fullWidth
                      value={values.name}
                      error={values.name.trim() === ''}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                  </FormControl>

                  <Typography variant="body2">
                    {t('scim.detail.coreUserType.label', 'Core user type')}: {connection.coreUserType}
                  </Typography>

                  <FormControl fullWidth required>
                    <FormLabel sx={{mb: 0.75}}>{t('scim.detail.targetOu.label', 'Target organization unit')}</FormLabel>
                    <OrganizationUnitTreePicker
                      value={values.targetOuId}
                      onChange={(ouId) => setField('targetOuId', ouId)}
                      rootOuId={coreUserTypeQuery.data?.ouId}
                    />
                  </FormControl>
                </Stack>
              </SettingsCard>

              <SettingsCard title={t('scim.detail.credentials.title', 'Credentials')}>
                <Stack direction="column" spacing={2}>
                  <ReadOnlyCopyField
                    id="scim-detail-base-url"
                    label={t('scim.detail.baseUrl.label', 'SCIM base URL')}
                    value={connection.baseUrl}
                  />
                  <ReadOnlyCopyField
                    id="scim-detail-client-id"
                    label={t('scim.detail.clientId.label', 'Client ID')}
                    value={connection.clientId}
                  />
                  <ReadOnlyCopyField
                    id="scim-detail-client-secret"
                    label={t('scim.detail.clientSecret.label', 'Client secret')}
                    value={connection.clientSecret}
                  />
                </Stack>
              </SettingsCard>

              <SettingsCard title={t('scim.detail.mapping.title', 'Attribute mapping')}>
                <ScimAttributeMappingTable
                  userTypeId={connection.coreUserTypeId}
                  value={values.attributeMappings}
                  onChange={(mappings) => setField('attributeMappings', mappings)}
                />
              </SettingsCard>

              <SettingsCard title={t('scim.detail.dangerZone.title', 'Danger zone')}>
                <Typography variant="h6" gutterBottom color="error">
                  {t('scim.detail.dangerZone.delete.title', 'Delete connection')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                  {t(
                    'scim.detail.dangerZone.delete.description',
                    'The external identity provider will no longer be able to provision users through this connection. This cannot be undone.',
                  )}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                  onClick={() => setDeleteOpen(true)}
                  data-testid="scim-connection-delete-button"
                >
                  {t('common:actions.delete')}
                </Button>
              </SettingsCard>
            </Stack>

            {dirty && (
              <UnsavedChangesBar
                message={t('scim.detail.saveBar.unsaved', 'You have unsaved changes')}
                resetLabel={t('scim.detail.saveBar.reset', 'Reset')}
                saveLabel={t('scim.detail.saveBar.save', 'Save changes')}
                savingLabel={t('common:status.saving', 'Saving...')}
                isSaving={updateMutation.isPending}
                saveDisabled={!valid}
                onReset={resetEdits}
                onSave={handleSave}
              />
            )}

            <ScimConnectionDeleteDialog
              open={deleteOpen}
              connectionId={connection.id}
              connectionName={connection.name}
              onClose={() => setDeleteOpen(false)}
              onSuccess={() => {
                setDeleteOpen(false);
                void navigate(routes.connections.list());
              }}
            />
          </>
        )
      )}
    </PageContent>
  );
}
