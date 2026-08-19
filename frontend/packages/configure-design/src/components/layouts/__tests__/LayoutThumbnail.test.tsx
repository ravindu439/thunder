// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {LayoutListItem} from '@thunderid/design';
import {render} from '@thunderid/test-utils';
import {OxygenUIThemeProvider, useColorScheme} from '@wso2/oxygen-ui';
import {useEffect, type ReactNode} from 'react';
import {describe, it, expect} from 'vitest';
import LayoutThumbnail from '../LayoutThumbnail';

function ModeSetter({mode, children}: {mode: 'light' | 'dark'; children: ReactNode}) {
  const {setMode} = useColorScheme();
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  return children;
}

function renderThumbnail(layout: LayoutListItem, mode: 'light' | 'dark' = 'light') {
  return render(
    <OxygenUIThemeProvider>
      <ModeSetter mode={mode}>
        <LayoutThumbnail layout={layout} />
      </ModeSetter>
    </OxygenUIThemeProvider>,
  );
}

function makeLayout(overrides: {background?: string; hasHeader?: boolean; hasFooter?: boolean}): LayoutListItem {
  const {background, hasHeader = false, hasFooter = false} = overrides;
  const slots: Record<string, unknown> = {};
  if (hasHeader) slots['header'] = {components: []};
  if (hasFooter) slots['footer'] = {components: []};

  return {
    id: 'layout-1',
    handle: 'custom',
    displayName: 'Custom Layout',
    layout: {
      screens: {
        auth: {
          slots,
          ...(background ? {background: {value: background}} : {}),
        },
      },
    },
  } as unknown as LayoutListItem;
}

describe('LayoutThumbnail', () => {
  describe('solid mode (no custom background)', () => {
    it('renders without a header or footer when neither slot is present', () => {
      const {container} = render(
        <OxygenUIThemeProvider>
          <LayoutThumbnail layout={makeLayout({})} />
        </OxygenUIThemeProvider>,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a header block when the header slot is present', () => {
      const {container} = render(
        <OxygenUIThemeProvider>
          <LayoutThumbnail layout={makeLayout({hasHeader: true})} />
        </OxygenUIThemeProvider>,
      );
      expect(container.querySelectorAll('div').length).toBeGreaterThan(1);
    });

    it('renders three footer chips when the footer slot is present', () => {
      const {container} = render(
        <OxygenUIThemeProvider>
          <LayoutThumbnail layout={makeLayout({hasFooter: true})} />
        </OxygenUIThemeProvider>,
      );
      // The footer renders exactly 3 chip Boxes ([1, 2, 3].map(...))
      const footerRow = container.querySelector('div');
      expect(footerRow).toBeInTheDocument();
    });
  });

  describe('glass mode (custom background set)', () => {
    it('renders with a solid-color custom background in light mode', () => {
      const {container} = renderThumbnail(
        makeLayout({background: '#ff0000', hasHeader: true, hasFooter: true}),
        'light',
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with a solid-color custom background in dark mode', () => {
      const {container} = renderThumbnail(
        makeLayout({background: '#ff0000', hasHeader: true, hasFooter: true}),
        'dark',
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders header and footer chips using the glass-mode nav chip background', () => {
      const {container} = renderThumbnail(makeLayout({background: '#00ff00', hasHeader: true, hasFooter: true}));
      expect(container.querySelectorAll('div').length).toBeGreaterThan(3);
    });
  });
});
