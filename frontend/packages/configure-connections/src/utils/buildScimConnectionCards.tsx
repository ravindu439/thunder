// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ResourceAvatar} from '@thunderid/components';
import {ShieldCheck} from '@wso2/oxygen-ui-icons-react';
import type {ConnectionRoutePaths} from '../hooks/useConnectionRoutes';
import type {ConnectionCardModel} from '../models/connection';
import type {ScimConnection} from '../models/scim-connection';

const AVATAR_SIZE = 48;

/** i18n key for the SCIM inbound card's description, resolved by the rendering component. */
const SCIM_INBOUND_DESCRIPTION_KEY = 'connections:vendor.scimInbound.description';

/**
 * Builds one listing card per configured SCIM inbound connection (mocked store). Kept separate
 * from `buildConnectionCards` because SCIM connections are not part of the real
 * `GET /connections` instance list it operates on.
 */
export default function buildScimConnectionCards(
  connections: ScimConnection[],
  routes: ConnectionRoutePaths,
): ConnectionCardModel[] {
  return connections.map(
    (connection): ConnectionCardModel => ({
      id: `scim-inbound:${connection.id}`,
      vendorKey: 'scim-inbound',
      backendType: undefined,
      displayName: connection.name,
      descriptionKey: SCIM_INBOUND_DESCRIPTION_KEY,
      logo: <ResourceAvatar transparent variant="rounded" size={AVATAR_SIZE} fallback={<ShieldCheck size={28} />} />,
      categories: ['enterprise'],
      status: 'configured',
      comingSoon: false,
      navTarget: routes.scimConnections.detail(connection.id),
    }),
  );
}
