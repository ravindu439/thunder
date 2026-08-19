// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, renderWithProviders} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {OrganizationUnit} from '../../../../models/organization-unit';
import EditCustomizationSettings from '../EditCustomizationSettings';

// Mock child components
vi.mock('@/components/edit-organization-unit/customization-settings/AppearanceSection', () => ({
  default: ({
    organizationUnit,
    editedOU,
    onFieldChange,
  }: {
    organizationUnit: OrganizationUnit;
    editedOU: Partial<OrganizationUnit>;
    onFieldChange: (field: keyof OrganizationUnit, value: unknown) => void;
  }) => (
    <div data-testid="appearance-section">
      AppearanceSection - {organizationUnit.name}
      <button type="button" onClick={() => onFieldChange('themeId', 'new-theme')}>
        Change Theme
      </button>
      <span>Edited Theme: {editedOU.themeId ?? 'none'}</span>
    </div>
  ),
}));

describe('EditCustomizationSettings', () => {
  const mockOrganizationUnit: OrganizationUnit = {
    id: 'ou-123',
    handle: 'engineering',
    name: 'Engineering',
    description: 'Engineering department',
    parent: null,
  };

  const mockEditedOU: Partial<OrganizationUnit> = {};
  const mockOnFieldChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AppearanceSection', () => {
    renderWithProviders(
      <EditCustomizationSettings
        organizationUnit={mockOrganizationUnit}
        editedOU={mockEditedOU}
        onFieldChange={mockOnFieldChange}
      />,
    );

    expect(screen.getByTestId('appearance-section')).toBeInTheDocument();
  });

  it('should pass organizationUnit to AppearanceSection', () => {
    renderWithProviders(
      <EditCustomizationSettings
        organizationUnit={mockOrganizationUnit}
        editedOU={mockEditedOU}
        onFieldChange={mockOnFieldChange}
      />,
    );

    expect(screen.getByText(/AppearanceSection - Engineering/)).toBeInTheDocument();
  });

  it('should pass editedOU to AppearanceSection', () => {
    const editedOU: Partial<OrganizationUnit> = {
      themeId: 'custom-theme',
    };

    renderWithProviders(
      <EditCustomizationSettings
        organizationUnit={mockOrganizationUnit}
        editedOU={editedOU}
        onFieldChange={mockOnFieldChange}
      />,
    );

    expect(screen.getByText('Edited Theme: custom-theme')).toBeInTheDocument();
  });

  it('should pass onFieldChange to AppearanceSection', () => {
    renderWithProviders(
      <EditCustomizationSettings
        organizationUnit={mockOrganizationUnit}
        editedOU={mockEditedOU}
        onFieldChange={mockOnFieldChange}
      />,
    );

    const changeButton = screen.getByText('Change Theme');
    changeButton.click();

    expect(mockOnFieldChange).toHaveBeenCalledWith('themeId', 'new-theme');
  });

  it('should handle empty editedOU', () => {
    renderWithProviders(
      <EditCustomizationSettings
        organizationUnit={mockOrganizationUnit}
        editedOU={{}}
        onFieldChange={mockOnFieldChange}
      />,
    );

    expect(screen.getByText('Edited Theme: none')).toBeInTheDocument();
  });
});
