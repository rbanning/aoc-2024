import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

const verbose = new Verbose();

export async function day2a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  
}

Verbose.setActive(false);
const answer = await day2a();
outputHeading(2, 'a');
outputAnswer(answer);

