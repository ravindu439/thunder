// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {PropertyDefinition, UserTypeDefinition} from '../types/user-types';

/** enum/regex live only on string properties; read them safely off the union. */
function getEnum(def: PropertyDefinition): string[] | undefined {
  return 'enum' in def ? def.enum : undefined;
}
function getRegex(def: PropertyDefinition): string {
  return 'regex' in def ? (def.regex ?? '') : '';
}

/** Whether base -> next tightens the attribute so an existing value could stop matching. */
function isBreakingAttributeChange(base: PropertyDefinition, next: PropertyDefinition): boolean {
  if (base.type !== next.type) return true;
  if (!base.required && next.required) return true;
  if (!base.unique && next.unique) return true;

  const nextRegex = getRegex(next);
  if (nextRegex && nextRegex !== getRegex(base)) return true;

  const baseEnum = getEnum(base);
  const nextEnum = getEnum(next);
  if (nextEnum && nextEnum.length > 0) {
    if (!baseEnum || baseEnum.length === 0) return true;
    if (baseEnum.some((v) => !nextEnum.includes(v))) return true;
  }

  return false;
}

/**
 * Names of attributes whose change could strand existing entities: removed, newly required, or
 * tightened. Additive/loosening changes (new optional attribute, dropped constraint) are not breaking.
 */
export default function getBreakingSchemaChanges(base: UserTypeDefinition, next: UserTypeDefinition): string[] {
  const breaking: string[] = [];
  const names = new Set([...Object.keys(base), ...Object.keys(next)]);

  names.forEach((name) => {
    const b = base[name];
    const n = next[name];
    if (b && !n) {
      breaking.push(name);
    } else if (!b && n) {
      if (n.required) breaking.push(name);
    } else if (b && n && isBreakingAttributeChange(b, n)) {
      breaking.push(name);
    }
  });

  return breaking.sort();
}
