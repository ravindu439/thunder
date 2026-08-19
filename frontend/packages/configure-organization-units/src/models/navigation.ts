// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Organization Unit Navigation State
 *
 * State passed via React Router when navigating between organization units.
 * Used to track the source OU for proper back navigation in the edit page.
 *
 * @public
 * @remarks
 * This state is passed through `useNavigate` and consumed via `useLocation().state`.
 * It enables the "Back to [OU Name]" navigation link in the edit page header.
 *
 * @example
 * ```typescript
 * // Navigating to a child OU from a parent
 * navigate(routes.detail(childId), {
 *   state: {
 *     fromOU: { id: parentId, name: parentName }
 *   } satisfies OUNavigationState
 * });
 * ```
 */
export interface OUNavigationState {
  /** The source organization unit that was navigated away from */
  fromOU: {
    /** ID of the source organization unit */
    id: string;
    /** Display name of the source organization unit */
    name: string;
  };
}
