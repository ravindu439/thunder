// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {OrganizationUnitTreeItem} from '../models/organization-unit-tree';

export default function buildItemMap(items: OrganizationUnitTreeItem[]): Map<string, OrganizationUnitTreeItem> {
  const map = new Map<string, OrganizationUnitTreeItem>();
  const visit = (list: OrganizationUnitTreeItem[]): void => {
    list.forEach((item) => {
      map.set(item.id, item);
      if (item.children) visit(item.children);
    });
  };
  visit(items);

  return map;
}
