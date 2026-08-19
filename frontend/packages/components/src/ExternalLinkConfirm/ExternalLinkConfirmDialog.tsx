// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useConfig} from '@thunderid/contexts';
import {useLogger} from '@thunderid/logger/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@wso2/oxygen-ui';
import {AlertTriangle, Check, Copy, X} from '@wso2/oxygen-ui-icons-react';
import {useEffect, useRef, useState, type JSX} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for {@link ExternalLinkConfirmDialog}, mirroring the state returned by
 * `useExternalLinkConfirmation`.
 *
 * @public
 */
export interface ExternalLinkConfirmDialogProps {
  isOpen: boolean;
  pendingUrl: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Read-only URL field with a copy-to-clipboard button, shown so the user can verify the
 * destination before continuing.
 */
function CopyableUrlField({url}: {url: string}): JSX.Element {
  const {t} = useTranslation();
  const logger = useLogger('ExternalLinkConfirmDialog');
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch((error: unknown) => {
        logger.error('Failed to copy link to clipboard', error instanceof Error ? error : {error});
      });
  };

  return (
    <TextField
      fullWidth
      size="small"
      value={url}
      slotProps={{
        input: {
          readOnly: true,
          sx: {fontFamily: 'monospace', fontSize: '0.75rem'},
          endAdornment: (
            <IconButton
              onClick={handleCopy}
              edge="end"
              size="small"
              aria-label={copied ? t('common:actions.copied') : t('common:actions.copy')}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </IconButton>
          ),
        },
      }}
    />
  );
}

/**
 * Confirmation dialog shown before navigating to an external site, warning the user they are
 * leaving the product. Pair with `useExternalLinkConfirmation` for the open/pending-url state.
 *
 * @public
 */
export default function ExternalLinkConfirmDialog({
  isOpen,
  pendingUrl,
  onConfirm,
  onCancel,
}: ExternalLinkConfirmDialogProps): JSX.Element {
  const {t} = useTranslation();
  const {config} = useConfig();
  const theme = useTheme();
  const productName = config.brand.product_name;
  const hostname = pendingUrl ? getHostname(pendingUrl) : '';

  return (
    <Dialog open={isOpen} onClose={onCancel} maxWidth="xs" fullWidth>
      <IconButton
        onClick={onCancel}
        size="small"
        aria-label={t('common:actions.close')}
        sx={{position: 'absolute', top: 12, right: 12, color: 'text.secondary'}}
      >
        <X size={18} />
      </IconButton>
      <DialogContent sx={{pt: 5, pb: 1}}>
        <Stack direction="column" spacing={2} alignItems="center" sx={{textAlign: 'center'}}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'warning.50',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={50} color={theme.palette.warning.main} />
          </Box>
          <Typography variant="h6" component="h2">
            {t('common:externalLink.title', {productName})}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'common:externalLink.message',
              'This link leads to an external site. Please verify the destination before proceeding:',
            )}{' '}
            <Box component="span" sx={{fontWeight: 700, color: 'text.primary'}}>
              {hostname}
            </Box>
          </Typography>
          {pendingUrl && <CopyableUrlField url={pendingUrl} />}
        </Stack>
      </DialogContent>
      <DialogActions sx={{px: 3, pb: 3, pt: 2}}>
        <Stack direction="column" spacing={1.5} sx={{width: '100%'}}>
          <Button variant="contained" fullWidth onClick={onConfirm}>
            {t('common:actions.continue')}
          </Button>
          <Button variant="outlined" fullWidth onClick={onCancel}>
            {t('common:actions.stay')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
