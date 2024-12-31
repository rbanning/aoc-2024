import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(18, 'a', day18a);


export async function day18a(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}


