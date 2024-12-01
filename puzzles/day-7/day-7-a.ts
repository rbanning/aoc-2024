import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();


export async function day7a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day7a();
outputHeading(7, 'a');
outputAnswer(answer);
