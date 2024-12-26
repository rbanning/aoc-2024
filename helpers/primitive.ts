import { IsNullable } from './nullable.type.ts';
import { Primitive } from './primitive.type.ts';

function isNullish(value: unknown): value is IsNullable {
  return (value === null || value === undefined || typeof(value) === 'undefined');
}

function isOfType<T>(value: unknown): value is T {
  return !isNullish(value);
}
function isKeyOf<T extends object>(
  x: T,
  k: PropertyKey
): k is keyof T {
  return k in x;
}
function hasKeysOf<T extends object>(
  x: T,
  ...keys: PropertyKey[]
) {
  return keys.every(k => isKeyOf(x, k));
}

function isArray<T = unknown>(value: unknown): value is Array<T> { return Array.isArray(value); }
function isDate(value: unknown): value is Date { return value instanceof Date; }


function isPrimitive(value: unknown): value is Primitive {
  return isNullish(value)
    || typeof(value) !== 'object';
}

function isFunction<T>(value: unknown): value is T {
  return typeof(value) === 'function'
    && value instanceof Function;
}

export type TypeOfName = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'object' | 'function' | 'undefined';


export const primitive = {
  isNotNullish: <T>(obj: unknown): obj is T => !isNullish(obj),
  isNullish: (obj: unknown): obj is IsNullable => isNullish(obj),

  isOfType,
  isKeyOf,
  hasKeysOf,
  isPrimitive,
  isFunction,

  isNumber: (obj: unknown): obj is number => Number.isFinite(obj),
  isInteger: (obj: unknown): obj is number => Number.isInteger(obj),

  isBoolean: (obj: unknown): obj is boolean => typeof(obj) === 'boolean',
  isString: (obj: unknown): obj is string => typeof(obj) === 'string',

  isArray,
  isDate,
}
