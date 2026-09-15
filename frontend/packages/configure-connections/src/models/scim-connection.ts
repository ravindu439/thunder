// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * A single SCIM-field -> local-attribute row in a SCIM connection's attribute mapping.
 * `scimField` is a fixed catalog value (see `SCIM_FIELD_CATALOG`), not free text.
 */
export interface ScimAttributeMapping {
  scimField: string;
  localAttribute: string;
}

/**
 * Fields collected to create a SCIM inbound connection. `coreUserType` is the user type's
 * display name (shown in the UI); `coreUserTypeId` is its id, carried alongside so the mock
 * store and detail page don't need a second user-type lookup.
 */
export interface ScimConnectionInput {
  name: string;
  description?: string;
  coreUserType: string;
  coreUserTypeId: string;
  targetOuId: string;
  attributeMappings: ScimAttributeMapping[];
}

/**
 * A created SCIM inbound connection, including its mocked credentials. Nothing here is
 * persisted by a real backend yet — see `api/mock/scimConnectionsStore.ts`.
 */
export interface ScimConnection extends ScimConnectionInput {
  id: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
}
