// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {BlogPostProvider, useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogPostPage';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import BlogPostPageStructuredData from '@theme/BlogPostPage/StructuredData';
import ContentVisibility from '@theme/ContentVisibility';
import Layout from '@theme/Layout';
import {Box} from '@wso2/oxygen-ui';
import clsx from 'clsx';
import type {ReactNode} from 'react';
import BlogPostFooterNav from '@site/src/components/Blog/BlogPostFooterNav';
import BlogPostHero from '@site/src/components/Blog/BlogPostHero';
import BlogPostProse from '@site/src/components/Blog/BlogPostProse';
import BlogPostSidebar from '@site/src/components/Blog/BlogPostSidebar';

function BlogPostPageContent({sidebar, children}: {sidebar: Props['sidebar']; children: ReactNode}): ReactNode {
  const content = useBlogPost();
  const {metadata} = content;

  return (
    <Layout>
      <ContentVisibility metadata={metadata} />
      <BlogPostHero content={content} />
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: {xs: 2, sm: 4},
          pt: {xs: 5, md: 7},
          pb: {xs: 6, md: 9},
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', md: 'minmax(0, 1fr) 280px'},
          gap: {xs: 5, md: 8},
          alignItems: 'start',
        }}
      >
        <Box component="article">
          <BlogPostProse>{children}</BlogPostProse>
          <BlogPostFooterNav content={content} />
        </Box>
        <BlogPostSidebar content={content} sidebar={sidebar} />
      </Box>
    </Layout>
  );
}

export default function BlogPostPage(props: Props): ReactNode {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
