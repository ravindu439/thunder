// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDeleteTheme, useGetThemeUsages} from '@thunderid/design';
import {getErrorMessage} from '@thunderid/utils';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@wso2/oxygen-ui';
import {useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';

const MAX_VISIBLE_USAGES = 5;

export interface ThemeDeleteDialogProps {
  open: boolean;
  themeId: string | null;
  themeName: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ThemeDeleteDialog({
  open,
  themeId,
  themeName,
  onClose,
  onSuccess = undefined,
}: ThemeDeleteDialogProps): JSX.Element {
  const {t} = useTranslation('design');
  const deleteTheme = useDeleteTheme();
  const [error, setError] = useState<string | null>(null);

  const {data: usagesData, isLoading: isLoadingUsages} = useGetThemeUsages(themeId, open);

  const usagesKnown = usagesData !== undefined && usagesData.totalResults !== null;
  const visibleUsages = usagesData?.usages.slice(0, MAX_VISIBLE_USAGES) ?? [];
  const hiddenCount = (usagesData?.totalResults ?? 0) - visibleUsages.length;

  const handleCancel = (): void => {
    if (deleteTheme.isPending) return;
    setError(null);
    // Only reset once the mutation has actually failed: resetting a still-pending mutation
    // flips isPending back to false before the in-flight request settles.
    if (deleteTheme.isError) {
      deleteTheme.reset();
    }
    onClose();
  };

  const handleConfirm = (): void => {
    if (!themeId) return;

    setError(null);
    deleteTheme.mutate(themeId, {
      onSuccess: (): void => {
        setError(null);
        onClose();
        onSuccess?.();
      },
      onError: (err: Error) => {
        setError(getErrorMessage(err, t, 'themes.delete.error', 'Failed to delete theme. Please try again.'));
      },
    });
  };

  const message = themeName ? t('themes.delete.message', {name: themeName}) : t('themes.delete.messageUnnamed');

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('themes.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>{message}</DialogContentText>

        {isLoadingUsages ? (
          <Alert severity="info" icon={<CircularProgress size={16} />} sx={{mb: 2}}>
            {t('themes.delete.usages.loading')}
          </Alert>
        ) : !usagesKnown ? (
          <Alert severity="warning" sx={{mb: 2}}>
            {t('themes.delete.disclaimer')}
          </Alert>
        ) : (usagesData?.totalResults ?? 0) > 0 ? (
          <Alert severity="warning" sx={{mb: 2}}>
            <Typography variant="body2" sx={{mb: 1}}>
              {t('themes.delete.usages.title')}
            </Typography>
            <List dense disablePadding>
              {visibleUsages.map((usage) => (
                <ListItem key={usage.id} disableGutters sx={{py: 0}}>
                  <ListItemText primary={<Typography variant="body2">{usage.displayName}</Typography>} />
                </ListItem>
              ))}
              {hiddenCount > 0 && (
                <ListItem disableGutters sx={{py: 0}}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        {t('themes.delete.usages.more', {count: hiddenCount})}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Alert>
        ) : (
          <Alert severity="info" sx={{mb: 2}}>
            {t('themes.delete.usages.none')}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={deleteTheme.isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={deleteTheme.isPending || !themeId || isLoadingUsages}
        >
          {deleteTheme.isPending ? t('common:status.deleting') : t('common:actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
