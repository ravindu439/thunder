// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Box, Container, Typography, useTheme} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import useIsDarkMode from '../../hooks/useIsDarkMode';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import {DocusaurusProductConfig} from '@site/docusaurus.product.config';

export default function WorkflowSection(): JSX.Element {
  const isDark = useIsDarkMode();
  const theme = useTheme();
  const {ref, isVisible} = useScrollAnimation({threshold: 0.2});
  const {siteConfig} = useDocusaurusContext();
  const productName = (siteConfig.customFields?.product as DocusaurusProductConfig).project.name;

  return (
    <Box
      sx={{
        py: {xs: 8, lg: 12},
        position: 'relative',
        borderTop: '1px solid',
        borderColor: 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? `radial-gradient(ellipse at 50% 50%, rgba(${theme.vars?.palette.primary.main} / 0.07) 0%, transparent 60%)`
            : `radial-gradient(ellipse at 50% 50%, rgba(${theme.vars?.palette.primary.main} / 0.04) 0%, transparent 60%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{px: {xs: 2, sm: 4}, position: 'relative', zIndex: 1}}>
        <Box
          ref={ref}
          sx={{
            textAlign: 'center',
            maxWidth: '720px',
            mx: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: {xs: '1.75rem', sm: '2.25rem', md: '2.5rem'},
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Built around your workflow,{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${theme.vars?.palette.primary.dark} 0%, ${theme.vars?.palette.primary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              optimized for productivity
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: {xs: '0.95rem', sm: '1.1rem'},
              lineHeight: 1.7,
              color: 'text.secondary',
            }}
          >
            {productName} is engineered from the ground up to fit your workflows and toolbox, not dictate them.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
