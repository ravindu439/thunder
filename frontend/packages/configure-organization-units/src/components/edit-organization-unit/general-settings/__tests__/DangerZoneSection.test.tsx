// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, fireEvent, renderWithProviders, renderHook} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, it, expect, vi, beforeEach, afterEach, beforeAll} from 'vitest';
import DangerZoneSection from '../DangerZoneSection';

describe('DangerZoneSection', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });

  const mockOnDeleteClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the danger zone section', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    expect(screen.getByText(t('organizationUnits:edit.general.sections.dangerZone.title'))).toBeInTheDocument();
    expect(screen.getByText(t('organizationUnits:edit.general.sections.dangerZone.description'))).toBeInTheDocument();
  });

  it('should render delete organization unit title', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    const heading = screen.getByRole('heading', {
      name: t('organizationUnits:edit.general.sections.dangerZone.deleteOU.title'),
      level: 6,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render warning description', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    expect(
      screen.getByText(t('organizationUnits:edit.general.sections.dangerZone.deleteOU.description')),
    ).toBeInTheDocument();
  });

  it('should render delete button', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    const deleteButton = screen.getByRole('button', {
      name: t('organizationUnits:edit.general.dangerZone.delete.button.label'),
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDeleteClick when delete button is clicked', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    const deleteButton = screen.getByRole('button', {
      name: t('organizationUnits:edit.general.dangerZone.delete.button.label'),
    });
    fireEvent.click(deleteButton);

    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteClick multiple times when clicked multiple times', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    const deleteButton = screen.getByRole('button', {
      name: t('organizationUnits:edit.general.dangerZone.delete.button.label'),
    });
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(mockOnDeleteClick).toHaveBeenCalledTimes(3);
  });

  it('should render delete button with error color', () => {
    renderWithProviders(<DangerZoneSection onDeleteClick={mockOnDeleteClick} />);

    const deleteButton = screen.getByRole('button', {
      name: t('organizationUnits:edit.general.dangerZone.delete.button.label'),
    });
    expect(deleteButton).toHaveClass('MuiButton-colorError');
  });
});
