// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitFor, fireEvent} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import type {Role} from '../../../../models/role';
import EditGeneralSettings from '../EditGeneralSettings';

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
        'roles:edit.general.sections.organizationUnit.title': 'Organization Unit',
        'roles:edit.general.sections.organizationUnit.description': 'The organization unit this role belongs to.',
        'roles:edit.general.sections.organizationUnit.idLabel': 'ID',
        'roles:edit.general.sections.organizationUnit.handleLabel': 'Handle',
        'roles:edit.general.sections.organizationUnit.copyId': 'Copy Organization Unit ID',
        'roles:edit.general.sections.organizationUnit.copyHandle': 'Copy handle',
        'common:actions.copied': 'Copied',
      };
      return translations[key] ?? fallback ?? key;
    },
  }),
}));

describe('EditGeneralSettings', () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  const mockRole: Role = {
    id: 'role-1',
    name: 'Admin Role',
    description: 'Administrator role',
    ouId: 'ou-test-123',
    permissions: [],
  };

  const defaultProps = {
    role: mockRole,
  };

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText: mockWriteText},
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render Organization Unit section', () => {
    render(<EditGeneralSettings {...defaultProps} />);

    expect(screen.getByRole('heading', {name: 'Organization Unit'})).toBeInTheDocument();
  });

  it('should display role ouId in readonly text field', () => {
    render(<EditGeneralSettings {...defaultProps} />);

    const input = screen.getByDisplayValue('ou-test-123');
    expect(input).toBeInTheDocument();
  });

  it('should copy ouId to clipboard when copy button is clicked', async () => {
    render(<EditGeneralSettings {...defaultProps} />);

    const copyButton = screen.getByRole('button', {name: 'Copy Organization Unit ID'});
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('ou-test-123');
    });
  });

  it('should render Handle field and ID field when role has ouHandle', () => {
    const roleWithHandle: Role = {...mockRole, ouHandle: 'default'};
    render(<EditGeneralSettings role={roleWithHandle} />);

    expect(screen.getByDisplayValue('default')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ou-test-123')).toBeInTheDocument();
  });

  it('should not render Handle field when role has no ouHandle', () => {
    render(<EditGeneralSettings {...defaultProps} />);

    expect(screen.queryByLabelText('Handle')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('ou-test-123')).toBeInTheDocument();
  });

  it('should copy ouHandle to clipboard when copy handle button is clicked', async () => {
    const roleWithHandle: Role = {...mockRole, ouHandle: 'default'};
    render(<EditGeneralSettings role={roleWithHandle} />);

    const copyButton = screen.getByRole('button', {name: 'Copy handle'});
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('default');
    });
  });

  it('should not toggle ID copy icon when handle copy button is clicked', async () => {
    const roleWithHandle: Role = {...mockRole, ouHandle: 'default'};
    render(<EditGeneralSettings role={roleWithHandle} />);

    const copyHandleButton = screen.getByRole('button', {name: 'Copy handle'});
    fireEvent.click(copyHandleButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('default');
    });

    expect(screen.getByRole('button', {name: 'Copy Organization Unit ID'})).toBeInTheDocument();
  });
});
