// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export type RecursivePartial<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly RecursivePartial<U>[]
    : T extends (infer U)[]
      ? RecursivePartial<U>[]
      : T extends object
        ? {[P in keyof T]?: RecursivePartial<T[P]>}
        : T;
