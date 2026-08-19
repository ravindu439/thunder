// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {EmbeddedFlowComponent} from '@thunderid/react';
import {describe, expect, it} from 'vitest';
import {findComponentById, resolveAnchorActionRef, resolveHoverTarget} from '../richTextClickResolution';

/**
 * These target `EventTarget | null`, matching the real DOM events the preview's
 * iframe delivers; unlike `instanceof Element` checks, plain DOM elements
 * created via `document.createElement` here behave identically to elements from
 * another realm (e.g. an iframe), which is the whole point of these helpers.
 */
describe('findComponentById', () => {
  // `EmbeddedFlowComponent` resolves to an error type here because `@thunderid/react` has no `types` condition in
  // its `exports` map, and this package's `tsconfig.spec.json` forces `module: commonjs` against a
  // `moduleResolution: bundler` base, so the checker falls back to the untyped CJS entry point.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const tree: EmbeddedFlowComponent = {
    id: 'root',
    components: [
      {id: 'child-a'} as EmbeddedFlowComponent,
      {id: 'child-b', components: [{id: 'grandchild'} as EmbeddedFlowComponent]} as EmbeddedFlowComponent,
    ],
  } as EmbeddedFlowComponent;

  it('should return the root when its id matches', () => {
    expect(findComponentById(tree, 'root')).toBe(tree);
  });

  it('should find a nested component by id', () => {
    expect(findComponentById(tree, 'grandchild')).toEqual({id: 'grandchild'});
  });

  it('should return null when no component matches', () => {
    expect(findComponentById(tree, 'missing')).toBeNull();
  });
});

describe('resolveAnchorActionRef', () => {
  it('should read data-action-ref from the clicked anchor', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('data-action-ref', 'action_recovery');
    document.body.appendChild(anchor);

    expect(resolveAnchorActionRef(anchor)).toBe('action_recovery');

    document.body.removeChild(anchor);
  });

  it('should resolve through a nested click target via closest', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('data-action-ref', 'action_recovery');
    const span = document.createElement('span');
    anchor.appendChild(span);
    document.body.appendChild(anchor);

    expect(resolveAnchorActionRef(span)).toBe('action_recovery');

    document.body.removeChild(anchor);
  });

  it('should return null when the target is not inside an anchor', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    expect(resolveAnchorActionRef(div)).toBeNull();

    document.body.removeChild(div);
  });

  it('should return null when the anchor has no data-action-ref', () => {
    const anchor = document.createElement('a');
    document.body.appendChild(anchor);

    expect(resolveAnchorActionRef(anchor)).toBeNull();

    document.body.removeChild(anchor);
  });

  it('should fall back to parentElement for a target without closest (e.g. a text node)', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('data-action-ref', 'action_recovery');
    const text = document.createTextNode('Reset');
    anchor.appendChild(text);
    document.body.appendChild(anchor);

    expect(resolveAnchorActionRef(text)).toBe('action_recovery');

    document.body.removeChild(anchor);
  });

  it('should return null for a null target', () => {
    expect(resolveAnchorActionRef(null)).toBeNull();
  });
});

describe('resolveHoverTarget', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- see the `no-unsafe-assignment` disable above.
  const component: EmbeddedFlowComponent = {
    id: 'block_001',
    components: [{id: 'action_001'} as EmbeddedFlowComponent],
  } as EmbeddedFlowComponent;

  it('should resolve to the specific button component under the pointer', () => {
    const button = document.createElement('button');
    button.id = 'action_001';
    document.body.appendChild(button);

    expect(resolveHoverTarget(component, button)).toEqual({id: 'action_001'});

    document.body.removeChild(button);
  });

  it('should resolve to a synthetic component carrying the anchor action ref', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('data-action-ref', 'action_recovery');
    document.body.appendChild(anchor);

    expect(resolveHoverTarget(component, anchor)).toEqual({id: 'action_recovery'});

    document.body.removeChild(anchor);
  });

  it('should fall back to the whole component when neither a button nor a wired anchor is hovered', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    expect(resolveHoverTarget(component, div)).toBe(component);

    document.body.removeChild(div);
  });
});
