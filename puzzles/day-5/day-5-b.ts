import { parsers } from '../../helpers/parsers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';
import { OrderingList } from './ordering-list.model.ts';
Verbose.setActive(true);
const verbose = new Verbose();

export async function day5b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  
  const rules = data.filter(v => v.includes('|'));
  
  const orderList = new OrderingList();
  orderList.load(rules);
  
  const pagesList = data.filter(v => v.includes(','))
                  .map(line => parsers.toIntArrayAssert(line, ','));

  let invalid = pagesList.filter(pages => !orderList.validate(pages))
                          .map(line => orderList.sort(line));

  const middles = invalid.map(v => {
    return v.length % 2 === 1
      ? v.at(Math.floor(v.length / 2))
      : null;
  });

  return middles.reduce((sum, curr) => sum + curr, 0);    

}

const answer = await day5b();
outputHeading(5, 'b');
outputAnswer(answer);
