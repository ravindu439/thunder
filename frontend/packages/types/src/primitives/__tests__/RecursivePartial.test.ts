// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {expectTypeOf} from 'vitest';
import type {RecursivePartial} from '../RecursivePartial';

describe('RecursivePartial', () => {
  it('should keep primitive types unchanged', () => {
    expectTypeOf<RecursivePartial<string>>().toEqualTypeOf<string>();
    expectTypeOf<RecursivePartial<number>>().toEqualTypeOf<number>();
    expectTypeOf<RecursivePartial<boolean>>().toEqualTypeOf<boolean>();
    expectTypeOf<RecursivePartial<null>>().toEqualTypeOf<null>();
    expectTypeOf<RecursivePartial<undefined>>().toEqualTypeOf<undefined>();
  });

  it('should keep function types unchanged', () => {
    type Fn = (x: number) => string;
    expectTypeOf<RecursivePartial<Fn>>().toEqualTypeOf<Fn>();

    type VoidFn = () => void;
    expectTypeOf<RecursivePartial<VoidFn>>().toEqualTypeOf<VoidFn>();
  });

  it('should make all object properties optional', () => {
    interface Input {
      a: string;
      b: number;
    }
    interface Expected {
      a?: string;
      b?: number;
    }
    expectTypeOf<RecursivePartial<Input>>().toEqualTypeOf<Expected>();
  });

  it('should recursively make nested object properties optional', () => {
    interface Input {
      a: {b: {c: string}};
    }
    interface Expected {
      a?: {b?: {c?: string}};
    }
    expectTypeOf<RecursivePartial<Input>>().toEqualTypeOf<Expected>();
  });

  it('should keep function-valued properties as-is while making the key optional', () => {
    type Fn = () => void;
    interface Input {
      fn: Fn;
      name: string;
    }
    interface Expected {
      fn?: Fn;
      name?: string;
    }
    expectTypeOf<RecursivePartial<Input>>().toEqualTypeOf<Expected>();
  });

  it('should handle objects with mixed primitive and nested object properties', () => {
    interface Input {
      id: number;
      meta: {
        label: string;
        active: boolean;
      };
    }
    interface Expected {
      id?: number;
      meta?: {
        label?: string;
        active?: boolean;
      };
    }
    expectTypeOf<RecursivePartial<Input>>().toEqualTypeOf<Expected>();
  });
});
