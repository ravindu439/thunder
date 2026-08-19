// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {screen, renderWithProviders, renderHook} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, it, expect, vi, beforeEach, beforeAll} from 'vitest';
import type {Group} from '../../../../models/group';
import ManageGroupsSection from '../ManageGroupsSection';

// Mock the useGetOrganizationUnitGroups hook
const mockUseGetOrganizationUnitGroups = vi.fn();
vi.mock('@/api/useGetOrganizationUnitGroups', () => ({
  default: (id: string): unknown => mockUseGetOrganizationUnitGroups(id),
}));

// Mock useDataGridLocaleText hook
vi.mock('@thunderid/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {...(actual as object), useDataGridLocaleText: () => ({})};
});

describe('ManageGroupsSection', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });
  const mockGroups: Group[] = [
    {id: 'group-1', name: 'Developers', ouId: 'ou-123'},
    {id: 'group-2', name: 'Designers', ouId: 'ou-123'},
    {id: 'group-3', name: 'Product Managers', ouId: 'ou-123'},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the manage groups section', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: mockGroups},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getByText(t('organizationUnits:edit.groups.sections.manage.title'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.groups.sections.manage.description'))).toBeInTheDocument();
  });

  it('should render data grid with groups', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: mockGroups},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Developers')).toBeInTheDocument();
    expect(screen.getByText('Designers')).toBeInTheDocument();
    expect(screen.getByText('Product Managers')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: mockGroups},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(
      screen.getByText(t('organizationUnits:edit.groups.sections.manage.listing.columns.name')),
    ).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.groups.sections.manage.listing.columns.id'))).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
    // DataGrid shows loading overlay when isLoading is true
  });

  it('should handle empty groups list', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: []},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Grid should show "No rows" message
  });

  it('should handle null groups data', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render an inline read error state instead of the grid when the query fails', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getByText('Failed to load groups')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('should refetch when the retry action is clicked', async () => {
    const mockRefetch = vi.fn();
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      refetch: mockRefetch,
    });

    const user = userEvent.setup();
    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    await user.click(screen.getByText('Refresh'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should call useGetOrganizationUnitGroups with correct ID', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: mockGroups},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-456" />);

    expect(mockUseGetOrganizationUnitGroups).toHaveBeenCalledWith('ou-456');
  });

  it('should render group IDs correctly', () => {
    mockUseGetOrganizationUnitGroups.mockReturnValue({
      data: {groups: mockGroups},
      isLoading: false,
    });

    renderWithProviders(<ManageGroupsSection organizationUnitId="ou-123" />);

    expect(screen.getAllByText('group-1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('group-2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('group-3').length).toBeGreaterThan(0);
  });
});
