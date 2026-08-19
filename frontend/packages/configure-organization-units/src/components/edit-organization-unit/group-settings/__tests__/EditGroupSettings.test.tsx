// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, renderWithProviders} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import EditGroupSettings from '../EditGroupSettings';

// Mock child component
vi.mock('@/components/edit-organization-unit/group-settings/ManageGroupsSection', () => ({
  default: ({organizationUnitId}: {organizationUnitId: string}) => (
    <div data-testid="manage-groups-section">ManageGroupsSection - {organizationUnitId}</div>
  ),
}));

describe('EditGroupSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ManageGroupsSection', () => {
    renderWithProviders(<EditGroupSettings organizationUnitId="ou-123" />);

    expect(screen.getByTestId('manage-groups-section')).toBeInTheDocument();
  });

  it('should pass organizationUnitId to ManageGroupsSection', () => {
    renderWithProviders(<EditGroupSettings organizationUnitId="ou-456" />);

    expect(screen.getByText('ManageGroupsSection - ou-456')).toBeInTheDocument();
  });

  it('should handle different organization unit IDs', () => {
    const {rerender} = renderWithProviders(<EditGroupSettings organizationUnitId="ou-123" />);

    expect(screen.getByText('ManageGroupsSection - ou-123')).toBeInTheDocument();

    rerender(<EditGroupSettings organizationUnitId="ou-789" />);

    expect(screen.getByText('ManageGroupsSection - ou-789')).toBeInTheDocument();
  });
});
