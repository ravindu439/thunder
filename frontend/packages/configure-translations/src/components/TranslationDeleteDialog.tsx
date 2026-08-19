// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getDisplayNameForCode, useDeleteTranslations} from '@thunderid/i18n';
import {getErrorMessage} from '@thunderid/utils';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert} from '@wso2/oxygen-ui';
import {useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';

export interface TranslationDeleteDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * The language code to delete translations for
   */
  language: string | null;
  /**
   * Callback when the dialog should be closed
   */
  onClose: () => void;
  /**
   * Callback when translations are successfully deleted
   */
  onSuccess?: () => void;
}

/**
 * Dialog component for confirming deletion of all custom translations for a language.
 */
export default function TranslationDeleteDialog({
  open,
  language,
  onClose,
  onSuccess = undefined,
}: TranslationDeleteDialogProps): JSX.Element {
  const {t} = useTranslation('translations');
  const deleteTranslations = useDeleteTranslations();
  const [error, setError] = useState<string | null>(null);

  const displayName = language ? getDisplayNameForCode(language) : '';

  const handleCancel = (): void => {
    if (deleteTranslations.isPending) return;
    setError(null);
    onClose();
  };

  const handleConfirm = (): void => {
    if (!language) return;

    deleteTranslations.mutate(language, {
      onSuccess: (): void => {
        setError(null);
        onClose();
        onSuccess?.();
      },
      onError: (err) => {
        setError(getErrorMessage(err, t, 'delete.error', 'Failed to delete translations. Please try again.'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>{t('delete.message', {language: displayName ?? language})}</DialogContentText>
        <Alert severity="warning" sx={{mb: 2}}>
          {t('delete.disclaimer')}
        </Alert>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteTranslations.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleteTranslations.isPending}>
          {deleteTranslations.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
