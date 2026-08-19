// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {WrapperProps} from '@docusaurus/types';
import type SystemColorModeType from '@theme/Icon/SystemColorMode';
import {Monitor} from '@wso2/oxygen-ui-icons-react';
import {type ReactNode} from 'react';

type Props = WrapperProps<typeof SystemColorModeType>;

export default function SystemColorModeWrapper(props: Props): ReactNode {
  return <Monitor {...props} />;
}
