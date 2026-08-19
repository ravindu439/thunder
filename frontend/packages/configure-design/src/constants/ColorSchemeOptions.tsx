// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ColorSchemeOption} from '@thunderid/design';
import {Monitor, Moon, Sun} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';

export interface ColorSchemeOptionItem {
  id: ColorSchemeOption;
  label: string;
  icon: JSX.Element;
}

/**
 * Display options for color scheme selection (includes icons for UI rendering).
 */
const ColorSchemeOptions: ColorSchemeOptionItem[] = [
  {id: 'light', label: 'Light', icon: <Sun size={14} />},
  {id: 'dark', label: 'Dark', icon: <Moon size={14} />},
  {id: 'system', label: 'System', icon: <Monitor size={14} />},
];

export default ColorSchemeOptions;
