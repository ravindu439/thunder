// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Content} from '@theme/BlogPostPage';
import {Box, Typography} from '@wso2/oxygen-ui';
import {JSX, useMemo, useState} from 'react';
import BlogCategoryFilter from './BlogCategoryFilter';
import BlogPostCard from './BlogPostCard';
import {getCategory} from './helpers';

export default function BlogGrid({items}: {items: Content[]}): JSX.Element {
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(items.map((content) => getCategory(content)));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(
    () => (filter === 'All' ? items : items.filter((content) => getCategory(content) === filter)),
    [items, filter],
  );

  return (
    <Box sx={{maxWidth: 1200, width: '100%', mx: 'auto', px: {xs: 2, sm: 4}, py: {xs: 4, md: 5}}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3}}>
        <Typography component="h3" sx={{fontSize: '18px', fontWeight: 600, color: 'text.primary'}}>
          Latest posts
        </Typography>
        <BlogCategoryFilter categories={categories} active={filter} onChange={setFilter} />
      </Box>

      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}, gap: 2.5}}>
        {filteredItems.map((content) => (
          <BlogPostCard key={content.metadata.permalink} content={content} />
        ))}
      </Box>
    </Box>
  );
}
