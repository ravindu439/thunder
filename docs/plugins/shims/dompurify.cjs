// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// SSR shim for dompurify — DOMPurify requires a DOM environment and fails to
// initialize in Node.js SSR. This no-op shim is used only during Docusaurus
// server-side rendering; the real package runs in the browser.

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

const DOMPurify = {
  addHook: noop,
  clearConfig: noop,
  isSupported: false,
  removeAllHooks: noop,
  removeHook: noop,
  removeHooks: noop,
  sanitize: function (input) {
    return typeof input === 'string' ? input : '';
  },
  setConfig: noop,
  version: '0.0.0',
};

module.exports = DOMPurify;
module.exports.default = DOMPurify;
