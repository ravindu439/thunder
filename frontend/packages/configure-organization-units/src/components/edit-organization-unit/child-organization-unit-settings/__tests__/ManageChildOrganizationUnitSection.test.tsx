// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, fireEvent, waitFor, renderWithProviders, renderHook} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, it, expect, vi, beforeEach, beforeAll} from 'vitest';
import type {OrganizationUnit} from '../../../../models/organization-unit';
import ManageChildOrganizationUnitSection from '../ManageChildOrganizationUnitSection';

// Mock the useGetChildOrganizationUnits hook
const mockUseGetChildOrganizationUnits = vi.fn();
vi.mock('@/api/useGetChildOrganizationUnits', () => ({
  default: (id: string): unknown => mockUseGetChildOrganizationUnits(id),
}));

// Mock useDataGridLocaleText hook
vi.mock('@thunderid/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {...(actual as object), useDataGridLocaleText: () => ({})};
});

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock logger
vi.mock('@thunderid/logger/react', () => ({
  useLogger: () => ({
    error: vi.fn(),
  }),
}));

describe('ManageChildOrganizationUnitSection', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });
  const mockChildOUs: OrganizationUnit[] = [
    {
      id: 'ou-child-1',
      handle: 'frontend',
      name: 'Frontend Team',
      description: 'Frontend development team',
      parent: 'ou-parent',
    },
    {
      id: 'ou-child-2',
      handle: 'backend',
      name: 'Backend Team',
      description: 'Backend development team',
      parent: 'ou-parent',
    },
    {
      id: 'ou-child-3',
      handle: 'devops',
      name: 'DevOps Team',
      description: null,
      parent: 'ou-parent',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockResolvedValue(undefined);
  });

  it('should render the manage child OUs section', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText(t('organizationUnits:edit.childOUs.sections.manage.title'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.childOUs.sections.manage.description'))).toBeInTheDocument();
  });

  it('should render data grid with child OUs', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Frontend Team')).toBeInTheDocument();
    expect(screen.getByText('Backend Team')).toBeInTheDocument();
    expect(screen.getByText('DevOps Team')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText(t('organizationUnits:listing.columns.name'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:listing.columns.handle'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:listing.columns.description'))).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
    // DataGrid shows loading overlay when isLoading is true
  });

  it('should handle empty child OUs list', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: []},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Grid should show "No rows" message
  });

  it('should handle null child OUs data', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render an inline read error state instead of the grid when the query fails', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText('Failed to load child organization units')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('should refetch when the retry action is clicked', () => {
    const mockRefetch = vi.fn();
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      refetch: mockRefetch,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    fireEvent.click(screen.getByText('Refresh'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should call useGetChildOrganizationUnits with correct ID', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-456" organizationUnitName="Engineering" />,
    );

    expect(mockUseGetChildOrganizationUnits).toHaveBeenCalledWith('ou-456');
  });

  it('should render handles correctly', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('devops')).toBeInTheDocument();
  });

  it('should render descriptions correctly', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText('Frontend development team')).toBeInTheDocument();
    expect(screen.getByText('Backend development team')).toBeInTheDocument();
  });

  it('should show "-" for null description', () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    // The third OU has null description, should show "-"
    const cells = screen.getAllByText('-');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should navigate to child OU when row is clicked', async () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    // Get the grid cell with the text "Frontend Team"
    const cell = screen.getByText('Frontend Team');
    fireEvent.click(cell);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/organization-units/ou-child-1',
        expect.objectContaining({
          state: {
            fromOU: {
              id: 'ou-parent',
              name: 'Engineering',
            },
          },
        }),
      );
    });
  });

  it('should include navigation state when navigating to child OU', async () => {
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Product Team" />,
    );

    const cell = screen.getByText('Backend Team');
    fireEvent.click(cell);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/organization-units/ou-child-2',
        expect.objectContaining({
          state: {
            fromOU: {
              id: 'ou-parent',
              name: 'Product Team',
            },
          },
        }),
      );
    });
  });

  it('should handle navigation errors gracefully', async () => {
    mockNavigate.mockRejectedValue(new Error('Navigation failed'));
    mockUseGetChildOrganizationUnits.mockReturnValue({
      data: {organizationUnits: mockChildOUs},
      isLoading: false,
    });

    renderWithProviders(
      <ManageChildOrganizationUnitSection organizationUnitId="ou-parent" organizationUnitName="Engineering" />,
    );

    const cell = screen.getByText('Frontend Team');
    fireEvent.click(cell);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    // Should not throw error - error is logged
  });
});
