// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebar: SidebarsConfig = {
  expressSdkSidebar: [
    {
      type: 'doc',
      id: 'sdks/express/overview',
    },
    {
      type: 'category',
      label: 'APIs',
      collapsed: false,
      className: 'sidebar-section-icon-apis',
      items: [
        {
          type: 'category',
          label: 'Middleware',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'sdks/express/apis/middleware/thunderid',
              label: 'thunderID()',
            },
            {
              type: 'doc',
              id: 'sdks/express/apis/middleware/handle-sign-in',
              label: 'handleSignIn()',
            },
            {
              type: 'doc',
              id: 'sdks/express/apis/middleware/handle-sign-out',
              label: 'handleSignOut()',
            },
            {
              type: 'doc',
              id: 'sdks/express/apis/middleware/protect',
              label: 'protect()',
            },
            {
              type: 'doc',
              id: 'sdks/express/apis/middleware/handle-flow',
              label: 'handleFlow()',
            },
          ],
        },
        {
          type: 'category',
          label: 'Client',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'sdks/express/apis/client/thunderid-express-client',
              label: 'ThunderIDExpressClient',
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
              id: 'sdks/express/apis/configuration/express-client-config',
              label: 'ExpressClientConfig',
            },
          ],
        },
        {
          type: 'category',
          label: 'Constants',
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'sdks/express/apis/constants/cookie-config',
              label: 'CookieConfig',
            },
          ],
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
          id: 'sdks/express/guides/redirect-flow',
          label: 'Redirect Flow',
        },
        {
          type: 'doc',
          id: 'sdks/express/guides/embedded-sign-in',
          label: 'Embedded Sign-In',
        },
      ],
    },
  ],
};

export default sidebar.expressSdkSidebar;
