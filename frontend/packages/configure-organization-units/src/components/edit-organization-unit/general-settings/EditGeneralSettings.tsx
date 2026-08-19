// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Stack} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useState, useCallback, useRef, useEffect} from 'react';
import ParentSettingsSection from './ParentSettingsSection';
import QuickCopySection from './QuickCopySection';
import type {OrganizationUnit} from '../../../models/organization-unit';

/**
 * Props for the {@link EditGeneralSettings} component.
 */
interface EditGeneralSettingsProps {
  /**
   * The organization unit being displayed
   */
  organizationUnit: OrganizationUnit;
}

/**
 * Container component for general organization unit settings.
 *
 * Displays sections for:
 * - Quick copy of organization unit identifiers (Handle, ID)
 * - Parent Organization Unit information
 *
 * @param props - Component props
 * @returns General settings sections wrapped in a Stack
 */
export default function EditGeneralSettings({organizationUnit}: EditGeneralSettingsProps): JSX.Element {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    },
    [],
  );

  const handleCopyToClipboard = useCallback(async (text: string, fieldName: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }, []);

  return (
    <Stack spacing={3}>
      <QuickCopySection
        organizationUnit={organizationUnit}
        copiedField={copiedField}
        onCopyToClipboard={handleCopyToClipboard}
      />
      <ParentSettingsSection organizationUnit={organizationUnit} />
    </Stack>
  );
}
