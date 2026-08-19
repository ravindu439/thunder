// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, {lazy, Suspense} from 'react';

const GitHubButtonInner = lazy(() => import('./GitHubButtonInner'));

interface ProductCustomFields {
  project: {
    source: {
      github: {
        fullName: string;
        url: string;
      };
    };
  };
}

interface Props {
  mobile?: boolean;
}

export default function GitHubStarButton({mobile = false}: Props): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const {project} = siteConfig.customFields?.product as ProductCustomFields;
  const {fullName, url} = project.source.github;

  const button = (
    <BrowserOnly>
      {() => (
        <Suspense fallback={null}>
          <GitHubButtonInner url={url} fullName={fullName} />
        </Suspense>
      )}
    </BrowserOnly>
  );

  if (mobile) {
    return (
      <li className="menu__list-item">
        <div className="navbar__github-star navbar__github-star--mobile">{button}</div>
      </li>
    );
  }

  return <div className="navbar__github-star">{button}</div>;
}
