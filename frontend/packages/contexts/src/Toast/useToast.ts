// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import ToastContext, {type ToastContextType} from './ToastContext';

/**
 * React hook for triggering toast notifications from any component within a `ToastProvider`.
 *
 * This hook provides access to the `showToast` function exposed by `ToastContext`.
 * It must be called inside a component tree that is wrapped by `ToastProvider`,
 * otherwise it will throw an error.
 *
 * @returns The toast context containing the `showToast` function
 *
 * @throws {Error} Throws if called outside of a `ToastProvider`
 *
 * @example
 * Basic usage in a component:
 * ```tsx
 * import useToast from './useToast';
 *
 * function SaveButton() {
 *   const { showToast } = useToast();
 *
 *   return (
 *     <button onClick={() => showToast('Saved successfully!', 'success')}>
 *       Save
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * Usage in a TanStack Query mutation hook:
 * ```ts
 * import useToast from './useToast';
 * import { useMutation } from '@tanstack/react-query';
 *
 * function useDeleteItem() {
 *   const { showToast } = useToast();
 *
 *   return useMutation({
 *     mutationFn: deleteItem,
 *     onSuccess: () => showToast('Item deleted.', 'success'),
 *     onError: () => showToast('Failed to delete item.', 'error'),
 *   });
 * }
 * ```
 *
 * @public
 */
export default function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
