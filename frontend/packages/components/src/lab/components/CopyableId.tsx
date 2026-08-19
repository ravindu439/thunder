// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useLogger} from '@thunderid/logger/react';
import {Stack, Typography, Tooltip} from '@wso2/oxygen-ui';
import {Copy, Check} from '@wso2/oxygen-ui-icons-react';
import {useState, useCallback, useRef, useEffect, type JSX} from 'react';
import {useTranslation} from 'react-i18next';

interface CopyableIdProps {
  /** The ID value to display and copy */
  value: string;
  /** Tooltip text shown before copying. Falls back to a generic "Copy ID" label. */
  copyLabel?: string;
}

/**
 * Displays a monospace ID with click-to-copy functionality.
 * Shows a check icon for 2 seconds after copying.
 */
export default function CopyableId({value, copyLabel = undefined}: CopyableIdProps): JSX.Element {
  const {t} = useTranslation();
  const logger = useLogger('CopyableId');
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

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [value]);

  const handleClick = () => {
    handleCopy().catch((error: unknown) => {
      logger.error('Failed to copy to clipboard', error instanceof Error ? error : {error});
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy().catch((error: unknown) => {
        logger.error('Failed to copy to clipboard', error instanceof Error ? error : {error});
      });
    }
  };

  return (
    <Tooltip
      title={copied ? t('common:actions.copied') : (copyLabel ?? t('common:actions.copyId', 'Copy ID'))}
      placement="right"
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        role="button"
        tabIndex={0}
        aria-label={copyLabel ?? t('common:actions.copyId', 'Copy ID')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={{
          cursor: 'pointer',
          width: 'fit-content',
          mt: 0.5,
          '&:hover .copy-icon': {opacity: 1},
          '&:focus-visible .copy-icon': {opacity: 1},
        }}
      >
        <Typography variant="caption" sx={{fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.75rem'}}>
          {value}
        </Typography>
        {copied ? <Check size={12} /> : <Copy size={12} className="copy-icon" style={{opacity: 0.4}} />}
      </Stack>
    </Tooltip>
  );
}
