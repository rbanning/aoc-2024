import { _baseDirectionDelta, addCoords, BaseDirection, CharGrid, Coord, Direction, equalCoords } from '../../helpers/grid/index.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

Verbose.setActive(true);
const verbose = new Verbose();

export async function day6a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const grid = new CharGrid();
  grid.load(data);

  let dir: BaseDirection = 'N';
  let current = grid.find(v => v === '^');
  let sum = 0;
  const visited: Coord[] = [];

  while (current && grid.exists(current)) {
    if (!visited.some(c => equalCoords(c, current))) {
      visited.push(current);
      sum += 1;
    }
    const next = addCoords(current, _baseDirectionDelta(dir));
    if (grid.get(next) === '#') {
      dir = turnRight(dir);
      current = addCoords(current, _baseDirectionDelta(dir));
    }
    else {
      current = next;
    }

  }


  return sum;  
}

const answer = await day6a();
outputHeading(6, 'a');
outputAnswer(answer);


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