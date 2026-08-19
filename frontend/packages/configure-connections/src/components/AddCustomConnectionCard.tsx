// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Card, CardActionArea, Stack, Typography} from '@wso2/oxygen-ui';
import {Plus} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';

interface AddCustomConnectionCardProps {
  onClick: () => void;
}

/**
 * Dashed "ghost" card appended to the end of the connections grid — starts the add-custom
 * connection wizard for vendors not in the catalog.
 */
export default function AddCustomConnectionCard({onClick}: AddCustomConnectionCardProps): JSX.Element {
  const {t} = useTranslation('connections');

  return (
    <Card
      variant="outlined"
      sx={{height: '100%', borderStyle: 'dashed', bgcolor: 'transparent'}}
      data-testid="connection-add-custom-card"
    >
      <CardActionArea
        onClick={onClick}
        sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3}}
      >
        <Stack direction="column" spacing={1.5} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <Plus size={20} />
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {t('card.addCustom.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{maxWidth: 260}}>
            {t('card.addCustom.description')}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
