import { readData, outputHeading, outputAnswer } from '../../shared.ts';

export async function day1a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);  //remove any empty lines
  return data.reduce((sum, curr) => sum + 1, 0);  
}

const answer = await day1a();
outputHeading(1, 'a');
outputAnswer(answer);

