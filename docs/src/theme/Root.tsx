// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {DefaultTheme} from '@thunderid/design';
import {LoggerProvider, LogLevel} from '@thunderid/logger/react';
import {OxygenUIThemeProvider} from '@wso2/oxygen-ui';
import {PropsWithChildren, useEffect, useMemo} from 'react';
import {applyPersona, getPersonaOptions, type Persona} from './NavbarItem/persona-utils';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';

const PERSONA_STORAGE_KEY = 'product-docs-persona';

export default function Root({children = null}: PropsWithChildren<Record<string, unknown>>) {
  const location = useLocation();
  const baseUrl = useBaseUrl('/');
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.customFields?.product as DocusaurusProductConfig;
  const personas = useMemo(() => getPersonaOptions(config.project.name), [config.project.name]);

  useEffect(() => {
    const html = document.documentElement;
    const pathname = location.pathname;
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    const normalizedBase = baseUrl.replace(/\/+$/, '') || '/';

    const pagePath = normalizedPath === normalizedBase
      ? 'home'
      : pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';

    // Restrict the derived value to a known-safe character set and write it through the
    // dataset API, which can only ever set an inert data-* attribute (read by CSS selectors).
    const safePagePath = pagePath.replace(/[^a-z0-9-]/gi, '') || 'home';

    html.dataset.page = safePagePath;
  }, [location.pathname, baseUrl]);

  // Restore persona selection from localStorage before first paint.
  useEffect(() => {
    const saved = localStorage.getItem(PERSONA_STORAGE_KEY) as Persona | null;
    if (saved && personas.some((p) => p.value === saved)) {
      applyPersona(saved);
    }
  }, [personas]);

  return (
    <OxygenUIThemeProvider theme={DefaultTheme}>
      <LoggerProvider
        logger={{
          level: LogLevel.DEBUG,
        }}
      >
        {children}
      </LoggerProvider>
    </OxygenUIThemeProvider>
  );
}
