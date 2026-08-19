// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, renderWithProviders} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import EditUserSettings from '../EditUserSettings';

// Mock child component
vi.mock('@/components/edit-organization-unit/user-settings/ManageUsersSection', () => ({
  default: ({organizationUnitId}: {organizationUnitId: string}) => (
    <div data-testid="manage-users-section">ManageUsersSection - {organizationUnitId}</div>
  ),
}));

describe('EditUserSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ManageUsersSection', () => {
    renderWithProviders(<EditUserSettings organizationUnitId="ou-123" />);

    expect(screen.getByTestId('manage-users-section')).toBeInTheDocument();
  });

  it('should pass organizationUnitId to ManageUsersSection', () => {
    renderWithProviders(<EditUserSettings organizationUnitId="ou-456" />);

    expect(screen.getByText('ManageUsersSection - ou-456')).toBeInTheDocument();
  });

  it('should handle different organization unit IDs', () => {
    const {rerender} = renderWithProviders(<EditUserSettings organizationUnitId="ou-123" />);

    expect(screen.getByText('ManageUsersSection - ou-123')).toBeInTheDocument();

    rerender(<EditUserSettings organizationUnitId="ou-789" />);

    expect(screen.getByText('ManageUsersSection - ou-789')).toBeInTheDocument();
  });
});
