import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

export async function day7b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  
}

const answer = await day7b();
outputHeading(7, 'b');
outputAnswer(answer);
