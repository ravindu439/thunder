// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import ScimConnectionDeleteDialog from '../ScimConnectionDeleteDialog';
import * as store from '../../../api/mock/scimConnectionsStore';

function renderDialog(connectionId: string, onSuccess = vi.fn(), onClose = vi.fn()): ReturnType<typeof render> {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ScimConnectionDeleteDialog
        open
        connectionId={connectionId}
        connectionName="Okta Provisioning"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </QueryClientProvider>,
  );
}

describe('ScimConnectionDeleteDialog', () => {
  beforeEach(() => {
    store.__resetScimConnectionsStoreForTests();
  });

  it('deletes the connection from the mock store and calls onSuccess', async () => {
    const created = store.createScimConnection({
      name: 'Okta Provisioning',
      coreUserType: 'Employee',
      coreUserTypeId: 'type-1',
      targetOuId: 'ou-1',
      attributeMappings: [],
    });
    const onSuccess = vi.fn();
    renderDialog(created.id, onSuccess);

    screen.getByTestId('scim-connection-delete-confirm').click();

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(store.getScimConnection(created.id)).toBeUndefined();
  });
});
