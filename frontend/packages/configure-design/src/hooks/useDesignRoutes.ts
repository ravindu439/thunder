// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useDesignRoutes` falls back to
 * `defaultDesignRoutePaths` below.
 *
 * @public
 */
export interface DesignRoutePaths {
  design: {
    list: () => string;
    themesCreate: () => string;
    themeDetail: (themeId: string) => string;
    layoutDetail: (layoutId: string) => string;
  };
}

/**
 * Default design (theme/layout builder) paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultDesignRoutePaths: DesignRoutePaths = {
  design: {
    list: () => '/design',
    themesCreate: () => '/design/themes/create',
    themeDetail: (themeId) => `/design/themes/${themeId}`,
    layoutDetail: (layoutId) => `/design/layouts/${layoutId}`,
  },
};

/**
 * Resolves the design route paths, preferring the host application's configuration (supplied via
 * `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode these destination paths; they should call this hook and build
 * the destination from the returned functions instead.
 *
 * @public
 */
export default function useDesignRoutes(): DesignRoutePaths {
  const routes = useRoutes<Partial<DesignRoutePaths>>();
  return {
    design: routes.design ?? defaultDesignRoutePaths.design,
  };
}
