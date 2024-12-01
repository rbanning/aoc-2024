import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
Verbose.setActive(true);
const verbose = new Verbose();


export async function day6b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  return data.reduce((sum, curr) => sum + 1, 0);  

}

const answer = await day6b();
outputHeading(6, 'b');
outputAnswer(answer);
