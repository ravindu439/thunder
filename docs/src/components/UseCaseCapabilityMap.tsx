// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import './UseCaseCapabilityMap.css';

export interface UseCaseMapNode {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface UseCaseMapGroup {
  id: string;
  label: string;
  nodes: UseCaseMapNode[];
}

interface UseCaseCapabilityMapProps {
  ariaLabel: string;
  root: UseCaseMapNode;
  groups: UseCaseMapGroup[];
}

export function UseCaseCapabilityMap({ ariaLabel, root, groups }: UseCaseCapabilityMapProps) {
  return (
    <nav className="uc-capability-map" aria-label={ariaLabel}>
      <div className="uc-capability-map__canvas">
        <svg className="uc-capability-map__path" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <path d="M500 92 V112" />
          <path d="M500 112 L116 112" />
          <path d="M500 112 L372 112" />
          <path d="M500 112 L628 112" />
          <path d="M500 112 L884 112" />
          <path d="M116 112 V124" />
          <path d="M372 112 V124" />
          <path d="M628 112 V124" />
          <path d="M884 112 V124" />
        </svg>

        <a
          href={root.href}
          className="uc-capability-map__node uc-capability-map__node--root"
        >
          <span className="uc-capability-map__icon" aria-hidden>{root.icon}</span>
          <span className="uc-capability-map__label">{root.label}</span>
        </a>

        {groups.map((group, groupIndex) => (
          <div
            key={group.id}
            className="uc-capability-map__group"
            style={{ gridColumn: groupIndex + 1, gridRow: 2 }}
          >
            <div
              className="uc-capability-map__category"
              style={{ gridColumn: groupIndex + 1, gridRow: 2 }}
            >
              <span className="uc-capability-map__category-label">
                {group.label}
              </span>
            </div>
            {group.nodes.map((node, nodeIndex) => (
              <a
                key={node.id}
                href={node.href}
                className="uc-capability-map__node"
                style={{ gridColumn: groupIndex + 1, gridRow: nodeIndex + 3 }}
              >
                <span className="uc-capability-map__icon" aria-hidden>{node.icon}</span>
                <span className="uc-capability-map__label">{node.label}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
