import chalk from 'chalk';
import { CharGrid } from '../../helpers/grid/char-grid.ts';
import { Coord, equalCoords, addCoords } from '../../helpers/grid/coord.type.ts';
import { BaseDirection, _baseDirectionDelta, baseDirections } from '../../helpers/grid/direction.type.ts';
import { Logger } from '../../helpers/logger/logger.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
import { GenericSet } from '../../helpers/generic-set.model.ts';
import { appRunner } from '../../app-runner.ts';

Verbose.setActive(true);
const verbose = new Verbose();

type Location = [Coord, BaseDirection];
type Visited = [Coord, BaseDirection, boolean];

const BLOCK = '#';
const START = '^';
const PATH = '.';

const TARGET_ANS = 1670

await appRunner(6, 'b', day6b);

async function day6b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);

  const grid = new CharGrid();
  grid.load(data);

  const visited = recordGuardsPositions(grid);
  
  //brute force look for loops
  const loopObstacles = detectedTheLoops(visited.toArray(), grid);

  display(grid, visited.toArray(), loopObstacles);  

  // //testing ... find any point where there are two BLOCKs positioned such that the guard would have to reverse direction (double right-turn)
  // const reverseBlocks = findReverseDirection(grid);
  // console.log(reverseBlocks);

 return loopObstacles.size;  
}

function recordGuardsPositions(grid: CharGrid) {
  let dir: BaseDirection = 'N';
  let current = grid.find(v => v === START);
  if (!current) { throw new Error("Could not locate the guard"); }
  const visited = new GenericSet<Visited>();

  //map where the guard goes
  while (current && grid.exists(current)) {
        
    const next = addCoords(current, _baseDirectionDelta(dir));
    const atObs = grid.get(next) === BLOCK;
    visited.add([current, dir, atObs]);

    if (atObs) {
      dir = turnRight(dir);
      current = addCoords(current, _baseDirectionDelta(dir));
    }
    else {
      current = next;
    }

  }

  return visited;
}

//test
function findReverseDirection(grid: CharGrid) {
  
  return grid.coordinates().filter(coord => {
    if (grid.get(coord) !== BLOCK) {
      const all = baseDirections.reduce((ret: Partial<Record<BaseDirection, Coord>>, dir) => {
        ret[dir] = addCoords(coord, _baseDirectionDelta(dir));
        return ret;
      }, {});
      const pairs = baseDirections.reduce((ret: [BaseDirection, BaseDirection][], dir) => {
        ret.push([dir, turnRight(dir)]);
        return ret;
      }, []);
      
      return pairs.every(p => grid.get(all[p[0]]) === BLOCK && grid.get(all[p[1]]) === BLOCK);      
    }
    return false;
  })
}

function detectedTheLoops(visited: Visited[], grid: CharGrid) {
  //start at start :-)
  const origin: Location = [grid.find((v) => v === START), 'N'];
  if (!origin[0]) { throw new Error("Could not locate the guard"); }

  const found = new GenericSet<Coord>();
  let total = 0;  //includes duplicates

  visited.forEach(([startCoord, startDir], index) => {

    //skip the start
    const isStart = grid.get(startCoord) === START && startDir === 'N';
    if (!isStart) {      
      //add a temporary obstacle
      const marker = grid.get(startCoord);
      grid.set(startCoord, BLOCK);

      //travel from start to see if this new obstacle causes us to loop (visit an already traveled location)
      let current: Coord = {...origin[0]};
      let dir: BaseDirection = origin[1];
      
      const seen = new GenericSet<Location>();
      while (current && grid.exists(current) && !seen.has([current, dir])) {
        seen.add([current,dir]);
        const next = addCoords(current, _baseDirectionDelta(dir));
        if (grid.get(next) === BLOCK) {
          dir = turnRight(dir);
          current = addCoords(current, _baseDirectionDelta(dir));
        } 
        else {
          current = next;
        }

      } //while

      //remove temporary obstacle
      grid.set(startCoord, marker);

      //we looped if we returned to a previously visited location (coord,dir);
      if (seen.has([current, dir])) {
        found.add(startCoord);
        total += 1;
      }
      else if (grid.exists(current)) {
        //should not have gotten here
        throw new Error("Loop detection ended unexpectedly");
      }      
    } 
  });

  console.log("TOTALS: ", {all: total, unique: found.size});
  return found;
}

function turnRight(current: BaseDirection) {
  switch(current) {
    case 'N': return 'E';
    case 'E': return 'S';
    case 'S': return 'W';
    case 'W': return 'N';
    default:
      throw new Error("Invalid direction");
  }
}

function display(grid: CharGrid, visited: Visited[], obstructions: GenericSet<Coord>) {
  const {rows, cols} = grid.size;
  const logger = new Logger();

  const markers: Record<BaseDirection, string> = {
    'N': '│',
    'E': '─',
    'S': '│',
    'W': '─'
  };
  const rtMarkers: Record<BaseDirection, string> = {
    'N': '┌',
    'E': '┐',
    'S': '┘',
    'W': '└'
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const obs = obstructions.has({x,y});
      if (obs) {
        logger.writeColor(chalk.cyanBright, 'O');
      }
      else {
        const current = visited.filter(t => equalCoords(t[0], {x,y}));
        const marker = grid.get({x,y});
        if (current.length === 0 || marker === START) {
          logger.writeColor(marker === START ? chalk.bgYellow.whiteBright : chalk.white, marker);
        }
        else {
          const [coord, dir, atObs] = current.at(0);
          const multiple = current.length > 1;
          logger.writeColor(chalk.greenBright,
            multiple
                ? '┼'
                : atObs
                  ? rtMarkers[dir]
                  : markers[dir]);
        }      
      }
    }
    logger.writeLine();
  }
  
}