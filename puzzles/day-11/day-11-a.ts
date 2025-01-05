import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
import { StoneLine } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(11, 'a', day11a);

export async function day11a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);

  const stones = new StoneLine(data.at(0));
  stones.display();
  
  const TOTAL_BLINKS = 25;
  for (let blink = 1; blink <= TOTAL_BLINKS; blink++) {
    stones.blink();
    if (stones.blinkCount < 6) {
      stones.display();
    }
  }

  return stones.length;  

}
