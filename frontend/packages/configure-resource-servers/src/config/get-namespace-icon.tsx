// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Folder, FolderOpen} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';

/**
 * Returns the namespace icon, toggling between open and closed states.
 *
 * @param expanded - Whether the namespace is expanded.
 * @param size - Icon size in pixels (default 16).
 * @returns The icon JSX element.
 */
export function getNamespaceIcon(expanded: boolean, size = 16): JSX.Element {
  return expanded ? <FolderOpen size={size} /> : <Folder size={size} />;
}
