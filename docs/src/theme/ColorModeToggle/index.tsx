// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {WrapperProps} from '@docusaurus/types';
import type ColorModeToggleType from '@theme/ColorModeToggle';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import {useColorScheme} from '@wso2/oxygen-ui';
import {useEffect, useLayoutEffect, type ReactNode} from 'react';

// useLayoutEffect runs synchronously before the browser paints, which ensures the
// dark-mode / light-mode class is on document.body before Scalar (BrowserOnly) reads it.
// Falls back to useEffect in SSR where window is not available to avoid React warnings.
const useSyncLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Props = WrapperProps<typeof ColorModeToggleType>;

export default function ColorModeToggleWrapper(props: Props): ReactNode {
  // MUI color mode setting
  const {systemMode, setMode} = useColorScheme();

  // "value" holds the color theme. Either "light" or "dark"
  const {value} = props;

  // change mode based on "value" prop
  // "dark" or "light" are also used for MUI
  useSyncLayoutEffect(() => {
    setMode(value);

    // Set CSS class on body tag to sync Scalar API Reference theme with the main Docusaurus theme.
    // The dark-mode and light-mode classes are used by Scalar to determine which theme to apply.
    const effectiveMode = value ?? systemMode;

    const applyModeClass = () => {
      document.body.classList.remove('dark-mode', 'light-mode');
      if (effectiveMode) {
        document.body.classList.add(`${effectiveMode}-mode`);
      }
    };

    applyModeClass();

    // Watch for class changes on body element and re-apply mode class if needed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const hasModeClass =
            document.body.classList.contains('dark-mode') || document.body.classList.contains('light-mode');
          if (!hasModeClass && effectiveMode) {
            document.body.classList.add(`${effectiveMode}-mode`);
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [setMode, value, systemMode]);

  return <ColorModeToggle {...props} />;
}
