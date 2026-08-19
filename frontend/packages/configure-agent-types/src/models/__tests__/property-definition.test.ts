// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import type {
  AgentTypeDefinition,
  ArrayItemDefinition,
  ArrayPropertyDefinition,
  BooleanPropertyDefinition,
  NumberPropertyDefinition,
  ObjectPropertyDefinition,
  PropertyDefinition,
  PropertyType,
  SchemaPropertyInput,
  StringPropertyDefinition,
  UIPropertyType,
} from '../property-definition';

describe('property-definition types', () => {
  it('accepts a string property definition', () => {
    const prop: StringPropertyDefinition = {
      type: 'string',
      required: true,
      enum: ['foo', 'bar'],
      regex: '^[a-z]+$',
    };
    expect(prop.type).toBe('string');
    expect(prop.required).toBe(true);
  });

  it('accepts a number property definition', () => {
    const prop: NumberPropertyDefinition = {type: 'number', required: false};
    expect(prop.type).toBe('number');
  });

  it('accepts a boolean property definition', () => {
    const prop: BooleanPropertyDefinition = {type: 'boolean'};
    expect(prop.type).toBe('boolean');
  });

  it('accepts an object property with nested properties', () => {
    const prop: ObjectPropertyDefinition = {
      type: 'object',
      properties: {nested: {type: 'string'}},
    };
    expect(Object.keys(prop.properties)).toContain('nested');
  });

  it('accepts an array property with primitive items', () => {
    const items: ArrayItemDefinition = {type: 'string', enum: ['a', 'b']};
    const prop: ArrayPropertyDefinition = {type: 'array', items};
    expect(prop.items.type).toBe('string');
  });

  it('accepts an array property with object items', () => {
    const items: ArrayItemDefinition = {
      type: 'object',
      properties: {field: {type: 'number'}},
    };
    const prop: ArrayPropertyDefinition = {type: 'array', items};
    expect(prop.items.type).toBe('object');
  });

  it('accepts the discriminated PropertyDefinition union', () => {
    const def: PropertyDefinition = {type: 'string'};
    expect(def.type).toBe('string');
  });

  it('accepts an AgentTypeDefinition map', () => {
    const schema: AgentTypeDefinition = {
      foo: {type: 'string'},
      bar: {type: 'number'},
    };
    expect(Object.keys(schema)).toEqual(['foo', 'bar']);
  });

  it('constrains PropertyType to known values', () => {
    const types: PropertyType[] = ['string', 'number', 'boolean', 'array', 'object'];
    expect(types).toHaveLength(5);
  });

  it('extends UIPropertyType with `enum`', () => {
    const ui: UIPropertyType = 'enum';
    expect(ui).toBe('enum');
  });

  it('accepts SchemaPropertyInput shape', () => {
    const input: SchemaPropertyInput = {
      id: '0',
      name: 'foo',
      displayName: 'Foo',
      type: 'string',
      required: false,
      unique: false,
      credential: false,
      enum: [],
      regex: '',
    };
    expect(input.name).toBe('foo');
  });
});
