import { ArrayBound, NamedArrayBound, arrayHelpers } from '../../helpers/arrayHelpers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

export async function day9b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day9b();
outputHeading(9, 'b');
outputAnswer(answer);
