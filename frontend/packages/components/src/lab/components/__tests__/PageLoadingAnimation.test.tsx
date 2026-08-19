// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import PageLoadingAnimation from '../PageLoadingAnimation';

describe('PageLoadingAnimation', () => {
  describe('Rendering', () => {
    it('should render the spinner', () => {
      render(<PageLoadingAnimation />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render the spinner with an accessible label', () => {
      render(<PageLoadingAnimation />);

      expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
    });

    it('should render the container with role status', () => {
      render(<PageLoadingAnimation />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
