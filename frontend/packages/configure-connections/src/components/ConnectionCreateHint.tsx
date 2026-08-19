// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Alert, Stack, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import ReadOnlyCopyField from './ReadOnlyCopyField';

interface ConnectionCreateHintProps {
  /** Translated setup instruction shown above the redirect URI. */
  instruction: string;
  /** Derived gate callback URL the admin must register with the provider. */
  redirectUri: string;
}

/**
 * Setup hint shown above the credentials form on connection creation: instructs the admin to
 * register an OAuth app with the provider first, and surfaces the redirect URI to copy into it.
 */
export default function ConnectionCreateHint({instruction, redirectUri}: ConnectionCreateHintProps): JSX.Element {
  const {t} = useTranslation('connections');

  return (
    <Alert severity="info" data-testid="connection-create-hint">
      <Stack direction="column" spacing={1.5}>
        <Typography variant="body2">{instruction}</Typography>
        <ReadOnlyCopyField
          id="create-hint-redirect-uri"
          label={t('form.fields.redirectUri.label', 'Redirect URI')}
          value={redirectUri}
        />
      </Stack>
    </Alert>
  );
}
