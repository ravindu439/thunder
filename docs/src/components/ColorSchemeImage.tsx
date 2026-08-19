// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import React, {JSX} from 'react';
import useIsDarkMode from '@site/src/hooks/useIsDarkMode';

interface ColorSchemeImageProps {
  src: {
    light: string;
    dark: string;
  };
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
}

export default function ColorSchemeImage({src, alt = '', ...rest}: ColorSchemeImageProps): JSX.Element {
  const isDark = useIsDarkMode();
  return <img src={isDark ? src.dark : src.light} alt={alt} {...rest} />;
}
