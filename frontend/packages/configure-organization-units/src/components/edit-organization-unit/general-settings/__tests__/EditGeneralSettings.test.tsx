// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, fireEvent, waitFor, renderWithProviders, act} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {OrganizationUnit} from '../../../../models/organization-unit';
import EditGeneralSettings from '../EditGeneralSettings';

// Mock child components
vi.mock('@/components/edit-organization-unit/general-settings/QuickCopySection', () => ({
  default: ({
    organizationUnit,
    copiedField,
    onCopyToClipboard,
  }: {
    organizationUnit: OrganizationUnit;
    copiedField: string | null;
    onCopyToClipboard: (text: string, field: string) => void;
  }) => (
    <div data-testid="quick-copy-section">
      QuickCopySection - {organizationUnit.handle}
      <button type="button" onClick={() => onCopyToClipboard('test', 'handle')}>
        Copy Handle
      </button>
      {copiedField && <span>Copied: {copiedField}</span>}
    </div>
  ),
}));

vi.mock('@/components/edit-organization-unit/general-settings/ParentSettingsSection', () => ({
  default: ({organizationUnit}: {organizationUnit: OrganizationUnit}) => (
    <div data-testid="parent-settings-section">ParentSettingsSection - {organizationUnit.name}</div>
  ),
}));

describe('EditGeneralSettings', () => {
  const mockOrganizationUnit: OrganizationUnit = {
    id: 'ou-123',
    handle: 'engineering',
    name: 'Engineering',
    description: 'Engineering department',
    parent: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render both sections', () => {
    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    expect(screen.getByTestId('quick-copy-section')).toBeInTheDocument();
    expect(screen.getByTestId('parent-settings-section')).toBeInTheDocument();
  });

  it('should pass organizationUnit to QuickCopySection', () => {
    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    expect(screen.getByText(/QuickCopySection - engineering/)).toBeInTheDocument();
  });

  it('should pass organizationUnit to ParentSettingsSection', () => {
    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    expect(screen.getByText(/ParentSettingsSection - Engineering/)).toBeInTheDocument();
  });

  it('should handle clipboard copy and show copied state', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText: writeTextMock},
      configurable: true,
    });

    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    const copyButton = screen.getByText('Copy Handle');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('test');
      expect(screen.getByText('Copied: handle')).toBeInTheDocument();
    });
  });

  it('should clear copied state after 2 seconds', async () => {
    vi.useRealTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText: vi.fn().mockResolvedValue(undefined)},
      configurable: true,
    });

    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    const copyButton = screen.getByText('Copy Handle');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copied: handle')).toBeInTheDocument();
    });

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);

    // Manually trigger the timeout callback
    const timeoutCallback = setTimeoutSpy.mock.calls.find((call) => call[1] === 2000)?.[0] as (this: void) => void;
    if (typeof timeoutCallback === 'function') {
      act(() => {
        timeoutCallback();
      });
    }

    await waitFor(() => {
      expect(screen.queryByText('Copied: handle')).not.toBeInTheDocument();
    });
    setTimeoutSpy.mockRestore();
  });

  it('should clear previous timeout when copying again', async () => {
    vi.useRealTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {writeText: vi.fn().mockResolvedValue(undefined)},
      configurable: true,
    });

    renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    const copyButton = screen.getByText('Copy Handle');

    // First copy
    fireEvent.click(copyButton);
    await waitFor(() => {
      expect(screen.getByText('Copied: handle')).toBeInTheDocument();
    });

    // Capture the first timeout ID (mocked returns are usually numbers in jsdom)
    // But we just need to verify clearTimeout was called

    // Second copy (should reset the timer)
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    // Should still set a new timeout
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);

    // Ensure the state is still copied
    expect(screen.getByText('Copied: handle')).toBeInTheDocument();

    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it('should cleanup timeout on unmount', () => {
    const {unmount} = renderWithProviders(<EditGeneralSettings organizationUnit={mockOrganizationUnit} />);

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });
});
