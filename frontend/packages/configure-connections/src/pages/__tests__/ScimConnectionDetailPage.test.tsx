// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@thunderid/test-utils';
import {useNavigate, useParams, type NavigateFunction, type Params} from 'react-router';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import useScimConnection from '../../api/useScimConnection';
import type {ScimConnection} from '../../models/scim-connection';
import ScimConnectionDetailPage from '../ScimConnectionDetailPage';

const SCIM_CONNECTION: ScimConnection = {
  id: 'scim-conn-1',
  name: 'Okta Provisioning',
  coreUserType: 'Employee',
  coreUserTypeId: 'type-1',
  targetOuId: 'ou-1',
  attributeMappings: [{scimField: 'userName', localAttribute: 'username'}],
  baseUrl: 'https://demo.thunderid.local/scim/v2',
  clientId: 'client-1',
  clientSecret: 'secret-1',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const {mockUpdateMutate} = vi.hoisted(() => ({mockUpdateMutate: vi.fn()}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('../../api/useScimConnection', () => ({
  default: vi.fn(),
}));

vi.mock('../../api/useUpdateScimConnection', () => ({
  default: () => ({mutate: mockUpdateMutate, isPending: false, isError: false, reset: vi.fn()}),
}));

vi.mock('@thunderid/configure-user-types', () => ({
  useGetUserType: () => ({data: {ouId: 'ou-root', schema: {}}, isLoading: false}),
}));

vi.mock('@thunderid/configure-organization-units', () => ({
  OrganizationUnitTreePicker: ({value, onChange}: {value: string; onChange: (id: string) => void}) => (
    <button type="button" data-testid="ou-picker-stub" onClick={() => onChange('ou-2')}>
      {value || 'pick OU'}
    </button>
  ),
}));

describe('ScimConnectionDetailPage', () => {
  beforeEach(() => {
    mockUpdateMutate.mockReset();
    vi.mocked(useNavigate).mockReturnValue(vi.fn() as unknown as NavigateFunction);
    vi.mocked(useParams).mockReturnValue({id: 'scim-conn-1'} as unknown as Params);
  });

  it('renders the connection name and credentials', () => {
    vi.mocked(useScimConnection).mockReturnValue({
      data: SCIM_CONNECTION,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useScimConnection>);

    render(<ScimConnectionDetailPage />);

    expect(screen.getByDisplayValue('Okta Provisioning')).toBeInTheDocument();
    expect(screen.getByDisplayValue(SCIM_CONNECTION.clientId)).toBeInTheDocument();
    expect(screen.getByDisplayValue(SCIM_CONNECTION.baseUrl)).toBeInTheDocument();
  });

  it('shows an error state when the connection fails to load', () => {
    vi.mocked(useScimConnection).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('SCIM connection scim-conn-1 not found'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useScimConnection>);

    render(<ScimConnectionDetailPage />);

    expect(screen.getByText('Failed to load SCIM connection')).toBeInTheDocument();
  });

  it('shows the unsaved changes bar after editing the name, and saves via the update mutation', async () => {
    vi.mocked(useScimConnection).mockReturnValue({
      data: SCIM_CONNECTION,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useScimConnection>);

    render(<ScimConnectionDetailPage />);

    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Okta Provisioning'), {target: {value: 'Renamed Provisioning'}});
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() =>
      expect(mockUpdateMutate).toHaveBeenCalledWith(
        expect.objectContaining({name: 'Renamed Provisioning', targetOuId: 'ou-1'}),
        expect.anything(),
      ),
    );
  });

  it('marks the form dirty when the target OU changes', () => {
    vi.mocked(useScimConnection).mockReturnValue({
      data: SCIM_CONNECTION,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useScimConnection>);

    render(<ScimConnectionDetailPage />);

    fireEvent.click(screen.getByTestId('ou-picker-stub'));
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
  });
});
