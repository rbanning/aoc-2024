import { appRunner } from '../../app-runner.ts';
import { Coord } from '../../helpers/grid/coord.type.ts';
import { SingleDigitIntGrid } from '../../helpers/grid/single-digit-int-grid.ts';
import { readData, Verbose } from '../../shared.ts';
import { findTrails, START_OF_TRAIL } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(10, 'b', day10b);

export async function day10b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const grid = new SingleDigitIntGrid();  
  grid.load(data);  
  grid.display();

  const {rows, cols} = grid.size;
  const paths: [Coord, number][] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid.get({x,y}) === START_OF_TRAIL) {
        const trails = findTrails({x,y}, grid, false);
        paths.push([{x,y}, trails.length]);
        // console.log(">", {x,y}, trails.length);
        // trails.forEach(trail => displayTrail(trail, grid));
      }
    }    
  }

  console.log("Here are the trail heads and their 'scores'")
  console.log(paths);
  return paths.reduce((sum, p) => sum + p[1], 0);
}

