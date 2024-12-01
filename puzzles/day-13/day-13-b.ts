import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

Verbose.setActive(false);
const verbose = new Verbose();


export async function day13b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day13b();
outputHeading(13, 'b');
outputAnswer(answer);
