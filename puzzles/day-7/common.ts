import chalk from "chalk";
import { Logger } from "../../helpers/logger/logger.ts";
import { parsers } from "../../helpers/parsers.ts";
import { Counter } from "../../helpers/counter.ts";
import { mathHelpers } from "../../helpers/mathHelpers.ts";


export type OperationFn = (a: number, b: number) => number;
export type Operation = {
  label: string;
  fn: OperationFn;
}


function add(a: number, b: number) {
  return a + b;
}
function multiply(a: number, b: number) {
  return a * b;
}
function concat(a: number, b: number) {
  return a * Math.pow(10, mathHelpers.digits(b)) + b;
}


export class Equation {
  result: number = 0;
  values: number[] = [];

  constructor();
  constructor(result: number, values: number[]);
  constructor(result?: number, values?: number[]) {
    this.result = result ?? 0;
    this.values = values ?? [];
  }


  findSolutions(operations?: Operation[]): Operation[][] {
    operations ??= Equation.OPERATIONS; //use basic as default
    if (this.values.length > 1) {
      const options = Equation.buildEqOptions(operations, this.values.length-1);      
      return options.filter(op => {
        const calc = this.values.reduce((sum, v, index) => {
          return index === 0
            ? v
            : op[index-1].fn(sum, v);
          }, 0); 
        return this.result === calc;
      });
    }
    //else - nothing to solve
    return [];
  }

  isSolvable(operations?: Operation[]): boolean {
    operations ??= Equation.OPERATIONS; //use basic as default
    let ret = false;    
    if (this.values.length > 1) {
      const options = Equation.buildEqOptions(operations, this.values.length-1);  
      for (let i = 0; i < options.length && !ret; i++) {
        const op = options[i];
        const calc = this.values.reduce((sum, v, index) => {
          return index === 0
            ? v
            : op[index-1].fn(sum, v);
        }, 0);        
        if (this.result === calc) { ret = true; }
      }      
    }
    return ret;
  }

  display(logger?: Logger, solutions?: Operation[][]) {
    logger ??= new Logger();
    if (Array.isArray(solutions)) {
      logger.writeColor(solutions.length === 0 ? chalk.bold.redBright : chalk.bold.greenBright, this.result);
    }
    else {
      logger.writeColor(chalk.bold.whiteBright, this.result);
    }
    logger.writeColor(chalk.cyan, ' : ');
    this.values.forEach((v, index) => {
      if (index > 0) {
        if (Array.isArray(solutions) && solutions.length > 0) {
          logger.writeColor(chalk.bold.cyanBright, ` ${solutions.at(0).at(index-1).label} `);
        }
        else {
          logger.writeColor(chalk.gray, ' ? ');
        }
      }
      logger.writeColor(chalk.white, v);      
    })
    logger.writeLine();
  }

  

  /// STATIC PROPS / METHODS
  public static OPERATIONS: Operation[] = [
    { label: '+', fn: add },
    { label: '*', fn: multiply },
  ]
  public static OPERATIONS_EXPANDED: Operation[] = [
    ...this.OPERATIONS,
    { label: '||', fn: concat },
  ]
  
  public static create(line: string): Equation {
    const parts = line.split(':').map(v => v.trim());
    if (parts.length === 2) {
      const result = parsers.toIntAssert(parts[0], 'high');
      const values = parsers.toIntArrayAssert(parts[1], ' ', 'high');
      return new Equation(result, values);
    }

    //else
    throw new Error(`Unable to parse string to equation: ${line}`);
  }

  public static buildEqOptions(operations: Operation[], count: number) {
    //counter is has COUNT number of slots between 0 and X (one less than the number of operations)
    //  it is used to create the options arrays where the 
    //  slots represent the operation indices of the values in each option.
    const counter = new Counter(count, operations.length-1); 
    const result: Operation[][] = [];
    while (!counter.isFull) {
      result.push(counter.slots.map(s => operations[s]));
      counter.increment();
    }
    //add the last option
    result.push(counter.slots.map(s => operations[s]));

    return result;
  }
  
}

function splitArray(arr: any[], index: number) {
  return [
    [...arr.slice(0,index),],
    [...arr.slice(index)]
  ]
}