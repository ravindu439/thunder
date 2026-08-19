// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {Box, Button, Typography} from '@wso2/oxygen-ui';
import {DownloadIcon} from '@wso2/oxygen-ui-icons-react';
import React, {useEffect, useMemo, useState} from 'react';
import type {ReleaseAssetInput, ReleasesData} from '@site/src/utils/downloadAssets';

/**
 * Props for the SampleDownload component.
 */
interface SampleDownloadProps {
  /**
   * Sample name prefix, matching the asset filename before the version segment.
   * For example, `sample-app-wayfinder` matches `sample-app-wayfinder-1.0.0.zip`.
   */
  sample: string;
}

/**
 * Renders a download button for the latest release asset whose filename begins with the given
 * sample name prefix followed by a version segment (e.g. `sample-app-wayfinder-1.0.0.zip`).
 * Shows a fallback message if the asset cannot be found.
 */
export default function SampleDownload({sample}: SampleDownloadProps): React.ReactElement | null {
  const {withBaseUrl} = useBaseUrlUtils();
  const [asset, setAsset] = useState<ReleaseAssetInput | null>(null);
  const [tag, setTag] = useState('');
  const [errored, setErrored] = useState(false);

  const pattern = useMemo(() => {
    const escaped = sample.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escaped}-[0-9A-Za-z.+-]+\\.zip$`, 'i');
  }, [sample]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(withBaseUrl('/data/releases.json'), {signal: controller.signal})
      .then((r) => r.json() as Promise<ReleasesData>)
      .then((data) => {
        const release = data.latestRelease ?? data.releases?.[0];
        if (!release) {
          setErrored(true);
          return;
        }
        const match = release.assets.find((a) => pattern.test(a.name));
        if (!match) {
          setErrored(true);
          return;
        }
        setErrored(false);
        setTag(release.tagName);
        setAsset(match);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setErrored(true);
      });
    return () => controller.abort();
  }, [withBaseUrl, pattern]);

  if (errored) {
    return <p>The sample distribution is currently unavailable. Please check back soon.</p>;
  }

  if (!asset) return null;

  return (
    <Box
      sx={{
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.5,
      }}
    >
      <Box sx={{alignItems: 'center', display: 'flex', gap: 2.5}}>
        {tag && <Typography variant="body2">{tag}</Typography>}
        {asset.sizeLabel && <Typography variant="body2">{asset.sizeLabel}</Typography>}
        <Typography variant="body2">{asset.name}</Typography>
      </Box>
      <Button
        variant="contained"
        href={asset.downloadUrl}
        target="_blank"
        rel="noreferrer"
        endIcon={<DownloadIcon size={16} />}
        sx={{borderRadius: '999px', fontWeight: 600, px: 3, py: 1.25, textTransform: 'none'}}
      >
        Download
      </Button>
    </Box>
  );
}
