// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import AddCard from '../AddCard';

describe('AddCard', () => {
  describe('Rendering', () => {
    it('renders the label text', () => {
      render(<AddCard label="Add Theme" onClick={vi.fn()} />);
      expect(screen.getByText('Add Theme')).toBeInTheDocument();
    });

    it('renders the plus icon', () => {
      const {container} = render(<AddCard label="Add Layout" onClick={vi.fn()} />);
      // The Plus icon is an SVG element
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('is rendered as a clickable box', () => {
      const {container} = render(<AddCard label="Click me" onClick={vi.fn()} />);
      // The top-level Box has onClick — just verify the component renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when the card is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<AddCard label="Add" onClick={onClick} />);

      await user.click(screen.getByText('Add'));

      expect(onClick).toHaveBeenCalledOnce();
    });

    it('calls onClick each time the card is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<AddCard label="Add" onClick={onClick} />);

      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));

      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('does not call onClick when a different element is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <div>
          <AddCard label="Add" onClick={onClick} />
          <button type="button">Other</button>
        </div>,
      );

      await user.click(screen.getByText('Other'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
