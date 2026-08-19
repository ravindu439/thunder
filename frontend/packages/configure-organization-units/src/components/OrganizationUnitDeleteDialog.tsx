// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getErrorMessage} from '@thunderid/utils';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import useDeleteOrganizationUnit from '../api/useDeleteOrganizationUnit';

export interface OrganizationUnitDeleteDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * The ID of the organization unit to delete
   */
  organizationUnitId: string | null;
  /**
   * Callback when the dialog should be closed
   */
  onClose: () => void;
  /**
   * Callback when the organization unit is successfully deleted
   */
  onSuccess?: () => void;
}

/**
 * Dialog component for confirming organization unit deletion. Owns the delete mutation itself, so
 * a failure renders inline here rather than closing the dialog and handing the message to a
 * parent — the parent only learns about a successful deletion.
 */
export default function OrganizationUnitDeleteDialog({
  open,
  organizationUnitId,
  onClose,
  onSuccess = undefined,
}: OrganizationUnitDeleteDialogProps): JSX.Element {
  const {t} = useTranslation();
  const deleteOrganizationUnit = useDeleteOrganizationUnit();

  // Resolves an error through the `organizationUnits` catalog. `t` defaults to the `common`
  // namespace, so this forwards explicit `ns:` prefixes unchanged and prefixes bare keys with
  // `organizationUnits:`, per getErrorMessage's namespace-resolution contract.
  const tForErrors = (key: string, options?: Record<string, unknown>): string =>
    t(key.includes(':') ? key : `organizationUnits:${key}`, options);

  const handleCancel = (): void => {
    if (deleteOrganizationUnit.isPending) return;
    deleteOrganizationUnit.reset();
    onClose();
  };

  const handleConfirm = (): void => {
    if (!organizationUnitId) return;

    deleteOrganizationUnit.mutate(organizationUnitId, {
      onSuccess: (): void => {
        onClose();
        onSuccess?.();
      },
    });
  };

  const errorMessage = deleteOrganizationUnit.error
    ? getErrorMessage(
        deleteOrganizationUnit.error,
        tForErrors,
        'delete.dialog.error',
        'Failed to delete organization unit. Please try again.',
      )
    : null;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('organizationUnits:delete.dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>{t('organizationUnits:delete.dialog.message')}</DialogContentText>
        <Alert severity="warning" sx={{mb: 2}}>
          {t('organizationUnits:delete.dialog.disclaimer')}
        </Alert>
        {errorMessage && (
          <Alert severity="error" sx={{mb: 2}}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteOrganizationUnit.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleteOrganizationUnit.isPending}>
          {deleteOrganizationUnit.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
