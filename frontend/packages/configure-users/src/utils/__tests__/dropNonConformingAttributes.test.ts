// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import type {PropertyDefinition, UserTypeDefinition} from '../../models/users';
import {attributeConformsToSchema, dropNonConformingOptionalAttributes} from '../dropNonConformingAttributes';

describe('attributeConformsToSchema', () => {
  it('checks primitive types', () => {
    expect(attributeConformsToSchema('hi', {type: 'string'})).toBe(true);
    expect(attributeConformsToSchema(5, {type: 'string'})).toBe(false);
    expect(attributeConformsToSchema(5, {type: 'number'})).toBe(true);
    expect(attributeConformsToSchema('5', {type: 'number'})).toBe(false);
    expect(attributeConformsToSchema(true, {type: 'boolean'})).toBe(true);
    expect(attributeConformsToSchema('true', {type: 'boolean'})).toBe(false);
    expect(attributeConformsToSchema([1], {type: 'array', items: {type: 'number'}})).toBe(true);
    expect(attributeConformsToSchema('x', {type: 'array', items: {type: 'number'}})).toBe(false);
    expect(attributeConformsToSchema({a: 1}, {type: 'object', properties: {}})).toBe(true);
    expect(attributeConformsToSchema([1], {type: 'object', properties: {}})).toBe(false);
  });

  it('checks enum membership', () => {
    const def: PropertyDefinition = {type: 'string', enum: ['ACTIVE', 'INACTIVE']};
    expect(attributeConformsToSchema('ACTIVE', def)).toBe(true);
    expect(attributeConformsToSchema('PENDING', def)).toBe(false);
  });

  it('checks regex and tolerates an unparseable pattern', () => {
    expect(attributeConformsToSchema('abc', {type: 'string', regex: '^[a-z]+$'})).toBe(true);
    expect(attributeConformsToSchema('ABC', {type: 'string', regex: '^[a-z]+$'})).toBe(false);
    // An invalid schema regex can't judge the value, so it is not dropped.
    expect(attributeConformsToSchema('abc', {type: 'string', regex: '('})).toBe(true);
  });
});

describe('dropNonConformingOptionalAttributes', () => {
  const schema: UserTypeDefinition = {
    age: {type: 'number'},
    nickname: {type: 'string'},
    email: {type: 'string', required: true},
  };

  it('drops an optional attribute whose value no longer matches the schema', () => {
    const result = dropNonConformingOptionalAttributes({age: 'not-a-number', nickname: 'jo'}, schema);
    expect(result).toEqual({nickname: 'jo'});
  });

  it('keeps a required attribute even when its value no longer matches', () => {
    const result = dropNonConformingOptionalAttributes({email: 12345}, schema);
    expect(result).toEqual({email: 12345});
  });

  it('keeps conforming values', () => {
    const result = dropNonConformingOptionalAttributes({age: 30, nickname: 'jo'}, schema);
    expect(result).toEqual({age: 30, nickname: 'jo'});
  });

  it('leaves undeclared keys untouched (backend strips those)', () => {
    const result = dropNonConformingOptionalAttributes({stale: 'x', age: 30}, schema);
    expect(result).toEqual({stale: 'x', age: 30});
  });

  it('returns the input unchanged when no schema is available', () => {
    const attrs = {age: 'not-a-number'};
    expect(dropNonConformingOptionalAttributes(attrs, undefined)).toBe(attrs);
  });
});
