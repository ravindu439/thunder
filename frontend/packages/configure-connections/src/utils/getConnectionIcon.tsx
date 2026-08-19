// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Google, GitHub} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import {IdentityProviderTypes} from '../models/identity-provider';

/**
 * Get the identity provider icon component for a given provider type.
 *
 * Returns the appropriate icon component based on the identity provider type.
 * Supports common social login providers like Google and GitHub.
 *
 * @param type - The identity provider type (e.g., 'GOOGLE', 'GITHUB')
 * @returns The corresponding JSX icon component, or `null` if the type is not supported
 *
 * @public
 * @example
 * ```tsx
 * const icon = getIcon(IdentityProviderTypes.GOOGLE); // Returns <Google />
 * const unknownIcon = getIcon('UNKNOWN'); // Returns null
 * ```
 */
const getConnectionIcon = (type: string): JSX.Element | null => {
  if (type === IdentityProviderTypes.GOOGLE) return <Google />;
  if (type === IdentityProviderTypes.GITHUB) return <GitHub />;

  return null;
};

export default getConnectionIcon;
