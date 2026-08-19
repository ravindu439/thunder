// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Context, Dispatch, SetStateAction} from 'react';
import {createContext} from 'react';
import type {OrganizationUnitTreeItem} from '../models/organization-unit-tree';

/**
 * Organization Unit Context Type
 *
 * Defines the shape of the organization unit context value.
 * Provides tree state management for the organization unit sidebar tree view.
 *
 * @internal
 * @remarks
 * This context is provided by {@link OrganizationUnitProvider} and consumed
 * via the {@link useOrganizationUnit} hook.
 */
export interface OrganizationUnitContextType {
  /** Current tree items displayed in the sidebar */
  treeItems: OrganizationUnitTreeItem[];
  /** Setter for tree items */
  setTreeItems: Dispatch<SetStateAction<OrganizationUnitTreeItem[]>>;
  /** IDs of currently expanded tree nodes */
  expandedItems: string[];
  /** Setter for expanded items */
  setExpandedItems: Dispatch<SetStateAction<string[]>>;
  /** Set of OU IDs whose children have been loaded */
  loadedItems: Set<string>;
  /** Setter for loaded items */
  setLoadedItems: Dispatch<SetStateAction<Set<string>>>;
  /** Clears treeItems and loadedItems, forcing a re-fetch. Preserves expandedItems so the tree re-expands after rebuild. */
  resetTreeState: () => void;
}

const OrganizationUnitContext: Context<OrganizationUnitContextType | null> =
  createContext<OrganizationUnitContextType | null>(null);

export default OrganizationUnitContext;
