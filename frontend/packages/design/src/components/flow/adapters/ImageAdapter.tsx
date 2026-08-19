// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {resolveLogoUri, type ResolvedLogo} from '@thunderid/react';
import {cn} from '@thunderid/utils';
import {Box} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import type {FlowComponent} from '../../../models/flow';

interface ImageAdapterProps {
  component: FlowComponent;
  resolve: (template: string | undefined) => string | undefined;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

const DEFAULT_EMOJI_CONTAINER_HEIGHT = '4em';

export default function ImageAdapter({
  component,
  resolve,
  maxWidth = '100%',
  maxHeight = '100%',
}: ImageAdapterProps): JSX.Element | null {
  const resolvedSrc = resolve(component.src ?? '') ?? component.src ?? '';
  const resolvedAlt = resolve(component.alt ?? '') ?? component.alt ?? '';

  if (!resolvedSrc) return null;

  const resolvedIcon: ResolvedLogo = resolveLogoUri(resolvedSrc, resolvedAlt);

  if (resolvedIcon.kind === 'emoji') {
    const cssWidth = component.width ? `${component.width}px` : '100%';
    const cssHeight = component.height ? `${component.height}px` : 'auto';

    const isConcrete = (v: string): boolean => v !== 'auto' && !v.endsWith('%');
    let containerHeight: string;
    if (isConcrete(cssHeight)) {
      containerHeight = cssHeight;
    } else if (isConcrete(cssWidth)) {
      containerHeight = cssWidth;
    } else {
      containerHeight = DEFAULT_EMOJI_CONTAINER_HEIGHT;
    }

    return (
      <span
        id={component.id}
        className={[cn('Flow--image'), component.classes].filter(Boolean).join(' ')}
        style={{
          containerType: 'size',
          display: 'inline-grid',
          height: containerHeight,
          placeItems: 'center',
          width: cssWidth,
        }}
      >
        <span aria-label={resolvedAlt} role="img" style={{fontSize: '100cqmin', lineHeight: 1}}>
          {resolvedIcon.glyph}
        </span>
      </span>
    );
  }

  return (
    <Box
      component="img"
      id={component.id}
      className={[cn('Flow--image'), component.classes].filter(Boolean).join(' ')}
      src={resolvedIcon.imgSrc}
      alt={resolvedAlt}
      sx={{
        width: component.width ? `${component.width}px` : 'auto',
        height: component.height ? `${component.height}px` : 'auto',
        maxWidth,
        maxHeight,
        objectFit: 'contain',
      }}
    />
  );
}
