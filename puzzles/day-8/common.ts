import chalk from "chalk";
import { CharGrid } from "../../helpers/grid/char-grid.ts";
import { addCoords, Coord, equalCoords, isCoordAfter } from "../../helpers/grid/coord.type.ts";
import { Logger } from "../../helpers/logger/logger.ts";
import { GenericSet } from "../../helpers/generic-set.model.ts";

export const EMPTY_SPACE = '.'; // location where there is no antenna

export function calcAntinodes(a: Coord, b: Coord): [Coord, Coord] {
  //assuming b is "after" a
  
  const deltaX = (b.x - a.x);
  const deltaY = (b.y - a.y);

  const anti1 = addCoords(a, {x: -deltaX, y: -deltaY});  //move up
  const anti2 = addCoords(b, {x: deltaX, y: deltaY});   

  return [anti1, anti2];
}

type HasExistsMethod = {
  exists: (a: Coord) => boolean
}
export function calcAntinodesAlongLine(a: Coord, b: Coord, grid: HasExistsMethod): GenericSet<Coord> {
  //assuming b is "after" a
  
  const deltaX = (b.x - a.x);
  const deltaY = (b.y - a.y);

  const result = new GenericSet<Coord>();

  const findInDirection = (start: Coord, direction: 1 | -1) => {
    let coord: Coord = {...start};
    let factor = 0;
    while (grid.exists(coord)) {
      result.add(coord);
      factor += direction;
      coord = addCoords({...start}, { x: factor * deltaX, y: factor * deltaY});        
    }
  }

  findInDirection(a, -1);
  findInDirection(b, 1);

  return result;
}


export class Antennas {
  private _store: Record<string,Coord[]>;

  constructor() { 
    this._store = {};
  }

  has(key: string) {
    return Array.isArray(this._store[key]);
  }

  exists(coord: Coord) {
    //return true if the coord is for an antenna in any of the "buckets"
    let found = false;
    const keys = this.keys();
    for (let index = 0; index < keys.length && !found; index++) {
      const key = keys[index];
      found = this.get(key).some(c => equalCoords(c, coord));
    }
    return found;
  }

  keys() {
    const keys = Object.keys(this._store);
    keys.sort();
    return keys;
  }

  get(key: string) {
    return this._store[key] ?? [];
  }

  add(key: string, coord: Coord) {
    if (!this.has(key)) {
      this._store[key] = [];
    }
    this.insert(coord, this._store[key]);
  }

  findAntinodes(key: string, grid: CharGrid): GenericSet<Coord> {
    const result = new GenericSet<Coord>();
    
    const arr = this.get(key);
    if (arr.length > 0) {
      for (let current = 0; current < arr.length; current++) {
        const coordA = arr[current];
        for (let next = current+1; next < arr.length; next++) {
          const coordB = arr[next];
          //check
          if (isCoordAfter(coordA, coordB)) { throw new Error(`The '${key}' coords are not in order`); }
          const [a,b] = calcAntinodes(coordA, coordB);
          if (grid.exists(a)) { result.add(a); }
          if (grid.exists(b)) { result.add(b); }
        }
      }
    }

    return result;
  }

  findAntinodesAlongLine(key: string, grid: CharGrid): GenericSet<Coord> {
    const result = new GenericSet<Coord>();
    
    const arr = this.get(key);
    if (arr.length > 0) {
      for (let current = 0; current < arr.length; current++) {
        const coordA = arr[current];
        for (let next = current+1; next < arr.length; next++) {
          const coordB = arr[next];
          //check
          if (isCoordAfter(coordA, coordB)) { throw new Error(`The '${key}' coords are not in order`); }
          const ret = calcAntinodesAlongLine(coordA, coordB, grid);
          ret.forEach(coord => result.add(coord));
        }
      }
    }

    return result;
  }

  map(grid: CharGrid) { 
    this.clearAll(); 
    const {rows, cols} = grid.size;
    const antennas = new Antennas();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const key = grid.get({x,y});
        if (key !== EMPTY_SPACE) {
          this.add(key, {x,y});
        }        
      }  
    }
  }

  clear(key: string) {
    if (this.has(key)) {
      delete this._store[key];
    }
  }
  clearAll() {
    this._store = {};
  }



  display(logger?: Logger) {
    logger ??= new Logger();
    return {
      antennas: () => this.displayAntennas(logger),
      antinodes: (key: string, antinodes: GenericSet<Coord>) => this.displayAntinodes(logger, key, antinodes),
    };
  }

  private insert(coord: Coord, arr: Coord[]) {
    if (arr.length === 0) {
      arr.push(coord);
    }
    else {
      const index = arr.findIndex(c => isCoordAfter(c, coord));
      if (index < 0) {
        arr.push(coord);
      } else {
        arr.splice(index, 0, coord);
      }
    }
  }

  private displayAntennas(logger: Logger) {
    this.keys().forEach(key => {
      this.displayCoordSet(logger, key, this.get(key));
    })
  }

  private displayAntinodes(logger: Logger, key: string, antinodes: GenericSet<Coord>) {
    this.displayCoordSet(logger, key, antinodes.toArray());
  }

  private displayCoordSet(logger: Logger, key: string, arr: Coord[]) {
    logger.writeColor(chalk.bold.blueBright, key);
    logger.writeColor(chalk.gray, ` (${arr.length}): `);
    logger.write(arr.map(c => `{${c.x},${c.y}}`).join(', '));
    logger.writeLine();
  }

}