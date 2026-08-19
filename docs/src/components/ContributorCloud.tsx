// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {Avatar, Box, Tooltip, Typography} from '@wso2/oxygen-ui';
import React, {useEffect, useState} from 'react';

interface Contributor {
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
  login: string;
}

interface ContributorsData {
  contributors: Contributor[];
  generatedAt: string;
  totalCommits: number;
  totalContributors: number;
}

const MAX_CLOUD = 20;

export default function ContributorCloud(): React.ReactElement | null {
  const {withBaseUrl} = useBaseUrlUtils();
  const [data, setData] = useState<ContributorsData | null>(null);

  useEffect(() => {
    fetch(withBaseUrl('/data/contributors.json'))
      .then((r) => r.json())
      .then((d: ContributorsData) => setData(d))
      .catch(() => undefined);
  }, [withBaseUrl]);

  if (!data || data.contributors.length === 0) {
    return null;
  }

  const preview = data.contributors.slice(0, MAX_CLOUD);
  const remaining = data.contributors.length - MAX_CLOUD;

  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center'}}>
      {preview.map((contributor) => (
        <Tooltip
          key={contributor.login}
          title={
            <Box>
              <Typography variant="body2" sx={{fontWeight: 600, lineHeight: 1.3}}>
                {contributor.login}
              </Typography>
              <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'monospace'}}>
                {contributor.contributions} commits
              </Typography>
            </Box>
          }
          placement="top"
          arrow
        >
          <Avatar
            component="a"
            href={contributor.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            src={contributor.avatarUrl}
            alt={contributor.login}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'scale(1.12)',
                boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}30`,
                zIndex: 1,
                position: 'relative',
              },
            }}
          />
        </Tooltip>
      ))}

      {remaining > 0 && (
        <Avatar
          component="a"
          href="../contributors"
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'transparent',
            border: '1px dashed',
            borderColor: 'primary.main',
            color: 'primary.main',
            fontSize: '0.7rem',
            fontWeight: 700,
            fontFamily: 'monospace',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background 0.18s, border-color 0.18s',
            '&:hover': {
              bgcolor: (theme) => `${theme.palette.primary.main}14`,
            },
          }}
        >
          +{remaining}
        </Avatar>
      )}
    </Box>
  );
}
