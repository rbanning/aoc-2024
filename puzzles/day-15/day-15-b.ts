import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

Verbose.setActive(false);
const verbose = new Verbose();


export async function day15b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day15b();
outputHeading(15, 'b');
outputAnswer(answer);
