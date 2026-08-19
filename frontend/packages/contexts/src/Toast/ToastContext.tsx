// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type Context, createContext} from 'react';

/**
 * Severity level for a toast notification.
 *
 * @public
 */
export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast context interface that provides access to the global toast notification system.
 *
 * @public
 */
export interface ToastContextType {
  /**
   * Displays a toast notification with the given message and severity.
   *
   * @param message - The text to display inside the toast
   * @param severity - The visual style of the toast. Defaults to `'success'`
   * @param durationMs - How long the toast stays open, in milliseconds. Defaults to 6000
   */
  showToast: (message: string, severity?: ToastSeverity, durationMs?: number) => void;
}

/**
 * React context for triggering toast notifications from anywhere in the component tree.
 *
 * This context provides a `showToast` function that renders a temporary snackbar message
 * at the bottom-right of the screen. It should be consumed via the `useToast` hook
 * inside a component tree wrapped by `ToastProvider`.
 *
 * @example
 * ```tsx
 * import ToastContext from './ToastContext';
 * import { useContext } from 'react';
 *
 * const MyComponent = () => {
 *   const context = useContext(ToastContext);
 *   if (!context) {
 *     throw new Error('Component must be used within ToastProvider');
 *   }
 *
 *   return <button onClick={() => context.showToast('Done!', 'success')}>Save</button>;
 * };
 * ```
 *
 * @public
 */
const ToastContext: Context<ToastContextType | undefined> = createContext<ToastContextType | undefined>(undefined);

export default ToastContext;
