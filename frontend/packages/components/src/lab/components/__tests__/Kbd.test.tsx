// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import Kbd from '../Kbd';

describe('Kbd', () => {
  describe('Rendering', () => {
    it('should render the children text', () => {
      render(<Kbd>Enter</Kbd>);

      expect(screen.getByText('Enter')).toBeInTheDocument();
    });

    it('should use a kbd HTML element', () => {
      render(<Kbd>Tab</Kbd>);

      const element = screen.getByText('Tab');

      expect(element.tagName.toLowerCase()).toBe('kbd');
    });

    it('should render multiple characters', () => {
      render(<Kbd>Ctrl+K</Kbd>);

      expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
    });

    it('should render nested elements as children', () => {
      render(
        <Kbd>
          <strong>⌘</strong>
        </Kbd>,
      );

      expect(screen.getByText('⌘')).toBeInTheDocument();
    });

    it('should apply display inline-block style', () => {
      render(<Kbd>Space</Kbd>);

      const element = screen.getByText('Space');

      expect(element).toHaveStyle({display: 'inline-block'});
    });

    it('should apply white-space nowrap style', () => {
      render(<Kbd>Shift+Enter</Kbd>);

      const element = screen.getByText('Shift+Enter');

      expect(element).toHaveStyle({whiteSpace: 'nowrap'});
    });

    it('should render multiple Kbd instances independently', () => {
      render(
        <>
          <Kbd>Ctrl</Kbd>
          <Kbd>C</Kbd>
        </>,
      );

      expect(screen.getByText('Ctrl').tagName.toLowerCase()).toBe('kbd');
      expect(screen.getByText('C').tagName.toLowerCase()).toBe('kbd');
    });
  });
});
