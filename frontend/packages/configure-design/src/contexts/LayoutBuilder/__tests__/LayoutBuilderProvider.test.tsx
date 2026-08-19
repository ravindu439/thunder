// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import LayoutBuilderProvider from '../LayoutBuilderProvider';
import useLayoutBuilder from '../useLayoutBuilder';

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: () => ({layoutId: 'layout-123'}),
  };
});

const mockLayout = {
  screens: {
    auth: {
      background: {type: 'solid', color: '#ffffff'},
      slots: {},
    },
    login: {
      extends: 'auth',
      slots: {},
    },
  },
};

const mockUseGetLayout = vi.fn();

vi.mock('@thunderid/design', () => ({
  useGetLayout: (...args: unknown[]): unknown => mockUseGetLayout(...args),
}));

/**
 * Helper consumer component that exposes context values as readable elements
 */
function TestConsumer() {
  const ctx = useLayoutBuilder();
  const allScreens = ctx.getAllScreens();
  const baseNames = ctx.getBaseScreenNames();

  return (
    <div>
      <span data-testid="layoutId">{ctx.layoutId}</span>
      <span data-testid="displayName">{ctx.displayName ?? 'null'}</span>
      <span data-testid="isDirty">{String(ctx.isDirty)}</span>
      <span data-testid="selectedScreen">{ctx.selectedScreen ?? 'null'}</span>
      <span data-testid="allScreens">{Object.keys(allScreens).join(',')}</span>
      <span data-testid="baseScreenNames">{baseNames.join(',')}</span>
      <button type="button" onClick={() => ctx.addScreen('recovery', 'auth')}>
        AddScreen
      </button>
      <button
        type="button"
        onClick={() => ctx.updateDraftLayout(['screens', 'auth', 'background', 'color'], '#000000')}
      >
        UpdateBg
      </button>
      <button type="button" onClick={() => ctx.updateDraftLayout(['screens', 'brandNew', 'title'], 'Hello')}>
        UpdateNestedNew
      </button>
      <button type="button" onClick={ctx.resetDraft}>
        Reset
      </button>
    </div>
  );
}

describe('LayoutBuilderProvider', () => {
  beforeEach(() => {
    mockUseGetLayout.mockReset();
  });

  describe('Loading state', () => {
    it('renders null while loading', () => {
      mockUseGetLayout.mockReturnValue({data: undefined, isLoading: true});
      const {container} = render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('does not render children while loading', () => {
      mockUseGetLayout.mockReturnValue({data: undefined, isLoading: true});
      render(
        <LayoutBuilderProvider>
          <span data-testid="child">Child</span>
        </LayoutBuilderProvider>,
      );

      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders a read error instead of the provider tree when the layout fetch fails', () => {
      mockUseGetLayout.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: vi.fn(),
      });

      render(
        <LayoutBuilderProvider>
          <span data-testid="child">Child</span>
        </LayoutBuilderProvider>,
      );

      expect(screen.getByText('Failed to load layout')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });

    it('retries the fetch when the read error action is clicked', async () => {
      const mockRefetch = vi.fn();
      mockUseGetLayout.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });

      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <span data-testid="child">Child</span>
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByRole('button', {name: 'Refresh'}));

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loaded state', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('renders children when not loading', () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(screen.getByTestId('layoutId')).toBeInTheDocument();
    });

    it('provides the layoutId from route params', () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(screen.getByTestId('layoutId')).toHaveTextContent('layout-123');
    });

    it('provides the displayName from fetched data', () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(screen.getByTestId('displayName')).toHaveTextContent('Default Layout');
    });

    it('starts with isDirty=false', () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(screen.getByTestId('isDirty')).toHaveTextContent('false');
    });

    it('auto-selects the first screen', async () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await waitFor(() => {
        // First screen key in mockLayout.screens is 'auth'
        expect(screen.getByTestId('selectedScreen')).toHaveTextContent('auth');
      });
    });
  });

  describe('getAllScreens', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('returns all screens from the draft layout', async () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await waitFor(() => {
        const text = screen.getByTestId('allScreens').textContent ?? '';
        expect(text).toContain('auth');
        expect(text).toContain('login');
      });
    });
  });

  describe('getBaseScreenNames', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('returns only screens that do not have an extends property', async () => {
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await waitFor(() => {
        const text = screen.getByTestId('baseScreenNames').textContent ?? '';
        expect(text).toContain('auth');
        expect(text).not.toContain('login');
      });
    });
  });

  describe('addScreen', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('adds a new screen to getAllScreens', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('AddScreen'));

      await waitFor(() => {
        expect(screen.getByTestId('allScreens').textContent).toContain('recovery');
      });
    });

    it('selects the newly added screen', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('AddScreen'));

      await waitFor(() => {
        expect(screen.getByTestId('selectedScreen')).toHaveTextContent('recovery');
      });
    });

    it('marks isDirty after adding a screen', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('AddScreen'));

      await waitFor(() => {
        expect(screen.getByTestId('isDirty')).toHaveTextContent('true');
      });
    });

    it('new screen does not appear in base screen names (has extends)', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('AddScreen'));

      await waitFor(() => {
        expect(screen.getByTestId('baseScreenNames').textContent).not.toContain('recovery');
      });
    });
  });

  describe('updateDraftLayout', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('marks isDirty as true after an update', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('UpdateBg'));

      await waitFor(() => {
        expect(screen.getByTestId('isDirty')).toHaveTextContent('true');
      });
    });

    it('creates missing intermediate objects along the path', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('UpdateNestedNew'));

      await waitFor(() => {
        expect(screen.getByTestId('allScreens').textContent).toContain('brandNew');
      });
    });

    it('does not throw and leaves the draft unset when there is no draft layout to update', async () => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: undefined},
        isLoading: false,
      });

      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      expect(screen.getByTestId('allScreens')).toHaveTextContent('');

      await user.click(screen.getByText('UpdateBg'));

      await waitFor(() => {
        expect(screen.getByTestId('isDirty')).toHaveTextContent('true');
      });
      expect(screen.getByTestId('allScreens')).toHaveTextContent('');
    });
  });

  describe('layout data transitioning from loading to loaded', () => {
    it('initializes the draft once the layout finishes loading', async () => {
      mockUseGetLayout.mockReturnValue({data: undefined, isLoading: true});
      const {rerender} = render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
      rerender(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('selectedScreen')).toHaveTextContent('auth');
      });
      expect(screen.getByTestId('allScreens').textContent).toContain('auth');
    });
  });

  describe('resetDraft', () => {
    beforeEach(() => {
      mockUseGetLayout.mockReturnValue({
        data: {id: 'layout-123', displayName: 'Default Layout', layout: mockLayout},
        isLoading: false,
      });
    });

    it('clears isDirty after reset', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      await user.click(screen.getByText('UpdateBg'));
      await waitFor(() => expect(screen.getByTestId('isDirty')).toHaveTextContent('true'));

      await user.click(screen.getByText('Reset'));
      await waitFor(() => {
        expect(screen.getByTestId('isDirty')).toHaveTextContent('false');
      });
    });

    it('clears extraScreens on reset', async () => {
      const user = userEvent.setup();
      render(
        <LayoutBuilderProvider>
          <TestConsumer />
        </LayoutBuilderProvider>,
      );

      // Add a screen, then reset
      await user.click(screen.getByText('AddScreen'));
      await waitFor(() => expect(screen.getByTestId('allScreens').textContent).toContain('recovery'));

      await user.click(screen.getByText('Reset'));
      await waitFor(() => {
        expect(screen.getByTestId('allScreens').textContent).not.toContain('recovery');
      });
    });
  });
});
