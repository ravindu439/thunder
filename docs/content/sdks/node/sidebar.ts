// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebar: SidebarsConfig = {
  nodeSdkSidebar: [
    {
      type: 'doc',
      id: 'sdks/node/overview',
    },
    {
      type: 'category',
      label: 'APIs',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Clients',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'sdks/node/apis/clients/thunderid-node-client',
            },
          ],
        },
        {
          type: 'category',
          label: 'Configuration',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'sdks/node/apis/config/thunderid-node-config',
            },
          ],
        },
        {
          type: 'category',
          label: 'Utilities',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'sdks/node/apis/utilities/cookie-config',
              label: 'CookieConfig',
            },
            {
              type: 'doc',
              id: 'sdks/node/apis/utilities/cookie-options',
              label: 'CookieOptions',
            },
            {
              type: 'doc',
              id: 'sdks/node/apis/utilities/generate-session-id',
              label: 'generateSessionId()',
            },
            {
              type: 'doc',
              id: 'sdks/node/apis/utilities/get-session-cookie-options',
              label: 'getSessionCookieOptions()',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'sdks/node/guides/handling-authentication',
          label: 'Handling Authentication',
        },
        {
          type: 'doc',
          id: 'sdks/node/guides/protecting-routes',
          label: 'Protecting Routes',
        },
        {
          type: 'doc',
          id: 'sdks/node/guides/accessing-protected-apis',
          label: 'Accessing Protected APIs',
        },
      ],
    },
  ],
};

export default sidebar.nodeSdkSidebar;
