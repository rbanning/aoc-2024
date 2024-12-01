import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

Verbose.setActive(true);
const verbose = new Verbose();

export async function day16a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  
  
}

const answer = await day16a();
outputHeading(16, 'a');
outputAnswer(answer);
