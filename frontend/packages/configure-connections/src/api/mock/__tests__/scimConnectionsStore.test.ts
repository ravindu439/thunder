// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, expect, it} from 'vitest';
import {
  __resetScimConnectionsStoreForTests,
  createScimConnection,
  deleteScimConnection,
  getScimConnection,
  listScimConnections,
  updateScimConnection,
} from '../scimConnectionsStore';

const BASE_URL = 'https://server.example.com/scim/v2';

const baseInput = {
  name: 'Okta Provisioning',
  coreUserType: 'Employee',
  coreUserTypeId: 'type-employee-id',
  targetOuId: 'ou-1',
  attributeMappings: [{scimField: 'userName', localAttribute: 'username'}],
};

describe('scimConnectionsStore', () => {
  beforeEach(() => {
    __resetScimConnectionsStoreForTests();
  });

  it('starts empty', () => {
    expect(listScimConnections()).toEqual([]);
  });

  it('creates a connection with generated id and credentials, using the given base URL', () => {
    const created = createScimConnection(baseInput, BASE_URL);
    expect(created.id).toBeTruthy();
    expect(created.clientId).toBeTruthy();
    expect(created.clientSecret).toBeTruthy();
    expect(created.baseUrl).toBe(BASE_URL);
    expect(created.name).toBe('Okta Provisioning');
  });

  it('lists created connections', () => {
    createScimConnection(baseInput, BASE_URL);
    createScimConnection({...baseInput, name: 'Entra Provisioning'}, BASE_URL);
    expect(listScimConnections()).toHaveLength(2);
  });

  it('gets a connection by id', () => {
    const created = createScimConnection(baseInput, BASE_URL);
    expect(getScimConnection(created.id)?.name).toBe('Okta Provisioning');
  });

  it('returns undefined for an unknown id', () => {
    expect(getScimConnection('nope')).toBeUndefined();
  });

  it('deletes a connection', () => {
    const created = createScimConnection(baseInput, BASE_URL);
    deleteScimConnection(created.id);
    expect(listScimConnections()).toEqual([]);
  });

  it('generates distinct ids and credentials across creates', () => {
    const first = createScimConnection(baseInput, BASE_URL);
    const second = createScimConnection(baseInput, BASE_URL);
    expect(first.id).not.toBe(second.id);
    expect(first.clientSecret).not.toBe(second.clientSecret);
  });

  it('updates a connection’s editable fields', () => {
    const created = createScimConnection(baseInput, BASE_URL);
    const updated = updateScimConnection(created.id, {
      name: 'Renamed Provisioning',
      description: 'updated',
      targetOuId: 'ou-2',
      attributeMappings: [{scimField: 'emails', localAttribute: 'email'}],
    });
    expect(updated?.name).toBe('Renamed Provisioning');
    expect(updated?.targetOuId).toBe('ou-2');
    expect(updated?.attributeMappings).toEqual([{scimField: 'emails', localAttribute: 'email'}]);
    // Credentials and core user type are untouched by an update.
    expect(updated?.clientId).toBe(created.clientId);
    expect(updated?.coreUserTypeId).toBe(created.coreUserTypeId);
    expect(getScimConnection(created.id)?.name).toBe('Renamed Provisioning');
  });

  it('returns undefined when updating an unknown id', () => {
    expect(updateScimConnection('nope', {name: 'x', targetOuId: 'ou-1', attributeMappings: []})).toBeUndefined();
  });
});
