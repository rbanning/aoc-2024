import { isNullable } from "./nullable.type.ts";
import { primitive } from "./primitive.ts";

export const strHelpers = {
  equals,
  isStringUnionType
} as const;


function equals(a: unknown, b: unknown, caseSensitive: boolean = true) {
  if (isNullable(a) || isNullable(b)) {
    return false; //be definition, they cannot be equal
  }

  return caseSensitive
    ? `${a}` === `${b}`
    : `${a}`.toLocaleLowerCase() === `${b}`.toLocaleLowerCase();
}


function isStringUnionType<T extends string>(value: unknown, possible: Readonly<T[]>): value is T {
  return !primitive.isNullish(
      possible.find(p => equals(p, value, true /* case-sensitive */))
  );
}