import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
import { DiskMap } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(9, 'b', day9b);


export async function day9b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  
  const diskMap = new DiskMap(data.at(0));
  // diskMap.display().original();
  // console.log("---");
  // diskMap.display().layout();
  // console.log("---");
  diskMap.optimizeWithDefrag();
  // diskMap.display().layout();
  

  return diskMap.checksum();  
}
