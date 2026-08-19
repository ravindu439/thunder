// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {Palette} from '@wso2/oxygen-ui-icons-react';
import {describe, it, expect, vi} from 'vitest';
import SectionCard from '../SectionCard';

describe('SectionCard', () => {
  const defaultProps = {
    label: 'Colors',
    description: 'Manage the color palette',
    icon: <Palette />,
    isSelected: false,
    onClick: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders the label', () => {
      render(<SectionCard {...defaultProps} />);
      expect(screen.getByText('Colors')).toBeInTheDocument();
    });

    it('renders the description', () => {
      render(<SectionCard {...defaultProps} />);
      expect(screen.getByText('Manage the color palette')).toBeInTheDocument();
    });

    it('renders the icon', () => {
      const {container} = render(<SectionCard {...defaultProps} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Selection state', () => {
    it('renders without visual selection when isSelected is false', () => {
      const {container} = render(<SectionCard {...defaultProps} isSelected={false} />);
      // Just verify it renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with visual selection when isSelected is true', () => {
      const {container} = render(<SectionCard {...defaultProps} isSelected />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when the card is clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SectionCard {...defaultProps} onClick={onClick} />);

      await user.click(screen.getByText('Colors'));

      expect(onClick).toHaveBeenCalledOnce();
    });

    it('calls onClick multiple times on repeated clicks', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SectionCard {...defaultProps} onClick={onClick} />);

      await user.click(screen.getByText('Colors'));
      await user.click(screen.getByText('Colors'));

      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });
});
