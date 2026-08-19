// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AppBreadcrumbs, Box, IconButton, LinearProgress} from '@wso2/oxygen-ui';
import {X} from '@wso2/oxygen-ui-icons-react';
import type {ComponentProps, JSX, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';

export interface FullScreenCreationWizardLayoutProps {
  /**
   * Breadcrumb items rendered in the header, next to the close button.
   */
  breadcrumbItems: ComponentProps<typeof AppBreadcrumbs>['items'];

  /**
   * Invoked when the close (X) button is clicked.
   */
  onClose: () => void;

  /**
   * Overall wizard progress, 0-100. Rendered as a bar along the very top edge of the screen.
   */
  progress: number;

  /**
   * Step content, always left-aligned in a constrained column, whether or not a preview panel is
   * shown alongside it (steps toggling the panel on/off shouldn't also shift the content's
   * position).
   */
  children: ReactNode;

  /**
   * Optional live preview panel shown on the right half of the screen. Omit to let `children`
   * take the full content width (e.g. for steps with no visual result to preview yet).
   */
  preview?: ReactNode;

  /**
   * Max width of the content column, in px. Defaults to 800 to keep form-like steps narrow and
   * readable. Pass `false` for steps whose content is meant to fill the available width instead
   * (e.g. a multi-column template grid).
   */
  contentMaxWidth?: number | false;

  /**
   * Footer action row (Back/Continue/Finish buttons, spinners, etc). Rendered directly below the
   * step content, inside the same scrollable column, so it moves with the form instead of
   * floating in a separate bar.
   */
  footer: ReactNode;
}

/**
 * Full-screen chrome for multi-step creation wizards: a close+breadcrumb header, a progress
 * bar, and a content area that scrolls independently (optionally split with a live preview
 * panel). The footer action row is rendered directly below the step content, in the same column,
 * so it stays together with the form instead of being pinned to the viewport.
 *
 * Meant to be mounted full-screen, outside any app chrome (sidebar/nav).
 */
export default function FullScreenCreationWizardLayout({
  breadcrumbItems,
  onClose,
  progress,
  children,
  preview = undefined,
  contentMaxWidth = 800,
  footer,
}: FullScreenCreationWizardLayoutProps): JSX.Element {
  const {t} = useTranslation('common');

  return (
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <LinearProgress variant="determinate" value={progress} sx={{height: 6, flexShrink: 0}} />

      <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row'}}>
        <Box sx={{flex: preview ? '0 0 50%' : 1, display: 'flex', flexDirection: 'column', minHeight: 0}}>
          <Box sx={{p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
              <IconButton
                onClick={onClose}
                aria-label={t('actions.close', 'Close')}
                sx={{bgcolor: 'background.paper', '&:hover': {bgcolor: 'action.hover'}, boxShadow: 1}}
              >
                <X size={24} />
              </IconButton>
              <AppBreadcrumbs items={breadcrumbItems} />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              py: 4,
              px: {xs: 4, md: 10},
              width: '100%',
            }}
          >
            <Box sx={{width: '100%', maxWidth: contentMaxWidth === false ? 'none' : contentMaxWidth}}>
              {children}
              <Box sx={{mt: 6}}>{footer}</Box>
            </Box>
          </Box>
        </Box>

        {preview && <Box sx={{flex: '0 0 50%', display: 'flex', flexDirection: 'column'}}>{preview}</Box>}
      </Box>
    </Box>
  );
}
