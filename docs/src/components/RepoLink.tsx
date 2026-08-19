// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ReactNode} from 'react';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';

export default function RepoLink({path = '', children}: {path?: string; children: ReactNode}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.customFields?.product as DocusaurusProductConfig;
  return <Link href={config.project.source.github.url + path}>{children}</Link>;
}
