// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useConfig} from '@thunderid/contexts';
import {useEffect, useState} from 'react';
import {isValidStylesheetUrl} from '../utils/cssSanitizer';

/** Injects a `<link rel="stylesheet">` for a font-import URL into a document's head when it's a
 *  valid http(s) URL, removing it on cleanup or when the URL changes/clears. Shared by
 *  `FontImporter` and other places (e.g. a live preview) that need the same font loaded outside
 *  the document `FontImporter` targets. Returns a tick that increments on each load. */
export default function useFontStylesheetLink(importURL: string | undefined, targetDocument?: Document): number {
  const {config} = useConfig();
  const idPrefix = config.brand.product_name.toLowerCase().replace(/\s+/g, '-');
  const linkId = `${idPrefix}-font-import`;

  const [loadedTick, setLoadedTick] = useState(0);

  useEffect(() => {
    const doc = targetDocument ?? document;
    doc.getElementById(linkId)?.remove();

    if (!importURL || !isValidStylesheetUrl(importURL)) {
      return undefined;
    }

    const link = doc.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = importURL;
    link.addEventListener('load', () => setLoadedTick((n) => n + 1));
    doc.head.appendChild(link);

    return () => {
      doc.getElementById(linkId)?.remove();
    };
  }, [importURL, linkId, targetDocument]);

  return loadedTick;
}
