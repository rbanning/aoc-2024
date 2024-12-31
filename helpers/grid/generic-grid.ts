import { Logger } from "../logger/logger.ts";
import { Nullable } from "../nullable.type.ts";
import { Predicate } from "../predicate.type.ts";
import { primitive } from "../primitive.ts";
import { addCoords, Coord, CoordTuple, toCoord } from "./coord.type.ts";
import { directionDelta, directions } from "./direction.type.ts";

export type GridParser<T> = (value: string) => T;

export class GenericGrid<T> {
  #grid: T[][];

  #parser: GridParser<T>;


  get size() {
    if (this.#grid.length > 0) {
      if (this.#grid.every((row, index) => index === 0 ? true : row.length === this.#grid[index-1].length)) {
        //complete --- all rows have the same length
        return {
          rows: this.#grid.length,
          cols: this.#grid[0].length,   
        }
      }
      else {
        return {
          rows: this.#grid.length,
          cols: -1, //flag that the grid is not complete.
        }
      }
    }
    //else
    return {
      rows: 0,
      cols: 0
    }
  }

  constructor(parser: GridParser<T>) {
    this.#parser = parser;
    this.reset();
  }

  exists(coord: Coord): boolean;
  exists(coord: CoordTuple): boolean;
  exists(x: number, y: number): boolean;
  exists(arg1: Coord | CoordTuple | number, arg2?: number): boolean {
    if (primitive.isNullish(arg1)) { return false; }
    
    const { x, y } = this._toCoord(arg1, arg2);
    return y >=0 && y < this.#grid.length
      && x >= 0 && x < this.#grid[y].length;
  } 

  get(coord: Coord): Nullable<T>;
  get(x: number, y: number): Nullable<T>;
  get(arg1: Coord | number, arg2?: number): Nullable<T> {
    const { x, y } = this._toCoord(arg1, arg2);
    if (this.exists(x,y)) {
      return this.#grid[y][x];
    }
    //else
    return null;
  }

  set(coord: Coord, value: T): boolean;
  set(x: number, y: number, value: T): boolean;
  set(arg1: Coord | number, arg2?: number | T, arg3?: T): boolean {
    const value = primitive.isNumber(arg2) ? arg3 : arg2;
    const { x, y } = this._toCoord(arg1, primitive.isNumber(arg2) ? arg2 : undefined);
    if (this.exists(x,y)) {
      this.#grid[y][x] = value;
      return true;
    }
    //else
    return false;
  }



  find(predicate: Predicate<T>): Nullable<Coord> {
    const all = this.coordinates();
    return all.find(coord => {
      const v = this.get(coord);
      return primitive.isNotNullish(v)
        && predicate(v);
    })
  }

  coordinates(): Coord[];
  coordinates(predicate: (val: T) => boolean): Coord[];
  coordinates(predicate?: (val: T) => boolean): Coord[] {
    const all = this.#grid
                  .map((row, y) => row.map((_, x) => ({x, y})))
                  .flat();
    return primitive.isFunction(predicate)
      ? all.filter(coord => predicate(this.get(coord)))
      : all;
  }

  adjacentFrom(coord: Coord): Coord[];
  adjacentFrom(coord: CoordTuple): Coord[];
  adjacentFrom(x: number, y: number): Coord[];
  adjacentFrom(arg1: Coord | CoordTuple | number, arg2?: number): Coord[] {
    const coord = this._toCoord(arg1, arg2);
    if (this.exists(coord)) {
      return directions.map(direction => addCoords(coord, directionDelta(direction)))
              .filter(m => this.exists(m));
    }
    //else
    console.warn(">>> Grid.adjacentFrom() - Invalid Coordinate", coord, this.exists(coord))
    return [];
  }

  load(lines: string[], delim = '') {
    this.reset();
    lines.forEach(line => {
      this.#grid.push(line.split(delim).map(m => this.#parser(m)));
    });
  }

  reset() {
    this.#grid = [];
  }

  display() {
    const logger = new Logger();

    const {rows, cols} = this.size;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = this.get({x,y});
        logger.write(`${v}`);
      }  
      logger.writeLine();
    }
  }

  protected _toCoord(arg1: number | Coord | CoordTuple, arg2?: number): Coord {
    return primitive.isNumber(arg1) && primitive.isNumber(arg2)
      ? toCoord(arg1, arg2)
      : Array.isArray(arg1) 
        ? toCoord(arg1)
        : typeof(arg1) === 'object'
          ? toCoord(arg1)
          : null; // this would be an error
  }

}