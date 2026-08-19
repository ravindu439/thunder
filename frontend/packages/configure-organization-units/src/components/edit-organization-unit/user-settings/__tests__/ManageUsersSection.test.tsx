// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {screen, renderWithProviders, renderHook} from '@thunderid/test-utils';
import type {User} from '@thunderid/types';
import {useTranslation} from 'react-i18next';
import {describe, it, expect, vi, beforeEach, beforeAll} from 'vitest';
import ManageUsersSection from '../ManageUsersSection';

// Mock the useGetOrganizationUnitUsers hook
const mockUseGetOrganizationUnitUsers = vi.fn();
vi.mock('@/api/useGetOrganizationUnitUsers', () => ({
  default: (id: string): unknown => mockUseGetOrganizationUnitUsers(id),
}));

// Mock useDataGridLocaleText hook
vi.mock('@thunderid/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {...(actual as object), useDataGridLocaleText: () => ({})};
});

describe('ManageUsersSection', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });
  const mockUsers: User[] = [
    {id: 'user-1', type: 'internal', ouId: 'ou-123', display: 'John Doe'},
    {id: 'user-2', type: 'external', ouId: 'ou-123', display: 'Jane Smith'},
    {id: 'user-3', type: 'internal', ouId: 'ou-123'},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the manage users section', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByText(t('organizationUnits:edit.users.sections.manage.title'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.users.sections.manage.description'))).toBeInTheDocument();
  });

  it('should render data grid with users showing display names', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    // user-3 has no display, should fall back to id
    expect(screen.getAllByText('user-3').length).toBeGreaterThanOrEqual(1);
  });

  it('should show initials in avatar', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('JS')).toBeInTheDocument();
    // user-3 falls back to id 'user-3', initials would be 'US'
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(
      screen.getByText(t('organizationUnits:edit.users.sections.manage.listing.columns.name')),
    ).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.users.sections.manage.listing.columns.id'))).toBeInTheDocument();
    expect(
      screen.getByText(t('organizationUnits:edit.users.sections.manage.listing.columns.type')),
    ).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('should handle empty users list', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: []},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should handle null users data', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render an inline read error state instead of the grid when the query fails', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('should refetch when the retry action is clicked', async () => {
    const mockRefetch = vi.fn();
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      refetch: mockRefetch,
    });

    const user = userEvent.setup();
    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    await user.click(screen.getByText('Refresh'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should call useGetOrganizationUnitUsers with correct ID', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-456" />);

    expect(mockUseGetOrganizationUnitUsers).toHaveBeenCalledWith('ou-456');
  });

  it('should render user type correctly', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    const internalCells = screen.getAllByText('internal');
    const externalCells = screen.getAllByText('external');

    expect(internalCells.length).toBeGreaterThan(0);
    expect(externalCells.length).toBeGreaterThan(0);
  });

  it('should show user IDs in the grid', () => {
    mockUseGetOrganizationUnitUsers.mockReturnValue({
      data: {users: mockUsers},
      isLoading: false,
    });

    renderWithProviders(<ManageUsersSection organizationUnitId="ou-123" />);

    expect(screen.getByText('user-1')).toBeInTheDocument();
    expect(screen.getByText('user-2')).toBeInTheDocument();
  });
});
