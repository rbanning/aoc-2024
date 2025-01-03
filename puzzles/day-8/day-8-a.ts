import { appRunner } from '../../app-runner.ts';
import { GenericSet } from '../../helpers/generic-set.model.ts';
import { CharGrid, Coord } from '../../helpers/grid/index.ts';
import { readData, Verbose } from '../../shared.ts';
import { Antennas, EMPTY_SPACE } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(8, 'a', day8a);



export async function day8a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  
  const grid = new CharGrid();
  grid.load(data);
  
  grid.display();

  //map all antennas
  const locations = new Antennas();
  locations.map(grid);
  console.log("Antennas");
  locations.display().antennas();
  
  console.log("Antinodes");
  let sum = 0;
  const all_antinodes = new GenericSet<Coord>();
  locations.keys().forEach(key => {
    const antinodes = locations.findAntinodes(key, grid);
    locations.display().antinodes(key, antinodes);    
    antinodes.toArray().forEach(a => all_antinodes.add(a));
  });

  sum = all_antinodes.size;
  
  all_antinodes.forEach(a => {
    const marker = grid.get(a);
    if (marker === EMPTY_SPACE) { grid.set(a, '#'); }
  })

  console.log("With antinodes");
  grid.display();

  //236

  return sum;

}


