// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Drawer, Typography} from '@wso2/oxygen-ui';
import {memo, type ReactElement, type ReactNode} from 'react';

/**
 * Props interface of {@link BuilderStaticPanel}
 */
export interface BuilderStaticPanelProps {
  /**
   * Width of the panel in pixels.
   * @defaultValue 350
   */
  width?: number;
  /**
   * Side the panel is anchored to. Controls the direction of the drop shadow.
   * @defaultValue 'right'
   */
  anchor?: 'left' | 'right';
  /**
   * Optional header content.
   * - Pass a `string` to render a standard uppercase label inside the header bar.
   * - Pass a `ReactNode` for a fully custom header.
   * - Omit to render no header.
   */
  header?: ReactNode;
  /**
   * Additional sx overrides merged into the Drawer paper element.
   */
  paperSx?: object;
  /**
   * Main scrollable content rendered inside the panel body.
   */
  children?: ReactNode;
  /**
   * Whether the panel is open. Controls the expand/collapse state and transition.
   * @defaultValue true
   */
  open?: boolean;
}

/**
 * Persistent, in-flow side panel whose visual style matches {@link BuilderFloatingPanel}.
 *
 * Unlike the floating panel this component is part of the normal document flow — it pushes
 * adjacent content rather than overlaying the canvas. Use it for always-visible config or
 * property panels in a builder layout.
 *
 * @param props - Props injected to the component.
 * @returns The BuilderStaticPanel component.
 */
function BuilderStaticPanel({
  width = 350,
  anchor = 'right',
  header = undefined,
  paperSx = undefined,
  children = undefined,
  open = true,
}: BuilderStaticPanelProps): ReactElement {
  return (
    <Drawer
      variant="persistent"
      anchor={anchor}
      open={open}
      elevation={5}
      sx={{
        width,
        height: '100%',
        flexShrink: 0,
        mr: 1,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
            duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
          }),
        ...(!open && {
          width: 0,
          mr: 0,
        }),
        '& .MuiDrawer-paper': {
          width,
          position: 'relative',
          border: 'none',
          overflow: 'scroll',
          // Padding lives on the body rather than the paper, so the header bar and
          // its divider run the full width of the panel.
          gap: 1,
          ...(paperSx ?? {}),
        },
      }}
    >
      {/* Header bar */}
      {header !== undefined && (
        <Box
          sx={{
            minHeight: 52,
            flexShrink: 0,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {typeof header === 'string' ? <Typography variant="h6">{header}</Typography> : header}
        </Box>
      )}

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          pb: 2,
          pt: header === undefined ? 2 : 0,
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}

export default memo(BuilderStaticPanel);
