// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@thunderid/test-utils';
import {describe, it, expect, vi, afterEach} from 'vitest';
import EditAdvancedSettings from '../EditAdvancedSettings';

// Mock Components
vi.mock('@thunderid/components', () => ({
  SettingsCard: ({title, description, children}: {title: string; description: string; children: React.ReactNode}) => (
    <div data-testid="settings-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        'roles:edit.general.sections.dangerZone.title': 'Danger Zone',
        'roles:edit.general.sections.dangerZone.description':
          'Actions in this section are irreversible. Proceed with caution.',
        'roles:edit.general.sections.dangerZone.deleteRole': 'Delete this role',
        'roles:edit.general.sections.dangerZone.deleteRoleDescription':
          'Deleting this role is permanent and cannot be undone.',
        'common:actions.delete': 'Delete',
      };
      return translations[key] ?? fallback ?? key;
    },
  }),
}));

describe('EditAdvancedSettings', () => {
  const mockOnDeleteClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render Danger Zone section', () => {
    render(<EditAdvancedSettings onDeleteClick={mockOnDeleteClick} />);

    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
  });

  it('should render delete role description', () => {
    render(<EditAdvancedSettings onDeleteClick={mockOnDeleteClick} />);

    expect(screen.getByText('Deleting this role is permanent and cannot be undone.')).toBeInTheDocument();
  });

  it('should call onDeleteClick when delete button is clicked', () => {
    render(<EditAdvancedSettings onDeleteClick={mockOnDeleteClick} />);

    const deleteButton = screen.getByRole('button', {name: 'Delete'});
    fireEvent.click(deleteButton);

    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('should not render Danger Zone section when onDeleteClick is not provided', () => {
    render(<EditAdvancedSettings />);

    expect(screen.queryByText('Danger Zone')).not.toBeInTheDocument();
  });
});
