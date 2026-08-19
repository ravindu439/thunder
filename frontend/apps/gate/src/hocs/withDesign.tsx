// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DesignProvider, type DesignResolveResponse} from '@thunderid/design';
import {useThunderID} from '@thunderid/react';
import type {JSX, ComponentType} from 'react';

export default function withDesign<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithDesign(props: P): JSX.Element {
    const {meta} = useThunderID();
    return (
      <DesignProvider
        shouldResolveDesignInternally={false}
        design={meta?.design as unknown as DesignResolveResponse | undefined}
      >
        <WrappedComponent {...props} />
      </DesignProvider>
    );
  };
}
