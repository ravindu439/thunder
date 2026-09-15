// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getErrorMessage} from '@thunderid/utils';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@wso2/oxygen-ui';
import {useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import useDeleteScimConnection from '../../api/useDeleteScimConnection';

export interface ScimConnectionDeleteDialogProps {
  open: boolean;
  connectionId: string;
  connectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Confirms deletion of a mocked SCIM inbound connection. A dedicated dialog rather than reusing
 * `ConnectionDeleteDialog`: that component's usage check calls the real
 * `GET /connections/{type}/{id}/usages` API, which doesn't apply to a mock-store resource with no
 * backend `ConnectionType`.
 */
export default function ScimConnectionDeleteDialog({
  open,
  connectionId,
  connectionName,
  onClose,
  onSuccess,
}: ScimConnectionDeleteDialogProps): JSX.Element {
  const {t} = useTranslation('connections');
  const deleteConnection = useDeleteScimConnection();
  const [error, setError] = useState<string | null>(null);

  const handleCancel = (): void => {
    if (deleteConnection.isPending) return;
    setError(null);
    deleteConnection.reset();
    onClose();
  };

  const handleConfirm = (): void => {
    setError(null);
    deleteConnection.mutate(connectionId, {
      onSuccess: (): void => {
        setError(null);
        onSuccess();
      },
      onError: (err: Error) => {
        setError(getErrorMessage(err, t, 'delete.error', 'Failed to delete connection. Please try again.'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('delete.title', 'Delete connection')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>
          {t('delete.message', 'Are you sure you want to delete {{name}}?', {name: connectionName})}
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteConnection.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={deleteConnection.isPending}
          data-testid="scim-connection-delete-confirm"
        >
          {deleteConnection.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
