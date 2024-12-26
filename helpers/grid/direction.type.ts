import { Nullable } from '../nullable.type.ts';
import { strHelpers } from '../strHelpers.ts';
import { Coord } from "./coord.type.ts";

export const baseDirections = ['N', 'E', 'S', 'W'] as const;
export type BaseDirection = typeof baseDirections[number];

export function _baseDirectionDelta(direction: BaseDirection): Nullable<Coord> {
  switch (direction) {
    case 'N': return { x: 0, y: -1 };
    case 'S': return { x: 0, y: 1 };
    case 'E': return { x: 1, y: 0 };
    case 'W': return { x: -1, y: 0 };
    default:
      return null;
  }
}
export function _allBaseDirectionDeltas(): Coord[] {
  return baseDirections.map(d => _baseDirectionDelta(d));
}

export const diagonalDirections = ['NE', 'SE', 'SW' ,'NW'] as const;
export type DiagonalDirection = typeof diagonalDirections[number];

export function _diagonalDirectionDelta(direction: DiagonalDirection): Nullable<Coord> {
  switch (direction) {
    case 'NE': return { x: 1, y: -1 };
    case 'SE': return { x: 1, y: 1 };
    case 'SW': return { x: -1, y: 1 };
    case 'NW': return { x: -1, y: -1 };
    default:
      return null;
  }
}
export function _allDiagonalDirectionDeltas(): Coord[] {
  return diagonalDirections.map(d => _diagonalDirectionDelta(d));
}

export const directions = [...baseDirections, ...diagonalDirections];
export type Direction = BaseDirection | DiagonalDirection;

export function directionDelta(direction: Direction): Coord {
  const ret = strHelpers.isStringUnionType(direction, baseDirections)
    ? _baseDirectionDelta(direction)
    : strHelpers.isStringUnionType(direction, diagonalDirections)
      ? _diagonalDirectionDelta(direction)
      : null;

  if (!ret) { throw new Error("Invalid/Unsupported Direction: " + direction); }
  return ret;
}
export function allDirectionDeltas(): Coord[] {
  return [
    ..._allBaseDirectionDeltas(),
    ..._allDiagonalDirectionDeltas()
  ];
}
