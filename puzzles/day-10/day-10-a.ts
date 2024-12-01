import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

Verbose.setActive(true);
const verbose = new Verbose();

export async function day10a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  
}

const answer = await day10a();
outputHeading(10, 'a');
outputAnswer(answer);
