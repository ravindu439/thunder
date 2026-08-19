// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0


import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/BlogListPage';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import BlogListPaginator from '@theme/BlogListPaginator';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import {Box} from '@wso2/oxygen-ui';
import clsx from 'clsx';
import {type ReactNode} from 'react';
import BlogFeaturedCard from '@site/src/components/Blog/BlogFeaturedCard';
import BlogGrid from '@site/src/components/Blog/BlogGrid';
import BlogHeader from '@site/src/components/Blog/BlogHeader';
import {isFeatured} from '@site/src/components/Blog/helpers';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items} = props;
  const allContent = items.map((item) => item.content);
  const featured = allContent.find((content) => isFeatured(content));
  const gridItems = featured ? allContent.filter((content) => content !== featured) : allContent;

  return (
    <Layout>
      <BlogHeader />
      {featured && <BlogFeaturedCard content={featured} />}
      {gridItems.length > 0 && <BlogGrid items={gridItems} />}
      <Box sx={{maxWidth: 1200, width: '100%', mx: 'auto', px: {xs: 2, sm: 4}}}>
        <BlogListPaginator metadata={metadata} />
      </Box>
    </Layout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
