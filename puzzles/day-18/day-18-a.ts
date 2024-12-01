import { outputAnswer, outputHeading, readData } from '../../shared.ts';

export async function day18a(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day18a();
outputHeading(18, 'a');
outputAnswer(answer);
