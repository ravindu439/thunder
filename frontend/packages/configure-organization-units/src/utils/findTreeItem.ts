// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {OrganizationUnitTreeItem} from '../models/organization-unit-tree';

export default function findTreeItem(
  items: OrganizationUnitTreeItem[],
  id: string,
): OrganizationUnitTreeItem | undefined {
  return items.reduce<OrganizationUnitTreeItem | undefined>((found, item) => {
    if (found) return found;
    if (item.id === id) return item;

    return item.children ? findTreeItem(item.children, id) : undefined;
  }, undefined);
}
