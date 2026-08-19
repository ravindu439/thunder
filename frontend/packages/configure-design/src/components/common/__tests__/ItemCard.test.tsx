// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import ItemCard from '../ItemCard';

describe('ItemCard', () => {
  const thumbnail = <div data-testid="thumb">Thumbnail</div>;

  describe('Rendering', () => {
    it('renders the item name', () => {
      render(<ItemCard thumbnail={thumbnail} name="Default Theme" onClick={vi.fn()} />);
      expect(screen.getByText('Default Theme')).toBeInTheDocument();
    });

    it('renders the thumbnail content', () => {
      render(<ItemCard thumbnail={thumbnail} name="My Theme" onClick={vi.fn()} />);
      expect(screen.getByTestId('thumb')).toBeInTheDocument();
    });

    it('renders different names correctly', () => {
      render(<ItemCard thumbnail={thumbnail} name="Ocean Blue" onClick={vi.fn()} />);
      expect(screen.getByText('Ocean Blue')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when the card is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<ItemCard thumbnail={thumbnail} name="Theme A" onClick={onClick} />);

      await user.click(screen.getByText('Theme A'));

      expect(onClick).toHaveBeenCalledOnce();
    });

    it('calls onClick only when the card is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <div>
          <ItemCard thumbnail={thumbnail} name="Theme B" onClick={onClick} />
          <button type="button">Other</button>
        </div>,
      );

      await user.click(screen.getByText('Other'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
