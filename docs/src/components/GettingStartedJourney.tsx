// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import {createGettingStartedSteps} from './GettingStartedSteps';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';
import {useDocsUrl} from '@site/src/hooks/useDocsUrl';

interface GettingStartedJourneyProps {
  current: number; // 1-based index
}

export default function GettingStartedJourney({current}: GettingStartedJourneyProps) {
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.customFields?.product as DocusaurusProductConfig;
  const steps = createGettingStartedSteps(config.project.name);
  const docsUrl = useDocsUrl();

  return (
    <div className="gsj">
      {steps.map((step, i) => {
        const index = i + 1;
        const isDone = index < current;
        const isActive = index === current;
        const isNext = index === current + 1;

        const circleClass = ['gsj__circle', isDone ? 'gsj__circle--done' : '', isActive ? 'gsj__circle--active' : '']
          .filter(Boolean)
          .join(' ');

        const labelClass = ['gsj__label', isActive ? 'gsj__label--active' : '', isDone ? 'gsj__label--done' : '']
          .filter(Boolean)
          .join(' ');

        const content = (
          <div className="gsj__step">
            <div className={circleClass}>
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{index}</span>
              )}
            </div>
            <span className={labelClass}>{step.label}</span>
          </div>
        );

        return (
          <React.Fragment key={step.href}>
            {isNext ? (
              <Link to={docsUrl(step.href)} className="gsj__step-link" aria-label={`Next: ${step.label}`}>
                {content}
              </Link>
            ) : isActive ? (
              <div className="gsj__step-link gsj__step-link--active" aria-current="step">
                {content}
              </div>
            ) : (
              <Link to={docsUrl(step.href)} className="gsj__step-link gsj__step-link--muted">
                {content}
              </Link>
            )}
            {i < steps.length - 1 && (
              <div className={`gsj__connector ${isDone ? 'gsj__connector--done' : ''}`} aria-hidden />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
