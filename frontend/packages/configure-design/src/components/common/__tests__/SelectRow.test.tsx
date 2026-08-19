// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import SelectRow from '../SelectRow';

const options = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
  {label: 'System', value: 'system'},
];

describe('SelectRow', () => {
  describe('Rendering', () => {
    it('renders the label', () => {
      render(<SelectRow label="Color Scheme" value="light" options={options} onChange={vi.fn()} />);
      expect(screen.getByText('Color Scheme')).toBeInTheDocument();
    });

    it('renders the currently selected value', () => {
      render(<SelectRow label="Color Scheme" value="dark" options={options} onChange={vi.fn()} />);
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    it('renders options in the dropdown when opened', async () => {
      const user = userEvent.setup();
      render(<SelectRow label="Color Scheme" value="light" options={options} onChange={vi.fn()} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByRole('option', {name: 'Dark'})).toBeInTheDocument();
      expect(screen.getByRole('option', {name: 'System'})).toBeInTheDocument();
    });

    it('renders a select element', () => {
      render(<SelectRow label="Direction" value="ltr" options={[{label: 'LTR', value: 'ltr'}]} onChange={vi.fn()} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onChange with selected option value', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SelectRow label="Color Scheme" value="light" options={options} onChange={onChange} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', {name: 'Dark'}));

      expect(onChange).toHaveBeenCalledWith('dark');
    });

    it('calls onChange exactly once per selection', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SelectRow label="Color Scheme" value="light" options={options} onChange={onChange} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', {name: 'System'}));

      expect(onChange).toHaveBeenCalledOnce();
    });
  });
});
