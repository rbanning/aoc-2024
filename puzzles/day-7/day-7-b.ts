import { appRunner } from '../../app-runner.ts';
import { Logger } from '../../helpers/logger/logger.ts';
import { readData, Verbose } from '../../shared.ts';
import { Equation } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(7, 'b', day7b);


export async function day7b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const logger = new Logger();
  
  const equations: Equation[] = data.map(line => Equation.create(line));
  let sum = 0;
  equations.forEach(e => {

    if (e.isSolvable(Equation.OPERATIONS_EXPANDED)) {
      sum += e.result;
    }


    // const options = e.findSolutions(Equation.OPERATIONS_EXPANDED);
    // e.display(logger, options);
    // sum += (options.length === 0) ? 0 : e.result;
  });
  
  
  return sum;  
}
