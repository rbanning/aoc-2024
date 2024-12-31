import chalk from 'chalk';
import { readFile } from 'fs/promises';

export type Test = 'a' | 'b' | 'x';

export function buildDataPath(path?: string) {
  return path || process.argv[2];
}

export async function readData(path?: string) {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString()
                  .replace(/\r/g, '') //remove carriage returns if CRLF 
                  .split('\n');
  return data;
}


export function outputHeading(day: number, test: Test) {

  const text = ` 🎄    AOB #${day}-${test}    🎄 `;
  console.log(chalk.red(Array(text.length).fill('-').join('')));
  console.log(chalk.white.bgRed(text));
  console.log(chalk.red(Array(text.length).fill('-').join('')));
}

export function outputAnswer(answer: unknown, totalTime?: string) {
  console.log(chalk.gray("~.~.~.~.~.~.~.~.~.~.~.~.~.~"));
  console.log(chalk.gray.italic('Total time...', totalTime));
  console.log(chalk.whiteBright.bgGreen(' Your Answer: '), chalk.green.bold(answer), chalk.reset());
  if (totalTime) {
  }
}


export type VerboseDisplayOptions = {
  flush?: boolean,
  bright?: boolean
}
const defaultDisplayOptions: VerboseDisplayOptions = { flush: true, bright: false };
export class Verbose {
  private output: string[] = [];


  add(text: string) {
    if (this.output.length === 0) {
      this.output.push(text);
    } else {
      this.output[this.output.length - 1] += text;
    }
    return this;
  }

  newline() {
    this.output.push('');
    return this;
  }

  clear() {
    this.output = [];
    return this;
  }

  display(options?: VerboseDisplayOptions) {
    options = { ...defaultDisplayOptions, ...options };
    this.output
      .forEach(line => options.bright ? this.verboseOutputBright(line) : this.verboseOutput(line));
    if (options.flush) {
      this.clear();
    }
    return this;
  }

  private verboseOutput(text: string) {
    if (Verbose.isActive()) {
      console.log(chalk.whiteBright.bold('> '), chalk.gray(text));
    }
  }
  private verboseOutputBright(text: string) {
    if (Verbose.isActive()) {
      console.log(chalk.whiteBright.bold('> '), chalk.whiteBright(text));
    }
  }


  //#region >> STATIC <<

  private static _active = false;
  static setActive(active: boolean) {
    Verbose._active = active;
  }
  static isActive() { return Verbose._active; }


  static add(text: string) {
    const ret = new Verbose();
    return ret.add(text);
  }


  //#endregion
}