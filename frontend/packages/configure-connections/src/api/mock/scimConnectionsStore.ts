// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ScimConnection, ScimConnectionInput} from '../../models/scim-connection';

/**
 * In-memory stand-in for a real SCIM connections backend. Module-level state: resets on page
 * reload and is not shared across browser tabs. Exists only for this phase's demo — see
 * `scim-inbound-frontend-plan.md`'s "Explicitly deferred" section for the real persistence
 * this replaces.
 */
let store: ScimConnection[] = [];
let sequence = 0;

function nextToken(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}

export function listScimConnections(): ScimConnection[] {
  return [...store];
}

export function getScimConnection(id: string): ScimConnection | undefined {
  return store.find((connection) => connection.id === id);
}

export function createScimConnection(input: ScimConnectionInput, baseUrl: string): ScimConnection {
  const created: ScimConnection = {
    ...input,
    id: nextToken('scim-conn'),
    baseUrl,
    clientId: nextToken('client'),
    clientSecret: nextToken('secret'),
    createdAt: new Date().toISOString(),
  };
  store = [...store, created];
  return created;
}

/**
 * Update a SCIM inbound connection's editable fields (name, description, target OU, attribute
 * mappings). `coreUserType`/`coreUserTypeId` are intentionally not editable here: they select the
 * schema the mapping table is built against, so changing them mid-flight would silently orphan
 * the existing mappings.
 */
export function updateScimConnection(
  id: string,
  patch: Pick<ScimConnectionInput, 'name' | 'description' | 'targetOuId' | 'attributeMappings'>,
): ScimConnection | undefined {
  let updated: ScimConnection | undefined;
  store = store.map((connection) => {
    if (connection.id !== id) {
      return connection;
    }
    updated = {...connection, ...patch};
    return updated;
  });
  return updated;
}

export function deleteScimConnection(id: string): void {
  store = store.filter((connection) => connection.id !== id);
}

/** Test-only: reset the module-level store between test cases. */
export function __resetScimConnectionsStoreForTests(): void {
  store = [];
  sequence = 0;
}
