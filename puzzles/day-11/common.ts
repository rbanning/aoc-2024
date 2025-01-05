import chalk from "chalk";
import { Logger } from "../../helpers/logger/logger.ts";
import { mathHelpers } from "../../helpers/mathHelpers.ts";
import { parsers } from "../../helpers/parsers.ts";
import { primitive } from "../../helpers/primitive.ts";

//Transformation inspect the store at the given index
//  If the stone satisfies a rule, 
//    it will apply some transformation
//    and return the index of the stone affected
//    If the stone is divided, the returning index 
//      will point to the last stone of the group.
//  If the stone does NOT satisfy the rule,
//    it will return false.

type Transformation = (index: number) => number | false;

export class StoneLine {
  private _stones: number[] = [];

  get length() { return this._stones.length; }

  private _blinkCount: number = 0;
  get blinkCount() { return this._blinkCount; }

  constructor(line?: string) {
    if (line) { this.load(line); }
  }

  load(line: string) {
    this._stones = parsers.toIntArrayAssert(line, ' ', 'high');
  }


  display(logger?: Logger) {
    logger ??= new Logger();
    logger.writeColor(chalk.cyanBright, this.blinkCount);
    logger.writeColor(chalk.gray, ' [ ');
    for (let index = 0; index < this._stones.length; index++) {
      if (index > 0) {
        logger.writeColor(chalk.gray, ', ');        
      }
      logger.writeColor(chalk.whiteBright, this._stones[index]);
    }
    logger.writeColor(chalk.gray, ' ] ');
    logger.writeColor(chalk.red, this._stones.length);
    logger.writeLine();
  }


  progress(logger?: Logger) {
    logger ??= new Logger();
    logger.writeColor(chalk.cyanBright, this.blinkCount);
    logger.writeColor(chalk.gray, ') ');
    logger.writeColor(chalk.white, this._stones.length);
    logger.writeLine();
  }

  blink() {
    let index = 0;
    while (index < this._stones.length) {
      const result = this._transform(index);
      if (result === false) {
        throw new Error("Failed to apply transformation to #" + index);
      } else {
        index = result + 1;
      }
    }
    this._blinkCount += 1;
  }  

  private _transform(index: number): number | false {
    const transformations: Transformation[] = [this.zeroToOne, this.evenSplit, this.multiplyBy2024];
    let found = false;
    for (let i = 0; i < transformations.length && !found; i++) {
      const fn = transformations[i];
      const result = fn.apply(this, [index]);
      if (primitive.isNumber(result)) {
        index = result;
        found = true;
      }
    }

    return found 
      ? index 
      : false;
  }


  //#region >>> Transformations <<<
  
  private zeroToOne(index: number): number | false {
    if (this._stones[index] === 0) {
      this._stones[index] = 1;
      return index;
    }
    //else
    return false;
  }

  private evenSplit(index: number): number | false {
    const value = this._stones[index];
    const digits = mathHelpers.digits(this._stones[index]);
    if (digits % 2 === 0) {
      const divisor = Math.pow(10, digits/2);
      const a = Math.floor(value / divisor);
      const b = value % divisor;
      this._stones[index] = a;
      this._stones.splice(index + 1, 0, b);
      return index + 1;
    }
    //else
    return false;
  }

  private multiplyBy2024(index: number): number | false {
    if (true) {
      this._stones[index] = this._stones[index] * 2024;
      return index;
    }
    //else
    return false;
  }
}


type TransformationAdv = (key: number) => number[] | false;

export class StoneLineAdv {
  private _stones = new Map<number, number>();

  get length() { return Array.from(this._stones.values()).reduce((sum, v) => sum + v, 0); }

  private _blinkCount: number = 0;
  get blinkCount() { return this._blinkCount; }

  constructor(line?: string) {
    if (line) { this.load(line); }
  }

  load(line: string) {
    this._stones.clear();
    parsers.toIntArrayAssert(line, ' ', 'high').forEach(v => this.increment(v));
  }

  set(key: number, value: number) {
    this._stones.set(key, value);
  }

  increment(key: number) {
    this.set(key, (this._stones.get(key) ?? 0) + 1);
  }


  display(logger?: Logger) {
    logger ??= new Logger();
    logger.writeColor(chalk.cyanBright, this.blinkCount);
    logger.writeColor(chalk.gray, ' [ ');
    this._stones.forEach((value, key) => {
      logger.writeColor(chalk.whiteBright, key);
      logger.writeColor(chalk.gray, `x${value}, `);
    })
    logger.writeColor(chalk.gray, ' ] ');
    logger.writeColor(chalk.red, this.length);
    logger.writeLine();
  }


  progress(logger?: Logger) {
    logger ??= new Logger();
    logger.writeColor(chalk.cyanBright, this.blinkCount);
    logger.writeColor(chalk.gray, ') ');
    logger.writeColor(chalk.white, this.length);
    logger.writeLine();
  }

  blink() {
    let index = 0;
    const newMap = new Map<number, number>();

    this._stones.forEach((count, key) => {
      const result = this._transform(key);
      if (result === false) {
        throw new Error("Failed to apply transformation to #" + index);
      } else {
        result.forEach(r => {
          newMap.set(r, count + (newMap.get(r) ?? 0));
        })
      }
    })

    this._stones = newMap;
    this._blinkCount += 1;
  }  

  private _transform(value: number): number[] | false {
    const transformations: TransformationAdv[] = [this.zeroToOne, this.evenSplit, this.multiplyBy2024];
    let result: number[] | false = false;
    for (let i = 0; i < transformations.length && result === false; i++) {
      const fn = transformations[i];
      result = fn.apply(this, [value]);
    }

    return result;
  }


  //#region >>> Transformations <<<
  
  private zeroToOne(key: number): number[] | false {
    if (key === 0) {
      return [1];
    }
    //else
    return false;
  }

  private evenSplit(key: number): number[] | false {    
    const digits = mathHelpers.digits(key);
    if (digits % 2 === 0) {
      const divisor = Math.pow(10, digits/2);
      const a = Math.floor(key / divisor);
      const b = key % divisor;
      return [a, b];
    }
    //else
    return false;
  }

  private multiplyBy2024(key: number): number[] | false {
    if (true) {
      return [key * 2024]
    }
    //else
    return false;
  }
}