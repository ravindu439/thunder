// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Google, GitHub} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';

/**
 * Get the identity provider icon component based on the label or image URL/path.
 *
 * Returns the appropriate icon component by analyzing either the label text or image path/URL.
 * Supports common social login providers like Google and GitHub.
 *
 * @param label - The label text that identifies the identity provider (e.g., 'Continue with Google', 'Google')
 * @param image - The image URL or path that identifies the identity provider (e.g., 'assets/images/icons/google.svg')
 * @returns The corresponding JSX icon component, or `null` if the provider cannot be identified
 */
const getIntegrationIcon = (label: string, image: string): JSX.Element | null => {
  if (label.includes('google') || image.includes('google')) return <Google />;
  if (label.includes('github') || image.includes('github')) return <GitHub />;

  return null;
};

export default getIntegrationIcon;
