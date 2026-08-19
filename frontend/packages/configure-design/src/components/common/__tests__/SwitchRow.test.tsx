// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import SwitchRow from '../SwitchRow';

describe('SwitchRow', () => {
  describe('Rendering', () => {
    it('renders the label', () => {
      render(<SwitchRow label="Show Logo" value={false} onChange={vi.fn()} />);
      expect(screen.getByText('Show Logo')).toBeInTheDocument();
    });

    it('renders a switch input', () => {
      render(<SwitchRow label="Enable" value={false} onChange={vi.fn()} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('switch is checked when value is true', () => {
      render(<SwitchRow label="Active" value onChange={vi.fn()} />);
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('switch is unchecked when value is false', () => {
      render(<SwitchRow label="Active" value={false} onChange={vi.fn()} />);
      expect(screen.getByRole('switch')).not.toBeChecked();
    });
  });

  describe('Interaction', () => {
    it('calls onChange with true when toggled on', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SwitchRow label="Enabled" value={false} onChange={onChange} />);

      await user.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when toggled off', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SwitchRow label="Enabled" value onChange={onChange} />);

      await user.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('calls onChange exactly once per click', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SwitchRow label="Enabled" value={false} onChange={onChange} />);

      await user.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledOnce();
    });
  });
});
