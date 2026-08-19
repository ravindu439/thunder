// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import {type ReactNode, useEffect, useRef} from 'react';
import GettingStartedJourney from '@site/src/components/GettingStartedJourney';
import {getGettingStartedStepIndex} from '@site/src/components/GettingStartedSteps';

function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: {children: ReactNode}): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const {metadata} = useDoc();
  const currentJourneyStep = getGettingStartedStepIndex(metadata.id);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const journeyContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentJourneyStep === null) {
      return;
    }

    const container = containerRef.current;
    const journeyContainer = journeyContainerRef.current;

    if (!container || !journeyContainer) {
      return;
    }

    const title = container.querySelector('h1');

    if (!title) {
      return;
    }

    const titleBlock = title.closest('header') ?? title;

    if (titleBlock.parentElement === container) {
      titleBlock.insertAdjacentElement('afterend', journeyContainer);
    }
  }, [currentJourneyStep, metadata.id]);

  return (
    <div ref={containerRef} className="theme-doc-markdown markdown doc-content-with-copy-btn">
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      {currentJourneyStep !== null && (
        <div ref={journeyContainerRef}>
          <GettingStartedJourney current={currentJourneyStep} />
        </div>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
