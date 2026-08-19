// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import OrganizationUnitTreeConstants from '../constants/organization-unit-tree-constants';
import type {OrganizationUnitTreeItem} from '../models/organization-unit-tree';

export default function appendTreeItemChildren(
  items: OrganizationUnitTreeItem[],
  parentId: string,
  newChildren: OrganizationUnitTreeItem[],
): OrganizationUnitTreeItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      const existing = (item.children ?? []).filter(
        (c) => !c.id.endsWith(OrganizationUnitTreeConstants.LOAD_MORE_SUFFIX),
      );

      return {...item, children: [...existing, ...newChildren]};
    }

    if (item.children && item.children.length > 0) {
      return {...item, children: appendTreeItemChildren(item.children, parentId, newChildren)};
    }

    return item;
  });
}
