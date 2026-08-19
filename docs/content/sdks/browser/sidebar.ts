// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebar: SidebarsConfig = {
  browserSdkSidebar: [
    {
      type: 'doc',
      id: 'sdks/browser/overview',
    },
    {
      type: 'category',
      label: 'APIs',
      collapsed: false,
      className: 'sidebar-section-icon-apis',
      items: [
        {
          type: 'doc',
          id: 'sdks/browser/apis/thunderid-browser-client',
          label: 'ThunderIDBrowserClient',
        },
        {
          type: 'doc',
          id: 'sdks/browser/apis/configuration',
          label: 'Configuration',
        },
        {
          type: 'doc',
          id: 'sdks/browser/apis/hooks',
          label: 'Event Hooks',
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      className: 'sidebar-section-icon-guides',
      items: [
        {
          type: 'doc',
          id: 'sdks/browser/guides/accessing-protected-apis',
          label: 'Accessing Protected APIs',
        },
      ],
    },
  ],
};

export default sidebar.browserSdkSidebar;
