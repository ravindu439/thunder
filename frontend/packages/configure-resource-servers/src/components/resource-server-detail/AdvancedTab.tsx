// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SettingsCard} from '@thunderid/components';
import {FormControl, FormLabel, Stack, TextField} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import type {ResourceServer} from '../../models/resource-server';

interface AdvancedTabProps {
  resourceServer: ResourceServer;
  identifier: string;
  onIdentifierChange: (value: string) => void;
}

export default function AdvancedTab({resourceServer, identifier, onIdentifierChange}: AdvancedTabProps): JSX.Element {
  const {t} = useTranslation();

  return (
    <Stack spacing={3}>
      <SettingsCard
        title={t('resourceServers:edit.advanced.identifier.title', 'Configurations')}
        description={
          resourceServer.type === 'MCP'
            ? t(
                'resourceServers:edit.advanced.identifier.descriptionMcp',
                'Configuration settings for this MCP server.',
              )
            : t(
                'resourceServers:edit.advanced.identifier.description',
                'Configuration settings for this resource server.',
              )
        }
      >
        <FormControl fullWidth>
          <FormLabel htmlFor="resource-server-identifier">
            {t('resourceServers:edit.advanced.identifier.label', 'Identifier (Audience)')}
          </FormLabel>
          <TextField
            id="resource-server-identifier"
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            fullWidth
            size="small"
            placeholder={
              resourceServer.type === 'MCP'
                ? t('resourceServers:edit.advanced.identifier.placeholderMcp', 'https://mcp.example.com')
                : t('resourceServers:edit.advanced.identifier.placeholder', 'https://api.example.com')
            }
            helperText={
              resourceServer.type === 'MCP'
                ? t(
                    'resourceServers:edit.advanced.identifier.hintMcp',
                    'A unique value that identifies this MCP server. When set as an URI, enables RFC 8707 resource indicator support in OAuth2 authorization requests.',
                  )
                : t(
                    'resourceServers:edit.advanced.identifier.hint',
                    'A unique value that identifies this resource server. When set as an URI, enables RFC 8707 resource indicator support in OAuth2 authorization requests.',
                  )
            }
            disabled={resourceServer.isReadOnly}
          />
        </FormControl>
      </SettingsCard>
    </Stack>
  );
}
