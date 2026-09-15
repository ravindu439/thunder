// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitFor} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import ScimConnectionCreateForm from '../ScimConnectionCreateForm';

vi.mock('@thunderid/configure-user-types', () => ({
  useGetUserTypes: () => ({
    data: {types: [{id: 'type-1', name: 'Employee', ouId: 'ou-root'}]},
    isLoading: false,
  }),
  useGetUserType: () => ({data: {schema: {username: {type: 'string'}}}, isLoading: false}),
}));

vi.mock('@thunderid/configure-organization-units', () => ({
  OrganizationUnitTreePicker: ({value, onChange}: {value: string; onChange: (id: string) => void}) => (
    <button type="button" data-testid="ou-picker-stub" onClick={() => onChange('ou-child')}>
      {value || 'pick OU'}
    </button>
  ),
}));

function renderForm(): ReturnType<typeof render> {
  return render(<ScimConnectionCreateForm name="Okta Provisioning" onNameConflict={vi.fn()} onBack={vi.fn()} />);
}

describe('ScimConnectionCreateForm', () => {
  it('disables create until a core user type and target OU are chosen', () => {
    renderForm();
    expect(screen.getByTestId('scim-connection-create-submit')).toBeDisabled();
  });

  it('enables create once type and OU are chosen', async () => {
    renderForm();
    screen.getByTestId('scim-core-user-type-select');
    // Single user type auto-selects; picking the OU stub is enough to enable create.
    screen.getByTestId('ou-picker-stub').click();
    await waitFor(() => expect(screen.getByTestId('scim-connection-create-submit')).not.toBeDisabled());
  });
});
