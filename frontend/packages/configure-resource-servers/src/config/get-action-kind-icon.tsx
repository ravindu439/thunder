// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Database, Folder, Wrench} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import type {ActionKind} from '../models/resource-server';

/**
 * Returns the icon element for the given action kind. Pass `undefined` to get the Namespace (Folder) icon.
 *
 * @param kind - The action kind ('tool', 'resource', or undefined for namespace).
 * @param size - Icon size in pixels (default 16).
 * @returns The icon JSX element.
 */
export function getActionKindIcon(kind: ActionKind | undefined, size = 16): JSX.Element {
  if (kind === 'tool') return <Wrench size={size} />;
  if (kind === 'resource') return <Database size={size} />;
  return <Folder size={size} />;
}
