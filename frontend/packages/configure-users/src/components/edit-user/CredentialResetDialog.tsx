// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  Stack,
} from '@wso2/oxygen-ui';
import {useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import type {CredentialFieldInfo} from './CredentialsTabPanel';
import useUpdateUserCredentials from '../../api/useUpdateUserCredentials';
import getUserErrorMessage from '../../utils/getUserErrorMessage';
import CredentialFieldInput from '../CredentialFieldInput';

interface CredentialValues {
  newValue: string;
  confirmValue: string;
}

interface CredentialResetDialogProps {
  open: boolean;
  field: CredentialFieldInfo | null;
  userId: string;
  onClose: () => void;
}

export default function CredentialResetDialog({open, field, userId, onClose}: CredentialResetDialogProps): JSX.Element {
  const {t} = useTranslation('users');
  const updateCredentialsMutation = useUpdateUserCredentials();

  const [formValues, setFormValues] = useState<CredentialValues>({newValue: '', confirmValue: ''});
  const [mismatchError, setMismatchError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormValues({newValue: '', confirmValue: ''});
    setMismatchError(false);
    updateCredentialsMutation.reset();
    onClose();
  };

  const handleSave = () => {
    if (!field || formValues.newValue.trim() === '') return;

    if (formValues.newValue !== formValues.confirmValue) {
      setMismatchError(true);
      return;
    }

    setIsSubmitting(true);
    updateCredentialsMutation.mutate(
      {userId, data: {credentials: {[field.fieldName]: formValues.newValue}}},
      {
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {field && (
        <>
          <DialogTitle>
            {t('manageUser.sections.credentials.resetTitle', 'Reset {{label}}?', {label: field.label})}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb: 2}}>
              {t(
                'manageUser.sections.credentials.resetDialogMessage',
                'A new {{label}} will be set for this user. The current {{label}} will be invalidated immediately.',
                {label: field.label.toLowerCase()},
              )}
            </DialogContentText>
            <Alert severity="warning" sx={{mb: 2}}>
              {t(
                'manageUser.sections.credentials.resetDialogDisclaimer',
                'This action cannot be undone. The current {{label}} will stop working as soon as you confirm.',
                {label: field.label.toLowerCase()},
              )}
            </Alert>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <FormLabel sx={{mb: 0.5}}>
                  {t('manageUser.sections.credentials.newValue', 'New {{label}}', {label: field.label})}
                </FormLabel>
                <CredentialFieldInput
                  id={`credential-new-${field.fieldName}`}
                  name={`new-${field.fieldName}`}
                  value={formValues.newValue}
                  placeholder={t('manageUser.sections.credentials.newValuePlaceholder', 'Enter new {{label}}', {
                    label: field.label.toLowerCase(),
                  })}
                  required
                  error={false}
                  color="primary"
                  onChange={(e) => {
                    setFormValues((prev) => ({...prev, newValue: e.target.value}));
                    setMismatchError(false);
                    updateCredentialsMutation.reset(); // a save error is stale once the form changes
                  }}
                  inputRef={null}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel sx={{mb: 0.5}}>
                  {t('manageUser.sections.credentials.confirmValue', 'Confirm {{label}}', {
                    label: field.label,
                  })}
                </FormLabel>
                <CredentialFieldInput
                  id={`credential-confirm-${field.fieldName}`}
                  name={`confirm-${field.fieldName}`}
                  value={formValues.confirmValue}
                  placeholder={t('manageUser.sections.credentials.confirmValuePlaceholder', 'Confirm new {{label}}', {
                    label: field.label.toLowerCase(),
                  })}
                  required
                  error={mismatchError}
                  helperText={
                    mismatchError ? t('manageUser.sections.credentials.mismatch', 'Values do not match.') : undefined
                  }
                  color={mismatchError ? 'error' : 'primary'}
                  onChange={(e) => {
                    setFormValues((prev) => ({...prev, confirmValue: e.target.value}));
                    setMismatchError(false);
                    updateCredentialsMutation.reset(); // a save error is stale once the form changes
                  }}
                  inputRef={null}
                />
              </FormControl>
            </Stack>
            {updateCredentialsMutation.error && (
              <Alert severity="error" sx={{mt: 2}}>
                {getUserErrorMessage(
                  updateCredentialsMutation.error,
                  t,
                  'updateCredentials.error',
                  'Failed to update credentials. Please try again.',
                )}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isSubmitting}>
              {t('common:actions.cancel', 'Cancel')}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleSave}
              disabled={isSubmitting || formValues.newValue.trim() === ''}
            >
              {isSubmitting
                ? t('manageUser.sections.credentials.resetting', 'Resetting…')
                : t('manageUser.sections.credentials.resetButton', 'Reset {{label}}', {
                    label: field.label,
                  })}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
