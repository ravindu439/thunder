// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import SignOut from '../SignOut';

// Mock child components
vi.mock('../SignOutBox', () => ({
  default: () => <div data-testid="signout-box">SignOutBox</div>,
}));

vi.mock('../../SignIn/SignInSlogan', () => ({
  default: () => <div data-testid="signin-slogan">SignInSlogan</div>,
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

// Mock AuthPageLayout and useDesign
const mockUseDesign = vi.fn();
vi.mock('@thunderid/design', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/design')>();
  return {
    ...actual,
    AuthPageLayout: ({children}: {children: React.ReactNode}) => <div data-testid="auth-page-layout">{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    useDesign: () => mockUseDesign(),
  };
});

describe('SignOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThunderID.mockReturnValue({
      isMetaLoading: false,
    });
    mockUseDesign.mockReturnValue({
      isDesignEnabled: false,
      isLoading: false,
    });
  });

  it('renders without crashing', () => {
    const {container} = render(<SignOut />);
    expect(container).toBeInTheDocument();
  });

  it('renders SignOutBox component', () => {
    render(<SignOut />);
    expect(screen.getByTestId('signout-box')).toBeInTheDocument();
  });

  it('renders AuthPageLayout', () => {
    render(<SignOut />);
    expect(screen.getByTestId('auth-page-layout')).toBeInTheDocument();
  });

  it('shows the branding slogan when design is not enabled and not loading', () => {
    render(<SignOut />);
    expect(screen.getByTestId('signin-slogan')).toBeInTheDocument();
  });

  it('hides the branding slogan when design is enabled', () => {
    mockUseDesign.mockReturnValue({
      isDesignEnabled: true,
      isLoading: false,
    });
    render(<SignOut />);
    expect(screen.queryByTestId('signin-slogan')).not.toBeInTheDocument();
  });

  it('renders when isMetaLoading is true', () => {
    mockUseThunderID.mockReturnValue({
      isMetaLoading: true,
    });
    render(<SignOut />);
    expect(screen.getByTestId('auth-page-layout')).toBeInTheDocument();
  });
});
