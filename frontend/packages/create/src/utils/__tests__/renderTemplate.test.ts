// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, beforeAll} from 'vitest';
import registerHandlebarsHelpers from '../registerHandlebarsHelpers';
import renderTemplate from '../renderTemplate';

describe('renderTemplate', () => {
  beforeAll(() => {
    registerHandlebarsHelpers();
  });

  it('should render a simple template without variables', () => {
    const template = 'Hello, World!';
    const result = renderTemplate(template, {});

    expect(result).toBe('Hello, World!');
  });

  it('should render a template with single variable', () => {
    const template = 'Hello, {{name}}!';
    const result = renderTemplate(template, {name: 'ThunderID'});

    expect(result).toBe('Hello, ThunderID!');
  });

  it('should render a template with multiple variables', () => {
    const template = '{{greeting}}, {{name}}! Welcome to {{app}}.';
    const result = renderTemplate(template, {
      greeting: 'Hi',
      name: 'User',
      app: 'ThunderID',
    });

    expect(result).toBe('Hi, User! Welcome to ThunderID.');
  });

  it('should handle nested object properties', () => {
    const template = 'User: {{user.name}}, Email: {{user.email}}';
    const result = renderTemplate(template, {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    expect(result).toBe('User: John Doe, Email: john@example.com');
  });

  it('should handle conditional blocks', () => {
    const template = '{{#if show}}Visible{{/if}}';

    expect(renderTemplate(template, {show: true})).toBe('Visible');
    expect(renderTemplate(template, {show: false})).toBe('');
  });

  it('should handle loops', () => {
    const template = '{{#each items}}{{this}} {{/each}}';
    const result = renderTemplate(template, {items: ['a', 'b', 'c']});

    expect(result).toBe('a b c ');
  });

  it('should handle missing variables gracefully', () => {
    const template = 'Hello, {{name}}!';
    const result = renderTemplate(template, {});

    expect(result).toBe('Hello, !');
  });

  it('should handle custom helpers if registered', () => {
    const template = '{{camelCase "hello-world"}}';
    const result = renderTemplate(template, {});

    expect(result).toBe('helloWorld');
  });

  it('should handle pascalCase helper', () => {
    const template = '{{pascalCase "hello-world"}}';
    const result = renderTemplate(template, {});

    expect(result).toBe('HelloWorld');
  });

  it('should handle kebabCase helper', () => {
    const template = '{{kebabCase "HelloWorld"}}';
    const result = renderTemplate(template, {});

    expect(result).toBe('hello-world');
  });

  it('should render complex templates with multiple features', () => {
    const template = `
/**
 * {{description}}
 */
export const {{camelCase name}} = {
  {{#each items}}
  {{@key}}: '{{this}}',
  {{/each}}
};
`;

    const result = renderTemplate(template, {
      description: 'Configuration object',
      name: 'my-config',
      items: {
        host: 'localhost',
        port: '3000',
      },
    });

    expect(result).toContain('Configuration object');
    expect(result).toContain('export const myConfig = {');
    expect(result).toContain("host: 'localhost',");
    expect(result).toContain("port: '3000',");
  });
});
