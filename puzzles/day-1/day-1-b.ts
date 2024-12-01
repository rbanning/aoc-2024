import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

export async function day1b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);  //remove any empty lines
  return data.reduce((sum, curr) => sum + 1, 0);  
}

Verbose.setActive(false);
const answer = await day1b();
outputHeading(1, 'b');
outputAnswer(answer);


