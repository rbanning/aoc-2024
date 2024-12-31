import { parsers } from '../../helpers/parsers.ts';
import { OrderingList } from './ordering-list.model.ts';
import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(5, 'b', day5b);


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

