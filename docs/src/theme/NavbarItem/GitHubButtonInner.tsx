// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import GitHubButton from 'react-github-btn';

interface GitHubButtonInnerProps {
  url: string;
  fullName: string;
}

export default function GitHubButtonInner({url, fullName}: GitHubButtonInnerProps): React.ReactElement {
  return (
    <GitHubButton
      href={url}
      data-color-scheme="no-preference: light; light: light; dark: dark;"
      data-size="large"
      data-icon="octicon-star"
      aria-label={`Star ${fullName} on GitHub`}
    >
      Star
    </GitHubButton>
  );
}
