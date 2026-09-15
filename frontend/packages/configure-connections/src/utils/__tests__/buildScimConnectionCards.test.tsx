// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import buildScimConnectionCards from '../buildScimConnectionCards';
import {defaultConnectionRoutePaths} from '../../hooks/useConnectionRoutes';
import type {ScimConnection} from '../../models/scim-connection';

const connection: ScimConnection = {
  id: 'conn-1',
  name: 'Okta Provisioning',
  coreUserType: 'Employee',
  coreUserTypeId: 'type-employee-id',
  targetOuId: 'ou-1',
  attributeMappings: [],
  baseUrl: 'https://demo.thunderid.local/scim/v2',
  clientId: 'client-1',
  clientSecret: 'secret-1',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('buildScimConnectionCards', () => {
  it('returns an empty list for no connections', () => {
    expect(buildScimConnectionCards([], defaultConnectionRoutePaths)).toEqual([]);
  });

  it('builds one configured card per connection', () => {
    const cards = buildScimConnectionCards([connection], defaultConnectionRoutePaths);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      id: 'scim-inbound:conn-1',
      vendorKey: 'scim-inbound',
      displayName: 'Okta Provisioning',
      categories: ['enterprise'],
      status: 'configured',
      comingSoon: false,
      navTarget: '/scim-connections/conn-1',
    });
    // logo must be a renderable element, not asserted by shape
    render(cards[0].logo);
  });
});
