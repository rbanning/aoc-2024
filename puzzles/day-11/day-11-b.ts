import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
import { StoneLine, StoneLineAdv } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(11, 'b', day11b);


export async function day11b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);

  const stones = new StoneLineAdv(data.at(0));
  stones.display();
  
  const TOTAL_BLINKS = 75;
  for (let blink = 1; blink <= TOTAL_BLINKS; blink++) {
    stones.blink();
    //stones.display();
    if (stones.blinkCount % 5 === 0) {
      stones.progress();
    }
  }

  return stones.length;  

}
