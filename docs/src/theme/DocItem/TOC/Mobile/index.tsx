// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TOCMobile from '@theme-original/DocItem/TOC/Mobile';
import {Box} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import AIPageActions from '@site/src/components/AIPageActions';

export default function DocItemTOCMobileWrapper(): JSX.Element {
  const {metadata, frontMatter} = useDoc();
  const isHomePage = metadata.id === 'index';
  const showButtons = !isHomePage && !frontMatter.hide_title;

  return (
    <>
      <TOCMobile />
      {showButtons && (
        // The mobile TOC wrapper stays mounted at all viewport widths (only CSS-hidden
        // above 996px), so this needs the same breakpoint to avoid double buttons.
        <Box sx={{mb: 2, '@media (min-width: 997px)': {display: 'none'}}}>
          <AIPageActions />
        </Box>
      )}
    </>
  );
}
