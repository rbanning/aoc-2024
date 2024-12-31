import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(17, 'a', day17a);



export async function day17a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}


