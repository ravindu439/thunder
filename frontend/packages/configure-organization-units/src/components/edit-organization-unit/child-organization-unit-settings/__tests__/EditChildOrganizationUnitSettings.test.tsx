// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, renderWithProviders} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import EditChildOrganizationUnitSettings from '../EditChildOrganizationUnitSettings';

// Mock child component
vi.mock(
  '@/components/edit-organization-unit/child-organization-unit-settings/ManageChildOrganizationUnitSection',
  () => ({
    default: ({
      organizationUnitId,
      organizationUnitName,
    }: {
      organizationUnitId: string;
      organizationUnitName: string;
    }) => (
      <div data-testid="manage-child-ous-section">
        ManageChildOUsSection - {organizationUnitId} - {organizationUnitName}
      </div>
    ),
  }),
);

describe('EditChildOrganizationUnitSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ManageChildOUsSection', () => {
    renderWithProviders(
      <EditChildOrganizationUnitSettings organizationUnitId="ou-123" organizationUnitName="Engineering" />,
    );

    expect(screen.getByTestId('manage-child-ous-section')).toBeInTheDocument();
  });

  it('should pass organizationUnitId to ManageChildOUsSection', () => {
    renderWithProviders(
      <EditChildOrganizationUnitSettings organizationUnitId="ou-456" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText(/ManageChildOUsSection - ou-456/)).toBeInTheDocument();
  });

  it('should pass organizationUnitName to ManageChildOUsSection', () => {
    renderWithProviders(
      <EditChildOrganizationUnitSettings organizationUnitId="ou-123" organizationUnitName="Product Team" />,
    );

    expect(screen.getByText(/Product Team/)).toBeInTheDocument();
  });

  it('should handle different organization unit IDs and names', () => {
    const {rerender} = renderWithProviders(
      <EditChildOrganizationUnitSettings organizationUnitId="ou-123" organizationUnitName="Engineering" />,
    );

    expect(screen.getByText('ManageChildOUsSection - ou-123 - Engineering')).toBeInTheDocument();

    rerender(<EditChildOrganizationUnitSettings organizationUnitId="ou-789" organizationUnitName="Design" />);

    expect(screen.getByText('ManageChildOUsSection - ou-789 - Design')).toBeInTheDocument();
  });
});
