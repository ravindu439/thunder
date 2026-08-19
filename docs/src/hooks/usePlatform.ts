// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';
import {type DetectedPlatform, detectPlatform} from '../utils/platform';

export default function usePlatform(): DetectedPlatform | null {
  const [platform, setPlatform] = useState<DetectedPlatform | null>(null);

  useEffect(() => {
    let mounted = true;
    detectPlatform()
      .then((p) => {
        if (mounted) setPlatform(p);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return platform;
}
