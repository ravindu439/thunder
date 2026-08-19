// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Typography} from '@wso2/oxygen-ui';
import type {JSX, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import ResourceAvatar from '../lab/components/ResourceAvatar';

export interface OrganizationUnitSummaryChipProps {
  /**
   * The organization unit's logo (emoji, avatar spec, or image URL). When unset, `icon` is shown
   * instead.
   */
  logoUrl?: string;

  /**
   * Icon rendered in the small square badge at the start of the chip, used as the fallback when
   * `logoUrl` is unset or fails to load.
   */
  icon: ReactNode;

  /**
   * Overline label above the value, e.g. "Organization Unit".
   */
  label: string;

  /**
   * The resolved organization unit name (or a loading placeholder, computed by the caller).
   */
  value: ReactNode;

  /**
   * Invoked when the "Change" link is clicked. Omit to render the chip as read-only, e.g. when
   * there is no picker step to return to.
   */
  onChange?: () => void;

  /**
   * Overrides the trailing link's default "Change" text.
   */
  changeLabel?: string;
}

/**
 * Read-only summary of an already-picked organization unit, shown at the top of a wizard's
 * details step with a link back to the dedicated organization unit picker step.
 */
export default function OrganizationUnitSummaryChip({
  logoUrl = undefined,
  icon,
  label,
  value,
  onChange = undefined,
  changeLabel = undefined,
}: OrganizationUnitSummaryChipProps): JSX.Element {
  const {t} = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: '12px 14px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px',
        bgcolor: 'background.paper',
      }}
    >
      <ResourceAvatar
        variant="rounded"
        value={logoUrl}
        size={32}
        fallback={icon}
        sx={{borderRadius: '8px', bgcolor: 'primary.main', flexShrink: 0}}
      />
      <Box sx={{flex: 1, minWidth: 0}}>
        <Typography variant="overline" color="text.secondary" sx={{display: 'block', lineHeight: 1.2, fontWeight: 600}}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{fontWeight: 600}}>
          {value}
        </Typography>
      </Box>
      {onChange && (
        <Typography
          component="span"
          variant="body2"
          onClick={onChange}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onChange();
            }
          }}
          sx={{fontWeight: 500, color: 'primary.main', cursor: 'pointer', flexShrink: 0}}
        >
          {changeLabel ?? t('actions.change', 'Change')}
        </Typography>
      )}
    </Box>
  );
}
