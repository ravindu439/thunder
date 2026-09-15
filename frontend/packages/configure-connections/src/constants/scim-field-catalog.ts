// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * One row of the fixed SCIM field catalog shown in the attribute-mapping table's left column.
 * `defaultLocalAttribute` mirrors the backend's hardcoded candidate name
 * (`backend/internal/scim/common/attr_rules.go`'s `CoreAttrRules`/`EnterpriseAttrRules`), used
 * to pre-fill the right column when the selected user type has a matching attribute.
 */
export interface ScimFieldCatalogEntry {
  field: string;
  labelKey: string;
  labelDefault: string;
  group: 'core' | 'enterprise';
  defaultLocalAttribute: string;
}

/**
 * Fixed SCIM field catalog (RFC 7643 core User schema + enterprise extension), mirroring
 * `attr_rules.go`'s `CoreAttrRules`/`EnterpriseAttrRules` one-to-one. Static and ordered for
 * display — not fetched from the backend in this phase.
 */
export const SCIM_FIELD_CATALOG: ScimFieldCatalogEntry[] = [
  {field: 'userName', labelKey: 'scim.field.userName', labelDefault: 'userName', group: 'core', defaultLocalAttribute: 'username'},
  {field: 'emails', labelKey: 'scim.field.emails', labelDefault: 'emails', group: 'core', defaultLocalAttribute: 'email'},
  {field: 'name.givenName', labelKey: 'scim.field.givenName', labelDefault: 'name.givenName', group: 'core', defaultLocalAttribute: 'given_name'},
  {field: 'name.familyName', labelKey: 'scim.field.familyName', labelDefault: 'name.familyName', group: 'core', defaultLocalAttribute: 'family_name'},
  {field: 'name.formatted', labelKey: 'scim.field.formatted', labelDefault: 'name.formatted', group: 'core', defaultLocalAttribute: 'name'},
  {field: 'name.middleName', labelKey: 'scim.field.middleName', labelDefault: 'name.middleName', group: 'core', defaultLocalAttribute: 'middle_name'},
  {field: 'phoneNumbers', labelKey: 'scim.field.phoneNumbers', labelDefault: 'phoneNumbers', group: 'core', defaultLocalAttribute: 'phone_number'},
  {field: 'displayName', labelKey: 'scim.field.displayName', labelDefault: 'displayName', group: 'core', defaultLocalAttribute: 'display_name'},
  {field: 'nickName', labelKey: 'scim.field.nickName', labelDefault: 'nickName', group: 'core', defaultLocalAttribute: 'nickname'},
  {field: 'photos', labelKey: 'scim.field.photos', labelDefault: 'photos', group: 'core', defaultLocalAttribute: 'picture'},
  {field: 'locale', labelKey: 'scim.field.locale', labelDefault: 'locale', group: 'core', defaultLocalAttribute: 'locale'},
  {field: 'preferredLanguage', labelKey: 'scim.field.preferredLanguage', labelDefault: 'preferredLanguage', group: 'core', defaultLocalAttribute: 'preferred_language'},
  {field: 'timezone', labelKey: 'scim.field.timezone', labelDefault: 'timezone', group: 'core', defaultLocalAttribute: 'zoneinfo'},
  {field: 'profileUrl', labelKey: 'scim.field.profileUrl', labelDefault: 'profileUrl', group: 'core', defaultLocalAttribute: 'profile'},
  {field: 'title', labelKey: 'scim.field.title', labelDefault: 'title', group: 'core', defaultLocalAttribute: 'title'},
  {field: 'addresses', labelKey: 'scim.field.addresses', labelDefault: 'addresses', group: 'core', defaultLocalAttribute: 'address'},
  {field: 'employeeNumber', labelKey: 'scim.field.employeeNumber', labelDefault: 'employeeNumber', group: 'enterprise', defaultLocalAttribute: 'employee_number'},
  {field: 'costCenter', labelKey: 'scim.field.costCenter', labelDefault: 'costCenter', group: 'enterprise', defaultLocalAttribute: 'cost_center'},
  {field: 'organization', labelKey: 'scim.field.organization', labelDefault: 'organization', group: 'enterprise', defaultLocalAttribute: 'organization'},
  {field: 'division', labelKey: 'scim.field.division', labelDefault: 'division', group: 'enterprise', defaultLocalAttribute: 'division'},
  {field: 'department', labelKey: 'scim.field.department', labelDefault: 'department', group: 'enterprise', defaultLocalAttribute: 'department'},
  {field: 'manager', labelKey: 'scim.field.manager', labelDefault: 'manager', group: 'enterprise', defaultLocalAttribute: 'manager'},
];
