// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getErrorMessage} from '@thunderid/utils';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert} from '@wso2/oxygen-ui';
import {useCallback, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import useDeleteVerifiableCredential from '../api/useDeleteVerifiableCredential';

export interface VerifiableCredentialDeleteDialogProps {
  open: boolean;
  vcId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Dialog to confirm deletion of a credential configuration.
 */
export default function VerifiableCredentialDeleteDialog({
  open,
  vcId,
  onClose,
  onSuccess = undefined,
}: VerifiableCredentialDeleteDialogProps): JSX.Element {
  const {t} = useTranslation();
  const deleteVC = useDeleteVerifiableCredential();
  const [error, setError] = useState<string | null>(null);

  // Resolves an error through the `verifiable-credentials` catalog. `t` defaults to the `common`
  // namespace, so this forwards explicit `ns:` prefixes unchanged and prefixes bare keys with
  // `verifiable-credentials:`, per getErrorMessage's namespace-resolution contract.
  const tForErrors = useCallback(
    (key: string, options?: Record<string, unknown>): string =>
      t(key.includes(':') ? key : `verifiable-credentials:${key}`, options),
    [t],
  );

  const handleCancel = (): void => {
    if (deleteVC.isPending) return;
    setError(null);
    onClose();
  };

  const handleConfirm = (): void => {
    if (!vcId) return;
    setError(null);
    deleteVC.mutate(vcId, {
      onSuccess: (): void => {
        setError(null);
        onClose();
        onSuccess?.();
      },
      onError: (err: Error) => {
        setError(getErrorMessage(err, tForErrors, 'delete.error', 'Failed to delete credential template'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('verifiable-credentials:delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>{t('verifiable-credentials:delete.message')}</DialogContentText>
        <Alert severity="warning" sx={{mb: 2}}>
          {t('verifiable-credentials:delete.disclaimer')}
        </Alert>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteVC.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleteVC.isPending || !vcId}>
          {deleteVC.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
