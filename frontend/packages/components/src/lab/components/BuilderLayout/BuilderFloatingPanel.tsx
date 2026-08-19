// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Drawer, type DrawerProps} from '@wso2/oxygen-ui';
import {memo, type ReactElement, type ReactNode} from 'react';

/**
 * Props interface of {@link BuilderFloatingPanel}
 */
export interface BuilderFloatingPanelProps {
  /**
   * Whether the panel is open.
   */
  open: boolean;
  /**
   * Callback invoked when the panel is closed.
   */
  onClose: () => void;
  /**
   * Container element for the MUI Modal portal.
   * Typically the element with `id="drawer-container"` that wraps the canvas.
   * @defaultValue undefined
   */
  container?: Element | null;
  /**
   * Width of the panel in pixels.
   * @defaultValue 350
   */
  width?: number;
  /**
   * Side from which the panel slides in.
   * @defaultValue 'right'
   */
  anchor?: DrawerProps['anchor'];
  /**
   * Additional sx overrides merged into the Drawer paper element.
   * Use this to customise positioning, colours, or spacing per usage context.
   */
  paperSx?: object;
  /**
   * Content rendered inside the floating panel.
   */
  children?: ReactNode;
}

/**
 * Floating side panel rendered as an absolutely-positioned temporary Drawer within a canvas container.
 *
 * The panel renders portal-ed inside the provided `container` element (e.g. `#drawer-container`)
 * so it appears to float over the canvas rather than the full viewport.
 * Pointer events are disabled on the backdrop so canvas interactions remain active when the panel is open.
 *
 * @param props - Props injected to the component.
 * @returns The BuilderFloatingPanel component.
 */
function BuilderFloatingPanel({
  open,
  onClose,
  container = undefined,
  width = 350,
  anchor = 'right',
  paperSx = undefined,
  children = undefined,
  ...rest
}: BuilderFloatingPanelProps): ReactElement {
  return (
    <Drawer
      open={open}
      anchor={anchor}
      onClose={onClose}
      elevation={5}
      slotProps={{
        paper: {
          sx: {
            width,
            p: 2,
            boxShadow: '-2px 0px 12px 0 rgba(0, 0, 0, 0.08)',
            top: '66px',
            bottom: '8px',
            height: 'calc(100% - 72px)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            ...(anchor === 'left' ? {left: '8px'} : {right: '8px'}),
            ...(paperSx ?? {}),
          },
          style: {position: 'absolute'},
        },
        backdrop: {
          style: {position: 'absolute'},
        },
      }}
      ModalProps={{
        container,
        keepMounted: true,
        style: {pointerEvents: 'none'},
      }}
      sx={{pointerEvents: 'none'}}
      hideBackdrop
      variant="temporary"
      {...rest}
    >
      {children}
    </Drawer>
  );
}

export default memo(BuilderFloatingPanel);
