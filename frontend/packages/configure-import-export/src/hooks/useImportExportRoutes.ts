// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * `home` and `welcome` are owned by the host (console implements them itself, not through a
 * package), but this package's pages navigate to a handful of their paths as part of the
 * first-run "welcome" import flow, so their shapes are declared here too — narrowed to only the
 * members this package actually calls.
 *
 * The host supplies all of these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g.
 * this package rendered standalone in Storybook or a unit test), `useImportExportRoutes` falls
 * back to `defaultImportExportRoutePaths` below.
 *
 * @public
 */
export interface ImportExportRoutePaths {
  home: {
    list: () => string;
  };
  importExport: {
    list: () => string;
  };
  export: {
    page: () => string;
  };
  importConfiguration: {
    upload: () => string;
    validate: () => string;
    summary: () => string;
  };
  welcome: {
    root: () => string;
    importConfigurationUpload: () => string;
    importConfigurationValidate: () => string;
    importConfigurationSummary: () => string;
  };
}

/**
 * Default import/export (and welcome-flow) paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultImportExportRoutePaths: ImportExportRoutePaths = {
  home: {
    list: () => '/home',
  },
  importExport: {
    list: () => '/import-export',
  },
  export: {
    page: () => '/export',
  },
  importConfiguration: {
    upload: () => '/import-configuration',
    validate: () => '/import-configuration/validate',
    summary: () => '/import-configuration/summary',
  },
  welcome: {
    root: () => '/welcome',
    importConfigurationUpload: () => '/welcome/import-configuration',
    importConfigurationValidate: () => '/welcome/import-configuration/validate',
    importConfigurationSummary: () => '/welcome/import-configuration/summary',
  },
};

/**
 * Resolves the import/export (and welcome-flow) route paths, preferring the host application's
 * configuration (supplied via `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode these destination paths; they should call this hook and build
 * the destination from the returned functions instead.
 *
 * @public
 */
export default function useImportExportRoutes(): ImportExportRoutePaths {
  const routes = useRoutes<Partial<ImportExportRoutePaths>>();
  return {
    home: routes.home ?? defaultImportExportRoutePaths.home,
    importExport: routes.importExport ?? defaultImportExportRoutePaths.importExport,
    export: routes.export ?? defaultImportExportRoutePaths.export,
    importConfiguration: routes.importConfiguration ?? defaultImportExportRoutePaths.importConfiguration,
    welcome: routes.welcome ?? defaultImportExportRoutePaths.welcome,
  };
}
