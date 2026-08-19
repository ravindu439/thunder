// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// No-op shim for @thunderid/react.
// The frontend design package dist imports these symbols from @thunderid/react,
// but docs only uses theme utilities from that package. This shim prevents
// webpack from failing when it cannot resolve @thunderid/react in the docs build.

module.exports = {
  Consent: () => null,
  ConsentCheckboxList: () => null,
  EmbeddedFlowComponentType: {},
  EmbeddedFlowEventType: {},
  EmbeddedFlowTextVariant: {},
  FlowTimer: () => null,
  extractEmojiFromUri: () => undefined,
  isEmojiUri: () => false,
  useThunderID: () => ({}),
};
