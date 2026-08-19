// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import SignUp from '../SignUp';

// Mock child component
vi.mock('../SignUpBox', () => ({
  default: () => <div data-testid="signup-box">SignUpBox</div>,
}));

// Mock useDesign hook
const mockUseDesign = vi.fn();
vi.mock('@thunderid/design', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/design')>();
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    useDesign: () => mockUseDesign(),
  };
});

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDesign.mockReturnValue({
      isDesignEnabled: false,
      isLoading: false,
    });
  });

  it('renders without crashing', () => {
    const {container} = render(<SignUp />);
    expect(container).toBeInTheDocument();
  });

  it('renders SignUpBox component', () => {
    render(<SignUp />);
    expect(screen.getByTestId('signup-box')).toBeInTheDocument();
  });

  it('renders main element', () => {
    render(<SignUp />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
