// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useToast} from '@thunderid/contexts';
import {useLogger} from '@thunderid/logger/react';
import {getErrorMessage} from '@thunderid/utils';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@wso2/oxygen-ui';
import {useCallback, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import useDeleteResourceServer from '../api/useDeleteResourceServer';
import type {ResourceServer} from '../models/resource-server';

export interface ResourceServerDeleteDialogProps {
  open: boolean;
  resourceServer: ResourceServer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResourceServerDeleteDialog({
  open,
  resourceServer,
  onClose,
  onSuccess,
}: ResourceServerDeleteDialogProps): JSX.Element {
  const {t} = useTranslation();
  const {showToast} = useToast();
  const logger = useLogger('ResourceServerDeleteDialog');
  const deleteResourceServer = useDeleteResourceServer();
  const [error, setError] = useState<string | null>(null);

  // Resolves an error through the `resourceServers` catalog. `t` defaults to the `common`
  // namespace, so this forwards explicit `ns:` prefixes unchanged and prefixes bare keys with
  // `resourceServers:`, per getErrorMessage's namespace-resolution contract.
  const tForErrors = useCallback(
    (key: string, options?: Record<string, unknown>): string =>
      t(key.includes(':') ? key : `resourceServers:${key}`, options),
    [t],
  );

  const handleClose = (): void => {
    if (deleteResourceServer.isPending) return;
    setError(null);
    onClose();
  };

  const handleDelete = (): void => {
    if (!resourceServer) return;

    deleteResourceServer.mutate(resourceServer.id, {
      onSuccess: () => {
        setError(null);
        showToast(t('resourceServers:delete.success', 'Resource server deleted successfully.'), 'success');
        onSuccess();
      },
      onError: (err: Error) => {
        logger.error('Failed to delete resource server', {error: err});
        setError(
          getErrorMessage(err, tForErrors, 'delete.error', 'Failed to delete resource server. Please try again.'),
        );
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('resourceServers:delete.title', 'Delete resource server')}</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{mb: 2}}>
          {t('resourceServers:delete.warning', 'This action cannot be undone.')}
        </Alert>
        <Typography variant="body2">
          {t('resourceServers:delete.confirm', 'Are you sure you want to delete')}{' '}
          <strong>{resourceServer?.name}</strong>?
        </Typography>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} disabled={deleteResourceServer.isPending}>
          {t('common:cancel', 'Cancel')}
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteResourceServer.isPending}>
          {deleteResourceServer.isPending ? t('common:deleting', 'Deleting…') : t('common:delete', 'Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
