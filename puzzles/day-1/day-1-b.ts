import assert from 'assert';
import { parsers } from '../../helpers/parsers.ts';
import { arrayHelpers } from '../../helpers/arrayHelpers.ts';
import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(1, 'b', day1b);


export async function day1b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);  //remove any empty lines
  
  const [listA, listB] = parseData(data);
  assert(listA.length === listB.length, `Unequal number of elements: a) ${listA.length} and b) ${listB.length}`);

  return listA.reduce((sum, curr, index) => sum + (curr * arrayHelpers.count(listB, (b) => b === curr)), 0);  
}


// two integers are on each line
// the left integers represent one list of numbers
// and the right integers represent the other list of numbers
function parseData(data: string[]): [number[], number[]] {
  const result = data.reduce((ret: [number[], number[]], line, index) => {
    const parts = line.split(' ').map(m => m.trim()).filter(Boolean);
    if (parts.length === 2) {
      ret[0].push(parsers.toIntAssert(parts[0]));
      ret[1].push(parsers.toIntAssert(parts[1]));
    } 
    else { throw new Error(`Unable to parse line #${index}: ${line}`); }
    return ret;
  }, [ [], []]);

  //sort
  result[0].sort();
  result[1].sort();
  return result;
}

