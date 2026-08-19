// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */

import path from 'path';

export default function () {
  return {
    name: 'product-docs-webpack-plugin',
    configureWebpack(config: any, isServer: boolean) {
      // url-loader@4.x is incompatible with webpack@5.100+, causing:
      // "TypeError: Cannot read properties of undefined (reading 'date')"
      // Mutate existing rules in-place to replace url-loader with webpack 5
      // native asset modules before webpack-merge concatenates the rules array.
      if (Array.isArray(config?.module?.rules)) {
        for (let i = 0; i < config.module.rules.length; i++) {
          const rule = config.module.rules[i];
          if (!rule || typeof rule !== 'object' || Array.isArray(rule) || !rule.test) {
            continue;
          }
          const uses = Array.isArray(rule.use) ? rule.use : rule.use ? [rule.use] : [];
          const usesUrlLoader = uses.some((u: any) => {
            const loader = typeof u === 'string' ? u : u?.loader;
            return typeof loader === 'string' && loader.includes('url-loader');
          });
          if (usesUrlLoader) {
            config.module.rules[i] = {test: rule.test, type: 'asset/resource'};
          }
        }
      }
      const baseConfig = {
        module: {
          rules: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      };

      // @thunderid/react is an external used by the frontend design package dist
      // but is not needed at all in the docs build. Alias it to a no-op shim.
      const thunderidReactShim = path.resolve(__dirname, 'shims/thunderid-react.cjs');

      // @emotion/css calls document.createElement at module init, which fails
      // in Node.js SSR. Alias it to a no-op shim for the server build only.
      // dompurify requires a DOM environment and fails to initialize in Node.js SSR.
      if (isServer) {
        return {
          ...baseConfig,
          resolve: {
            alias: {
              '@emotion/css': path.resolve(__dirname, 'shims/emotion-css.cjs'),
              '@thunderid/react': thunderidReactShim,
              'dompurify': path.resolve(__dirname, 'shims/dompurify.cjs'),
            },
          },
        };
      }

      return {
        ...baseConfig,
        resolve: {
          alias: {
            '@thunderid/react': thunderidReactShim,
          },
        },
      };
    },
  };
}
