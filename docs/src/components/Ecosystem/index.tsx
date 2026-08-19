// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Box} from '@wso2/oxygen-ui';
import {JSX, useMemo, useState} from 'react';
import {ECOSYSTEM_ITEMS, EcosystemCategory} from './data';
import EcosystemCTA from './EcosystemCTA';
import EcosystemGrid from './EcosystemGrid';
import EcosystemHero from './EcosystemHero';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';

export default function EcosystemPage(): JSX.Element {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | EcosystemCategory>('all');
  const {siteConfig} = useDocusaurusContext();
  const productName = (siteConfig.customFields?.product as DocusaurusProductConfig).project.name;

  const items = useMemo(
    () => ECOSYSTEM_ITEMS.map((item) => ({...item, description: item.description.replace(/\{\{ProductName\}\}/g, productName)})),
    [productName],
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.packageName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  return (
    <Box>
      <EcosystemHero query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory} />
      <EcosystemGrid query={query} items={filteredItems} />
      <EcosystemCTA />
    </Box>
  );
}
