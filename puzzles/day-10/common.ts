import chalk from "chalk";
import { SingleDigitIntGrid, Coord, baseDirections, addCoords, _baseDirectionDelta, equalCoords } from "../../helpers/grid/index.ts";
import { Logger } from "../../helpers/logger/logger.ts";
import { GenericSet } from "../../helpers/generic-set.model.ts";

export const START_OF_TRAIL = 0;
export const END_OF_TRAIL = 9;

export type Trail = Coord[];

export function findTrails(start: Coord, grid: SingleDigitIntGrid, uniqueEndpoints: boolean) {
  // if (grid.get(start) !== START_OF_TRAIL) {
  //   return new GenericSet<Trail>(); //not at a start
  // }



  function recurse(coord: Coord, path: Trail, grid: SingleDigitIntGrid): GenericSet<Trail> {
    const current = grid.get(coord);
    if (current === END_OF_TRAIL) {
      path.push(coord); 
      return GenericSet.fromArray([path]); //done
    }
    //else get coords in all four (base) directions
    const possible = baseDirections.map(dir => addCoords(coord, _baseDirectionDelta(dir)));
    return possible.reduce((trails: GenericSet<Trail>, next) => {
      //we are only interested in the next step in the trail
      if (grid.get(next) === current + 1) {
        recurse(next, [...path, coord], grid).forEach((trail) => {
          if (trail.length > 0) {
            trails.add(trail);
          }
        })
      }
      return trails;
    }, new GenericSet<Trail>);
  }

  const result = recurse(start, [], grid).toArray()
  
  return uniqueEndpoints
    ? result.filter((trail, index, trails) => {
        //only include trails that have a unique ending point
        return index === trails.findIndex(t => equalCoords(trail.at(-1), t.at(-1)));
      })
    : result;

}

export function xCoord(c: Coord) {
  return `{${c.x},${c.y}}`;
}
export function xCoordArray(arr: Coord[]) {
  return arr.map(c => xCoord(c)).join(',');
}

export function displayTrail(trail: Trail, grid: SingleDigitIntGrid) {
  const logger = new Logger();
  trail.forEach((c, index) => {
    if (index > 0) {
      logger.writeColor(chalk.gray, ', ');
    }
    logger.writeColor(chalk.whiteBright, `{${c.x},${c.y}}`)
    logger.writeColor(chalk.gray, '|');
    logger.writeColor(chalk.yellowBright, grid.get(c));
  })
  logger.writeLine();
}