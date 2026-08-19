// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ActionKind} from '../models/resource-server';

/**
 * Returns the translated label for the given action kind. Pass `undefined` to get the Namespace label.
 *
 * @param kind - The action kind ('tool', 'resource', or undefined for namespace).
 * @param t - The i18next translation function.
 * @returns The translated label string.
 */
export function getActionKindLabel(kind: ActionKind | undefined, t: (key: string, fallback: string) => string): string {
  if (kind === 'tool') return t('resourceServers:mcp.types.tool', 'Tool');
  if (kind === 'resource') return t('resourceServers:mcp.types.resource', 'Resource');
  return t('resourceServers:mcp.types.namespace', 'Namespace');
}
