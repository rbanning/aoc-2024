import { CharGrid } from '../../helpers/grid/char-grid.ts';
import { addCoords, Coord, equalCoords, multiplyCoord } from '../../helpers/grid/coord.type.ts';
import { allDirectionDeltas } from '../../helpers/grid/direction.type.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

const cache = [];

export async function day4a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const grid = new CharGrid();
  grid.load(data);


  const target = "XMAS".split(''); // "XMAS".split('');
  const all = grid.coordinates((val) => val === target.at(0));

  const ret = all.reduce((sum, coord) => sum + traverse(grid, coord, target), 0);

  
  return ret;  

}

const answer = await day4a();
outputHeading(4, 'a');
outputAnswer(answer);


function traverse(grid: CharGrid, start: Coord, target: string[]): number {  
  const options = allDirectionDeltas();  
  return options.reduce((sum, delta) => {
    return sum + 
      (checkDirection(grid, start, target, delta)
        ? 1
        : 0);
  }, 0);
}

function checkDirection(grid: CharGrid, start: Coord, target: string[], delta: Coord) {
  return target.every((targetLetter, index) => {
    const coord = addCoords(start, multiplyCoord(delta, index));
    const existingLetter = grid.get(coord);
    return existingLetter === targetLetter;
  })
}

//a different problem where you can change direction to create an XMAS
function traverseAnyway(grid: CharGrid, start: Coord, target: string[], found: Coord[]): number {    
  if (target.length > 0) {
    const curr = grid.get(start);
    if (curr === target.at(0)) {
      found.push(start); //add to the path

      //done?
      if (target.length === 1) { 
        return 1; 
      }

      //else continue
      const options = grid.adjacentFrom(start)
                        .filter(a => !found.some(b => equalCoords(a,b)));


      return options.reduce((sum, coord) => sum + traverseAnyway(grid, coord, target.slice(1), found), 0);
    }

  }
  //else
  return 0;
}


