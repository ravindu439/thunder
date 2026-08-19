// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import Recovery from '../Recovery';

// Mock child component
vi.mock('../RecoveryBox', () => ({
  default: () => <div data-testid="recovery-box">RecoveryBox</div>,
}));

// Mock useThunderID hook
const mockUseThunderID = vi.fn();
vi.mock('@thunderid/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/react')>();
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    useThunderID: () => mockUseThunderID(),
  };
});

// Mock AuthPageLayout
vi.mock('@thunderid/design', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/design')>();
  return {
    ...actual,
    AuthPageLayout: ({children}: {children: React.ReactNode}) => <div data-testid="auth-page-layout">{children}</div>,
  };
});

describe('Recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThunderID.mockReturnValue({
      isMetaLoading: false,
    });
  });

  it('renders without crashing', () => {
    const {container} = render(<Recovery />);
    expect(container).toBeInTheDocument();
  });

  it('renders RecoveryBox component', () => {
    render(<Recovery />);
    expect(screen.getByTestId('recovery-box')).toBeInTheDocument();
  });

  it('renders AuthPageLayout', () => {
    render(<Recovery />);
    expect(screen.getByTestId('auth-page-layout')).toBeInTheDocument();
  });

  it('renders when isMetaLoading is true', () => {
    mockUseThunderID.mockReturnValue({
      isMetaLoading: true,
    });
    render(<Recovery />);
    expect(screen.getByTestId('auth-page-layout')).toBeInTheDocument();
  });
});
