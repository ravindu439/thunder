// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useToast} from '@thunderid/contexts';
import {useLogger} from '@thunderid/logger/react';
import {getErrorMessage} from '@thunderid/utils';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@wso2/oxygen-ui';
import {useCallback, useState, type JSX} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import useSetDefaultResourceServer from '../api/useSetDefaultResourceServer';
import type {ResourceServer} from '../models/resource-server';

export interface SetDefaultResourceServerDialogProps {
  open: boolean;
  resourceServer: ResourceServer | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SetDefaultResourceServerDialog({
  open,
  resourceServer,
  onClose,
  onSuccess = undefined,
}: SetDefaultResourceServerDialogProps): JSX.Element {
  const {t} = useTranslation();
  const {showToast} = useToast();
  const logger = useLogger('SetDefaultResourceServerDialog');
  const setDefault = useSetDefaultResourceServer();
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
    if (setDefault.isPending) return;
    setError(null);
    onClose();
  };

  const handleConfirm = (): void => {
    if (!resourceServer) return;

    setDefault.mutate(
      {resourceServerId: resourceServer.id},
      {
        onSuccess: () => {
          setError(null);
          showToast(
            t('resourceServers:setDefault.success', '{{name}} is now the default resource server.', {
              name: resourceServer.name,
            }),
            'success',
          );
          onSuccess?.();
          onClose();
        },
        onError: (err: Error) => {
          logger.error('Failed to set default resource server', {error: err});
          setError(getErrorMessage(err, tForErrors, 'setDefault.error', 'Failed to set the default resource server.'));
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('resourceServers:setDefault.title', 'Set default resource server')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          <Trans
            i18nKey="resourceServers:setDefault.message"
            defaults="<bold>{{name}}</bold> will become the default resource server."
            values={{name: resourceServer?.name}}
            components={{bold: <strong />}}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
          {t(
            'resourceServers:setDefault.explanation',
            'When an application requests a token without naming a resource server, its permissions come from this one. Only one resource server can be the default at a time.',
          )}
        </Typography>
        {error && (
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} disabled={setDefault.isPending}>
          {t('common:cancel', 'Cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={setDefault.isPending}>
          {setDefault.isPending
            ? t('resourceServers:setDefault.setting', 'Setting…')
            : t('resourceServers:setDefault.confirm', 'Set as default')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
