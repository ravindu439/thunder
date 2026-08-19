// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {WrapperProps} from '@docusaurus/types';
import type FooterType from '@theme/Footer';
import {type ReactNode} from 'react';
import Footer from '@site/src/components/Footer';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return <Footer {...props} />;
}
