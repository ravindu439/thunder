// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import LayoutPreviewPanel from '../LayoutPreviewPanel';

interface UseGetLayoutResult {
  data: Record<string, unknown> | undefined;
  isLoading: boolean;
}

const {mockUseGetLayout} = vi.hoisted(() => ({
  mockUseGetLayout: vi.fn<(id: string) => UseGetLayoutResult>(),
}));

vi.mock('@thunderid/design', () => ({
  useGetLayout: (id: string) => mockUseGetLayout(id),
}));

const baseLayout = {
  id: 'layout-1',
  handle: 'split-screen',
  displayName: 'Split Screen',
  layout: {
    screens: {
      auth: {
        background: {value: '#fafafa'},
        slots: {
          header: {height: 64, showLogo: true, showLanguageSelector: true, showBackButton: true},
          main: {container: {maxWidth: 420, padding: 24}},
          footer: {height: 40, showLinks: true},
        },
      },
      register: {
        extends: 'auth',
        slots: {
          main: {container: {maxWidth: 500}},
        },
      },
    },
  },
};

describe('LayoutPreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the select-a-layout prompt when no layout is chosen', () => {
    mockUseGetLayout.mockReturnValue({data: undefined, isLoading: false});

    render(<LayoutPreviewPanel layoutId={null} />);

    expect(screen.getByText('Select a layout to preview')).toBeInTheDocument();
  });

  it('shows a loading spinner while the layout is being fetched', () => {
    mockUseGetLayout.mockReturnValue({data: undefined, isLoading: true});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows a failure message when the layout fails to load', () => {
    mockUseGetLayout.mockReturnValue({data: undefined, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.getByText('Failed to load layout')).toBeInTheDocument();
  });

  it('renders the base screens and screen variants sections with the slot legend', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.getByText('Base layout')).toBeInTheDocument();
    expect(screen.getByText('auth')).toBeInTheDocument();
    expect(screen.getByText('Screen variants')).toBeInTheDocument();
    expect(screen.getByText('register')).toBeInTheDocument();
    expect(screen.getByText('Slots:')).toBeInTheDocument();
  });

  it('renders header slot details when the header exposes logo, language selector, and back button', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    // The derived "register" screen inherits the same header/footer slots, so several of these
    // labels appear more than once.
    expect(screen.getAllByText('Logo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lang selector').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Back button').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Links').length).toBeGreaterThan(0);
  });

  it('renders main slot container details such as max-width and padding', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.getByText('max-width: 420px')).toBeInTheDocument();
    expect(screen.getByText('padding: 24px')).toBeInTheDocument();
  });

  it('shows a generic content slot when a screen has no slots defined', () => {
    mockUseGetLayout.mockReturnValue({
      data: {
        ...baseLayout,
        layout: {screens: {blank: {}}},
      },
      isLoading: false,
    });

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('falls back to a plain Main slot when slots are defined but there is no main slot', () => {
    mockUseGetLayout.mockReturnValue({
      data: {
        ...baseLayout,
        layout: {screens: {sidebar: {slots: {header: {height: 48}}}}},
      },
      isLoading: false,
    });

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    // "Main" also appears in the always-present slot legend, hence getAllByText.
    expect(screen.getAllByText('Main').length).toBeGreaterThan(0);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders the focused single-screen view when a screen is selected', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" selectedScreen="auth" />);

    expect(screen.getByText('Split Screen — auth')).toBeInTheDocument();
    expect(screen.queryByText('Base layout')).not.toBeInTheDocument();
  });

  it('shows the "extends" annotation and merges slots from the base screen when previewing a derived screen', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" selectedScreen="register" />);

    expect(screen.getByText('auth', {selector: 'strong'})).toBeInTheDocument();
    // Inherited header/footer slots from the base screen still show up for the derived screen
    // (the slot legend at the bottom also renders these labels, hence getAllByText).
    expect(screen.getAllByText('Header').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Footer').length).toBeGreaterThan(0);
    // The derived screen's own max-width override is used, not the base's.
    expect(screen.getByText('max-width: 500px')).toBeInTheDocument();
  });

  it('prefers the live screen draft over the server-persisted screen definition', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(
      <LayoutPreviewPanel
        layoutId="layout-1"
        selectedScreen="auth"
        screenDraft={{background: {value: '#fafafa'}, slots: {main: {container: {maxWidth: 999}}}}}
      />,
    );

    expect(screen.getByText('max-width: 999px')).toBeInTheDocument();
  });

  it('renders horizontal and vertical ruler tick labels when showRulers is enabled', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" showRulers />);

    // One "100" label from the horizontal ruler and one from the vertical ruler.
    expect(screen.getAllByText('100').length).toBe(2);
  });

  it('does not render ruler tick labels by default', () => {
    mockUseGetLayout.mockReturnValue({data: baseLayout, isLoading: false});

    render(<LayoutPreviewPanel layoutId="layout-1" />);

    expect(screen.queryAllByText('100').length).toBe(0);
  });
});
