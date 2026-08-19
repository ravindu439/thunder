// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getErrorMessage} from '@thunderid/utils';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert} from '@wso2/oxygen-ui';
import {useCallback, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import useDeleteVerifiablePresentation from '../api/useDeleteVerifiablePresentation';

export interface VerifiablePresentationDeleteDialogProps {
  open: boolean;
  vpId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Dialog to confirm deletion of a presentation definition.
 */
export default function VerifiablePresentationDeleteDialog({
  open,
  vpId,
  onClose,
  onSuccess = undefined,
}: VerifiablePresentationDeleteDialogProps): JSX.Element {
  const {t} = useTranslation();

  // Resolves an error through the `verifiable-presentations` catalog. `t` defaults to the `common`
  // namespace, so this forwards explicit `ns:` prefixes unchanged and prefixes bare keys, per
  // getErrorMessage's namespace-resolution contract.
  const tForErrors = useCallback(
    (key: string, options?: Record<string, unknown>): string =>
      t(key.includes(':') ? key : `verifiable-presentations:${key}`, options),
    [t],
  );

  const deleteVP = useDeleteVerifiablePresentation();
  const [error, setError] = useState<string | null>(null);

  const handleCancel = (): void => {
    if (deleteVP.isPending) return;
    setError(null);
    onClose();
  };

  const handleConfirm = (): void => {
    if (!vpId) return;
    setError(null);
    deleteVP.mutate(vpId, {
      onSuccess: (): void => {
        setError(null);
        onClose();
        onSuccess?.();
      },
      onError: (err: Error) => {
        setError(getErrorMessage(err, tForErrors, 'delete.error', 'Failed to delete presentation definition'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('verifiable-presentations:delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>{t('verifiable-presentations:delete.message')}</DialogContentText>
        <Alert severity="warning" sx={{mb: 2}}>
          {t('verifiable-presentations:delete.disclaimer')}
        </Alert>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteVP.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleteVP.isPending || !vpId}>
          {deleteVP.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
