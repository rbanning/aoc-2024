import chalk from 'chalk';
import { appRunner } from '../../app-runner.ts';
import { Logger } from '../../helpers/logger/logger.ts';
import { readData, Verbose } from '../../shared.ts';
import { Equation } from './common.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(7, 'a', day7a);

export async function day7a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const logger = new Logger();
  
  const equations: Equation[] = data.map(line => Equation.create(line));
  let sum = 0;
  equations.forEach(e => {
    const options = e.findSolutions();
    e.display(logger, options);
    sum += (options.length === 0) ? 0 : e.result;
  });
  
  
  return sum;  
}
