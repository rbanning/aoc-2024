import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

const verbose = new Verbose();

export async function day2b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  
}

Verbose.setActive(false);
const answer = await day2b();
outputHeading(2, 'b');
outputAnswer(answer);

