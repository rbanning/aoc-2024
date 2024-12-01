import { greatestCommonFactor, leastCommonMultiple, primeFactors } from '../../helpers/mathHelpers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(true);
const verbose = new Verbose();


export async function day8b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day8b();
outputHeading(8, 'b');
outputAnswer(answer);
