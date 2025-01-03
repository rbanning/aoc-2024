import { primitive } from "../primitive.ts";

export type Coord = {
  x: number;
  y: number;
}
export type CoordTuple = [x: number, y: number];

export function coordToString(c: Coord) {
  return `${c.x}:${c.y}`;
}

export function equalCoords(a: Coord, b: Coord) {
  if (primitive.isNullish(a) || primitive.isNullish(b)) { console.log("equalCoords - NULL", a,b); return false; }
  //else
  return a.x === b.x
      && a.y === b.y;
}

export function equalCoordArrays(a: Coord[], b: Coord[]) {
  if (primitive.isNullish(a) || primitive.isNullish(b)) { console.log("equalCoordArrays - NULL", a,b); return false; }
  //else
  return a.length === b.length
    && a.every((coord,index) => equalCoords(coord,b[index]));
}

export function uniqueCoordArrays(a: Coord[], b: Coord[]) {
  if (primitive.isNullish(a) || primitive.isNullish(b)) { console.log("uniqueCoordArrays - NULL", a,b); return false; }
  //else
  return a.length === b.length
    && a.every((coord,index) => equalCoords(coord,b[index]));
}

export function toCoord(coord: Coord): Coord;
export function toCoord(coord: CoordTuple): Coord;
export function toCoord(x: number, y: number): Coord;
export function toCoord(arg1: number | Coord | CoordTuple, arg2?: number): Coord {
  let x: number = -100;
  let y: number = -100;
  if (typeof(arg1) === 'number') {
    x = arg1;
    y = arg2;
  }
  else if (Array.isArray(arg1)) {
    x = arg1[0];
    y = arg2[1];
  }
  else {
    x = arg1.x;
    y = arg1.y;
  }
  return { x, y };
}

export function addCoords(a: Coord, b: Coord): Coord {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export function multiplyCoords(a: Coord, scalar: number): Coord {
  return {
    x: a.x * scalar,
    y: a.y * scalar
  }
}

export function distanceBetweenCords(a: Coord, b: Coord): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2)  //square of the diff on x-axis
    + 
    Math.pow(a.y - b.y, 2)  //square of the diff on y-axis
  )
}

// coord (B) "After" coord (A) when...
// B.y > A.y
// or B.y === A.y && B.x > A.x
export function isCoordAfter(b: Coord, a: Coord) {
  return b.y > a.y 
    || (b.y === a.y && b.x > a.x);
}