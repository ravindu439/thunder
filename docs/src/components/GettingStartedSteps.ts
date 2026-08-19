// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface JourneyStep {
  label: string;
  href: string;
  docIds: string[];
}

export function createGettingStartedSteps(productName: string): JourneyStep[] {
  return [
    {
      label: `Run ${productName}`,
      href: '/docs/next/getting-started/get-thunderid',
      docIds: ['getting-started/get-thunderid'],
    },
    {
      label: 'Register an app',
      href: '/docs/next/getting-started/register-an-application',
      docIds: ['getting-started/register-an-application'],
    },
    {
      label: 'Build a flow',
      href: '/docs/next/getting-started/build-a-flow',
      docIds: ['getting-started/build-a-flow'],
    },
    {
      label: 'Connect your app',
      href: '/docs/next/getting-started/connect-your-application',
      docIds: [
        'getting-started/connect-your-application/index',
        'getting-started/connect-your-application/react',
        'getting-started/connect-your-application/vue',
        'getting-started/connect-your-application/browser',
        'getting-started/connect-your-application/express',
        'getting-started/connect-your-application/nuxt',
        'getting-started/connect-your-application/node',
        'getting-started/connect-your-application/nextjs',
      ],
    },
  ];
}

const STEP_DOC_IDS: string[][] = [];

export function getGettingStartedStepIndex(docId?: string): number | null {
  if (!docId) {
    return null;
  }

  const stepIndex = STEP_DOC_IDS.findIndex((ids) => ids.includes(docId));

  return stepIndex >= 0 ? stepIndex + 1 : null;
}
