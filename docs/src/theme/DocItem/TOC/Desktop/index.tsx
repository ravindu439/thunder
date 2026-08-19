// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOCDesktop from '@theme-original/DocItem/TOC/Desktop';
import {Box} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import AIPageActions from '@site/src/components/AIPageActions';

export default function DocItemTOCDesktopWrapper(): JSX.Element {
  const {metadata, frontMatter} = useDoc();
  const isHomePage = metadata.id === 'index';
  const showButtons = !isHomePage && !frontMatter.hide_title;

  return (
    // A single sticky container for the TOC + actions together — the TOC's own built-in
    // sticky positioning is neutralized in custom.css, otherwise it would stay pinned
    // independently while this actions sibling (plain normal-flow content) keeps
    // scrolling with the page underneath it. The TOC and actions are separate flex
    // items so a long TOC scrolls in its own region instead of pushing the actions
    // list out of view.
    <Box
      sx={{
        position: 'sticky',
        top: 'calc(var(--ifm-navbar-height) + 1rem)',
        maxHeight: 'calc(100vh - (var(--ifm-navbar-height) + 2rem))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{minHeight: 0, overflowY: 'auto'}}>
        <TOCDesktop />
      </Box>
      {showButtons && (
        <Box sx={{flexShrink: 0, mt: 2, pl: '0.75rem', pb: 2}}>
          <AIPageActions variant="list" />
        </Box>
      )}
    </Box>
  );
}
