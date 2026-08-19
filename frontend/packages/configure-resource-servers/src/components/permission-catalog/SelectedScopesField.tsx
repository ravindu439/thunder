// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FormControl, IconButton, InputAdornment, TextField, Tooltip} from '@wso2/oxygen-ui';
import {Check, Copy} from '@wso2/oxygen-ui-icons-react';
import {useEffect, useRef, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';
import type {ResourcePermissions} from '../../models/resource-server';

export interface SelectedScopesFieldProps {
  /** Permissions currently selected, grouped by resource server. */
  selected: ResourcePermissions[];
}

export default function SelectedScopesField({selected}: SelectedScopesFieldProps): JSX.Element {
  const {t} = useTranslation();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const scopes = selected.flatMap((entry) => entry.permissions).join(' ');

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(scopes)
      .then(() => {
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        /* clipboard unavailable; no-op */
      });
  };

  return (
    <FormControl fullWidth>
      <TextField
        id="permission-catalog-scopes"
        size="small"
        value={scopes}
        placeholder={t('resourceServers:permissionCatalog.scopes.placeholder', 'No permissions selected')}
        InputProps={{
          readOnly: true,
          sx: {fontFamily: 'monospace'},
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title={copied ? t('resourceServers:permissionCatalog.scopes.copied', 'Copied') : ''}
                open={copied}
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={scopes === ''}
                    onClick={handleCopy}
                    aria-label={t('resourceServers:permissionCatalog.scopes.copy', 'Copy scopes')}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
}
