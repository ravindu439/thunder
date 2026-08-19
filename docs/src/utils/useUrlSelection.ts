// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useHistory, useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * A selection backed by a URL query parameter, so the choice is shareable: the
 * link carries it (e.g. ?lang=python&mode=obo) and reopening it restores the
 * selection. The query string is also the single source of truth on the page,
 * so every component reading the same key stays in sync without any separate
 * store, and the router re-renders them all when the value changes.
 *
 * The static HTML is pre-rendered with the default, so we return the default
 * until the browser takes over (useIsBrowser) and only read the URL then, which
 * avoids a hydration mismatch when a shared link carries a non-default value.
 * Unknown or missing values fall back to the default, and switching uses
 * history.replace so toggles do not stack up in the browser history.
 */
export function useUrlSelection<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): [T, (next: T) => void] {
  const location = useLocation();
  const history = useHistory();
  const isBrowser = useIsBrowser();

  let value = fallback;
  if (isBrowser) {
    const raw = new URLSearchParams(location.search).get(key);
    if (raw && (allowed as readonly string[]).includes(raw)) {
      value = raw as T;
    }
  }

  function setValue(next: T): void {
    // Always write the chosen value, including the default, so that once the
    // user picks something the link carries the full selection (?lang=python&
    // mode=own) and is shareable exactly as shown. Read from history.location,
    // not the render-time location, so back-to-back setters in one handler each
    // build on the latest query string rather than overwriting one another.
    const current = history.location;
    const params = new URLSearchParams(current.search);
    params.set(key, next);
    history.replace({
      pathname: current.pathname,
      search: `?${params.toString()}`,
      hash: current.hash,
    });
  }

  return [value, setValue];
}
