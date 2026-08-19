// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ReactNode} from 'react';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';

export default function ProductName(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.customFields?.product as DocusaurusProductConfig;
  return config.project.name;
}
