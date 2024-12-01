import assert from "assert";
import { isNotNullable, isNullable, Nullable } from "./nullable.type.ts";
import { strHelpers } from "./strHelpers.ts";

// Strictness is used to allow fuzzy conversions or strict conversions
export type Strictness = 'low' | 'high';

export const parsers = {
  toInt,
  toIntAssert,
} as const;


function toInt(val: unknown, strictness: Strictness = 'high'): Nullable<number> {
  if (isNullable(val)) { return null; }
  var ret = parseInt(`${val}`); //convert the value to a string
  
  //parseInt will try to convert an integer-like string to an integer
  // e.g. 47a => 47
  // if high strictness, don't allow extra characters
  return (!isNaN(ret) && (strictness === 'low' || strHelpers.equals(val, ret))) 
    ? ret
    : null;
}
function toIntAssert(val: unknown, strictness: Strictness = 'high'): number {
  var ret = toInt(val, strictness);
  assert(isNotNullable(val) && typeof ret === 'number', `Could not parse value as an integer: ${val}`);
  return ret;
}