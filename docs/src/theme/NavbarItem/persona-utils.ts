// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export type Persona = 'all' | 'app' | 'iam' | 'devops';

export const STORAGE_KEY = 'product-docs-persona';

export interface PersonaOption {
  value: Persona;
  label: string;
  description: string;
}

export function getPersonaOptions(productName: string): PersonaOption[] {
  return [
    {value: 'all', label: 'All Roles', description: 'Browse all documentation'},
    {value: 'app', label: 'Application Developer', description: `Integrate ${productName} into your app`},
    {value: 'iam', label: 'IAM Developer', description: `Configure and manage ${productName}`},
    {value: 'devops', label: 'DevOps Engineer', description: `Deploy and operate ${productName}`},
  ];
}

export function applyPersona(persona: Persona): void {
  const html = document.documentElement;
  if (persona === 'all') {
    html.removeAttribute('data-persona');
  } else {
    html.setAttribute('data-persona', persona);
  }
}
