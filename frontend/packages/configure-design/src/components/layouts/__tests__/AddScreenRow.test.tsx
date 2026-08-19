// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import AddScreenRow from '../AddScreenRow';

const baseScreens = ['auth', 'login'];

describe('AddScreenRow', () => {
  describe('Initial state', () => {
    it('renders the "Add screen" trigger button', () => {
      render(<AddScreenRow baseScreens={baseScreens} onAdd={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not show the text field before activation', () => {
      render(<AddScreenRow baseScreens={baseScreens} onAdd={vi.fn()} />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('Expanded state', () => {
    it('shows the text input after clicking the add button', async () => {
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={vi.fn()} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows a cancel button after expansion', async () => {
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={vi.fn()} />);

      await user.click(screen.getByRole('button'));

      // Expanded form should have at least 2 buttons (add + cancel)
      expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Adding a screen', () => {
    it('calls onAdd with the typed name and first baseScreen when confirmed', async () => {
      const onAdd = vi.fn();
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={onAdd} />);

      await user.click(screen.getByRole('button'));
      await user.type(screen.getByRole('textbox'), 'my-screen');

      // Click the confirm/add button (find by looking for non-cancel buttons)
      const buttons = screen.getAllByRole('button');
      // The add/confirm button triggers onAdd — find the first non-cancel button
      const confirmBtn = buttons.find((btn) => btn.textContent && !btn.textContent.toLowerCase().includes('cancel'));
      if (confirmBtn) {
        await user.click(confirmBtn);
      }

      expect(onAdd).toHaveBeenCalledWith('my-screen', baseScreens[0]);
    });

    it('calls onAdd on Enter key press', async () => {
      const onAdd = vi.fn();
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={onAdd} />);

      await user.click(screen.getByRole('button'));
      await user.type(screen.getByRole('textbox'), 'custom-screen{Enter}');

      expect(onAdd).toHaveBeenCalledWith('custom-screen', baseScreens[0]);
    });

    it('does NOT call onAdd when name is empty', async () => {
      const onAdd = vi.fn();
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={onAdd} />);

      await user.click(screen.getByRole('button'));
      await user.keyboard('{Enter}');

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe('Cancellation', () => {
    it('hides the input after pressing Escape', async () => {
      const user = userEvent.setup();
      render(<AddScreenRow baseScreens={baseScreens} onAdd={vi.fn()} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('textbox'));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });
});
