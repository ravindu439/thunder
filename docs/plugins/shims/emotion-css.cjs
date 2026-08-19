// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// SSR shim for @emotion/css — Emotion creates a DOM cache at module init
// which fails in Node.js (document is not defined). This no-op shim is used
// only during Docusaurus server-side rendering; the real package runs in the browser.

function noop() {
  return '';
}

module.exports = {
  css: noop,
  cx: noop,
  injectGlobal: noop,
  keyframes: noop,
  hydrate: noop,
  flush: noop,
  merge: noop,
  getRegisteredStyles: function () {
    return [];
  },
  cache: {key: 'css', registered: {}, inserted: {}, sheet: {tags: []}},
};
