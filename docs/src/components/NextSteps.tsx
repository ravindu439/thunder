// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Link from '@docusaurus/Link';
import {ReactNode} from 'react';

/* ─── NextStepsCard ───────────────────────────────────────────────────────── */

interface NextStepsCardProps {
  title: string;
  description?: string;
  href: string;
  step?: number;
  cta?: string;
}

export function NextStepsCard({
  title,
  description = undefined,
  href,
  step = undefined,
  cta = undefined,
}: NextStepsCardProps) {
  const isExternal = href.startsWith('http');
  const ctaLabel = cta ?? `Go to ${title}`;

  return (
    <Link
      to={href}
      {...(isExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      style={{textDecoration: 'none', display: 'block'}}
    >
      <div className="next-steps-card">
        <span className="next-steps-card__title">{step != null ? `Step ${step} → ${title}` : title}</span>
        {description && <span className="next-steps-card__desc">{description}</span>}
        <span className="next-steps-card__cta">{ctaLabel} →</span>
      </div>
    </Link>
  );
}

/* ─── NextStepsGroup ──────────────────────────────────────────────────────── */

interface NextStepsGroupProps {
  label: string;
  children: ReactNode;
}

export function NextStepsGroup({label, children}: NextStepsGroupProps) {
  return (
    <div className="next-steps-group">
      <span className="next-steps-group__label">{label}</span>
      <div className="next-steps-group__cards">{children}</div>
    </div>
  );
}

/* ─── NextSteps (wrapper) ─────────────────────────────────────────────────── */

interface NextStepsProps {
  children: ReactNode;
}

export function NextSteps({children}: NextStepsProps) {
  return <div className="next-steps">{children}</div>;
}
