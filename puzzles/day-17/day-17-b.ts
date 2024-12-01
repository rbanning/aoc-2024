import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

export async function day17b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day17b();
outputHeading(17, 'b');
outputAnswer(answer);
