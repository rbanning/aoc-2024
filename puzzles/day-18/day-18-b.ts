import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(18, 'b', day18b);



export async function day18b(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}


