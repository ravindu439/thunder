// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {OrganizationUnitTreeItem} from '../models/organization-unit-tree';

export default function updateTreeItemChildren(
  items: OrganizationUnitTreeItem[],
  parentId: string,
  children: OrganizationUnitTreeItem[],
): OrganizationUnitTreeItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      return {...item, children};
    }

    if (item.children && item.children.length > 0) {
      return {...item, children: updateTreeItemChildren(item.children, parentId, children)};
    }

    return item;
  });
}
