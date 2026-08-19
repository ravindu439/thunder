// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {beforeEach, afterEach, describe, expect, it} from 'vitest';
import RoutesProvider from '../RoutesProvider';
import useRoutes from '../useRoutes';

interface TestRoutePaths {
  widgets: {
    detail: (id: string) => string;
  };
}

function WidgetDetailLink({id}: {id: string}) {
  const routes = useRoutes<Partial<TestRoutePaths>>();
  const href = routes.widgets?.detail(id) ?? `/fallback-widgets/${id}`;
  return (
    <a data-testid="widget-link" href={href}>
      Widget
    </a>
  );
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('RoutesProvider', () => {
  it('exposes the supplied paths to descendants via useRoutes', () => {
    const paths: TestRoutePaths = {
      widgets: {detail: (id) => `/widgets/${id}`},
    };

    act(() => {
      root.render(
        <RoutesProvider paths={paths}>
          <WidgetDetailLink id="42" />
        </RoutesProvider>,
      );
    });

    expect(container.querySelector('[data-testid="widget-link"]')?.getAttribute('href')).toBe('/widgets/42');
  });

  it('falls back to the caller-provided default when rendered without a provider', () => {
    act(() => {
      root.render(<WidgetDetailLink id="42" />);
    });

    expect(container.querySelector('[data-testid="widget-link"]')?.getAttribute('href')).toBe('/fallback-widgets/42');
  });
});
