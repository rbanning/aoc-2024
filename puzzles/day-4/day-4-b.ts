import { CharGrid } from '../../helpers/grid/char-grid.ts';
import { addCoords, Coord } from '../../helpers/grid/coord.type.ts';
import { directionDelta } from '../../helpers/grid/direction.type.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

export async function day4b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const grid = new CharGrid();
  grid.load(data);

  const all = grid.coordinates((val) => val === 'A');

  const ret = all.reduce((sum, coord) => sum + traverse(grid, coord), 0);

  
  return ret;  

}

function traverse(grid: CharGrid, start: Coord): number {
  const startLetter = grid.get(start);
  if (startLetter === 'A') {
    //need to check diagonals to see if both have MS (or SM) (can be backwards)
    const NWSE = [addCoords(start, directionDelta('NW')), addCoords(start, directionDelta('SE'))];
    const SWNE = [addCoords(start, directionDelta('SW')), addCoords(start, directionDelta('NE'))];
    
    return checkDiagonal(grid, NWSE) && checkDiagonal(grid, SWNE)
      ? 1
      : 0;
  }
  //else ... skip
  return 0;
}

function checkDiagonal(grid: CharGrid, tuple: Coord[]) {
  const letters = [grid.get(tuple[0]), grid.get(tuple[1])];
  return (letters[0] === 'M' && letters[1] === 'S')
      || (letters[0] === 'S' && letters[1] === 'M');
}   


const answer = await day4b();
outputHeading(4, 'b');
outputAnswer(answer);
