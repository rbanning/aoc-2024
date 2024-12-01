import { isNullable } from "./nullable.type.ts";

export const strHelpers = {
  equals
} as const;


function equals(a: unknown, b: unknown) {
  if (isNullable(a) || isNullable(b)) {
    return false; //be definition, they cannot be equal
  }

  return `${a}` === `${b}`;
}