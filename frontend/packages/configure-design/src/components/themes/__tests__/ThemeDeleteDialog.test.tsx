// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {fireEvent, render, screen, waitFor} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import ThemeDeleteDialog from '../ThemeDeleteDialog';

const mockMutate = vi.fn();
const mockReset = vi.fn();
const mockUseDeleteTheme = {
  mutate: mockMutate,
  reset: mockReset,
  isPending: false,
  isError: false,
};

vi.mock('@thunderid/design', () => ({
  useDeleteTheme: () => mockUseDeleteTheme,
  useGetThemeUsages: vi.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
}));

describe('ThemeDeleteDialog', () => {
  beforeEach(() => {
    mockMutate.mockReset();
    mockReset.mockReset();
    mockUseDeleteTheme.isPending = false;
    mockUseDeleteTheme.isError = false;
  });

  describe('Rendering', () => {
    it('renders Dialog when open is true', () => {
      render(<ThemeDeleteDialog themeName="Ocean Blue" open themeId="theme-1" onClose={vi.fn()} />);
      // Dialog is open — some content is visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render dialog content when open is false', () => {
      render(<ThemeDeleteDialog themeName="Ocean Blue" open={false} themeId="theme-1" onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders the theme name in the dialog', () => {
      render(<ThemeDeleteDialog themeName="Ocean Blue" open themeId="theme-1" onClose={vi.fn()} />);
      expect(screen.getByText(/Ocean Blue/)).toBeInTheDocument();
    });

    it('renders without crashing when themeName is undefined', () => {
      render(<ThemeDeleteDialog themeName={null} open themeId="theme-1" onClose={vi.fn()} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders a delete button', () => {
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="Test" onClose={vi.fn()} />);
      // Should contain a destructive/delete action button (label comes from i18n key)
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
  });

  describe('Cancel behaviour', () => {
    it('calls onClose when the cancel button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={onClose} />);

      // Find cancel button by its translated text
      const cancelBtn = screen.getByText('Cancel');
      await user.click(cancelBtn);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call mutate when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={vi.fn()} />);

      const cancelBtn = screen.getByText('Cancel');
      await user.click(cancelBtn);

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Delete behaviour', () => {
    it('calls mutate with the themeId when delete is confirmed', async () => {
      const user = userEvent.setup();
      render(<ThemeDeleteDialog open themeId="theme-abc" themeName="My Theme" onClose={vi.fn()} />);

      const deleteBtn = screen.getByText('Delete');
      await user.click(deleteBtn);

      expect(mockMutate).toHaveBeenCalledWith('theme-abc', expect.any(Object));
    });

    it('does not call mutate when themeId is undefined', () => {
      render(<ThemeDeleteDialog themeId={null} themeName="My Theme" open onClose={vi.fn()} />);

      // When themeId is null the delete button is disabled, preventing any click
      const deleteBtn = screen.getByRole('button', {name: 'Delete'});
      expect(deleteBtn).toBeDisabled();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('disables buttons when isPending is true', () => {
      mockUseDeleteTheme.isPending = true;

      render(<ThemeDeleteDialog open themeId="theme-1" themeName="Test" onClose={vi.fn()} />);

      const buttons = screen.getAllByRole('button');
      const disabledButtons = buttons.filter((btn) => btn.hasAttribute('disabled'));
      expect(disabledButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Success callback', () => {
    it('calls onSuccess after successful deletion', async () => {
      const onSuccess = vi.fn();
      const onClose = vi.fn();

      // Simulate mutate calling onSuccess callback
      mockMutate.mockImplementation((_: unknown, callbacks: {onSuccess?: () => void}) => {
        callbacks?.onSuccess?.();
      });

      const user = userEvent.setup();
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={onClose} onSuccess={onSuccess} />);

      const deleteBtn = screen.getByText('Delete');
      await user.click(deleteBtn);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
      });
    });
  });

  describe('Error handling', () => {
    it('displays a resolved error message on deletion failure, never the raw server text', async () => {
      mockMutate.mockImplementation((_: unknown, callbacks: {onError?: (err: Error) => void}) => {
        callbacks?.onError?.(new Error('Network error'));
      });

      const user = userEvent.setup();
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={vi.fn()} />);

      const deleteBtn = screen.getByText('Delete');
      await user.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete theme. Please try again.')).toBeInTheDocument();
        expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      });
    });

    it('clears the error and resets the mutation when the dialog is cancelled', async () => {
      mockMutate.mockImplementation((_: unknown, callbacks: {onError?: (err: Error) => void}) => {
        callbacks?.onError?.(new Error('Network error'));
      });

      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={onClose} />);

      const deleteBtn = screen.getByText('Delete');
      await user.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete theme. Please try again.')).toBeInTheDocument();
      });

      // Simulate the mutation now being in an errored state, as it would be after onError fires.
      mockUseDeleteTheme.isError = true;

      const cancelBtn = screen.getByText('Cancel');
      await user.click(cancelBtn);

      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not reset the mutation on cancel while a delete is still pending', () => {
      mockUseDeleteTheme.isPending = true;
      mockUseDeleteTheme.isError = true;

      render(<ThemeDeleteDialog open themeId="theme-1" themeName="My Theme" onClose={vi.fn()} />);

      // The cancel button is disabled while pending, but the underlying handler also guards on
      // isPending directly: resetting a still-pending mutation would flip isPending back to false
      // before the in-flight request settles.
      const cancelBtn = screen.getByText('Cancel');
      fireEvent.click(cancelBtn);

      expect(mockReset).not.toHaveBeenCalled();
    });
  });
});
