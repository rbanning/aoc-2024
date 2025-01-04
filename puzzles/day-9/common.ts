import chalk from "chalk";
import { Logger } from "../../helpers/logger/logger.ts";
import { parsers } from "../../helpers/parsers.ts";
import { primitive } from "../../helpers/primitive.ts";

export type FileInfo = {
  id: number;
  len: number;
  free: number;
}
export type Free = '.';
export const FREE: Free = '.';
export type DiskLayoutItem = number | Free;
export type DiskLayout = DiskLayoutItem[];

export type DiskSection = {
  start: number,
  length: number
}

export class DiskMap {
  private _files: FileInfo[];
  private _layout: DiskLayout;

  constructor(input?: string) {
    this._files = [];
    this._layout = [];
    if (input) { 
      this.map(input); 
      this.buildLayout();
    }
  }


  map(input: string) {
    this._files = input.split('').reduce((ret: FileInfo[], str, index) => {
      if (index % 2 === 0) {
        ret.push({
          id: index / 2,
          len: parsers.toIntAssert(str),
          free: 0
        })
      } else {
        ret.at(-1).free = parsers.toIntAssert(str);
      }
      return ret;
    }, []);
  }

  buildLayout() {
    this._layout = this._files.reduce((ret: DiskLayout, file) => {
      for (let i = 0; i < file.len; i++) {
        ret.push(file.id);        
      }
      for (let i = 0; i < file.free; i++) {
        ret.push(FREE);        
      }
      return ret;
    }, []);
  }



  optimize() {
    let front = 0;
    let back = this._layout.length-1;

    const advance = () => {
      while (this._layout[front] !== FREE && front < back) { 
        front += 1; 
      }
      while (this._layout[back] === FREE && front < back) { 
        back -= 1; 
      }
    }

    advance();
    while (front < back) {
      //switch
      this._layout[front] = this._layout[back];
      this._layout[back] = FREE;
      advance();
    }

    //DONE
  }

  optimizeWithDefrag() {
    const front = 0;
    let back = this._layout.length-1;

    while (front < back) {
      const nextFile = this.getNextFileSection(back, front);
      if (nextFile) {
        //found a file
        const nextFree = this.getNextFreeSection(front, back, nextFile.length);
        if (nextFree) {
          //found free space for the file
          this.moveFile(nextFree, nextFile);
        }
        back = nextFile.start - nextFile.length;
      }
      else {
        back = front;
      }
    }
  }

  private getNextFreeSection(start: number, stopAt: number, minLength: number) {
    let pointer = start;
    let found: DiskSection | null = null;    
    while (!found && pointer < stopAt) {
      found = this.getNextSection(1, pointer, stopAt, (v) => v === FREE);
      if (found) {
        if (found.length < minLength) { 
          //too short, continue search
          pointer = found.start + found.length;
          found = null; //reset
        }
      }
      else {
        // no free sections found (so end);
        pointer = stopAt; 
      }
    }
    return found;
  }
  private getNextFileSection(start: number, stopAt: number) {
    return this.getNextSection(-1, start, stopAt, primitive.isNumber);
  }

  private getNextSection(
      delta: 1 | -1, //increment or decrement
      start: number, //starting index
      stopAt: number, //stop if index get to this point
      predicate: (v: DiskLayoutItem) => boolean //what are we looking for
  ) 
  : DiskSection | null    // returns null if not found
  {
    const inbounds = (index: number) => {
      return delta > 0
        ? index < stopAt
        : index > stopAt;
    }
    while (inbounds(start) && !predicate(this._layout[start])) {
      start += delta;
    }
    let index = start;
    while (inbounds(index) && this._layout[index] === this._layout[start]) {
      index += delta;
    }
    if (inbounds(start)) {
      return {
        start,
        length: Math.abs(index - start)
      };
    }
    //else - none found
    return null;
  }

  private moveFile(
    free: DiskSection,
    file: DiskSection,
  ) {
    for (let index = 0; index < file.length; index++) {
      const target = free.start + index;
      const source = file.start - index;
      this._layout[target] = this._layout[source];
      this._layout[source] = FREE; 
    }
  }


  checksum() {
    return this._layout.reduce((sum: number, curr, index) => {
      if (primitive.isNumber(curr)) {
        sum += (curr * index);
      }
      return sum;
    }, 0);
  }
  

  display(logger?: Logger) {
    logger ??= new Logger();
    return {
      original: () => this.displayOriginal(logger),
      layout: () => this.displayLayout(logger),
    }
  }


  private displayOriginal(logger: Logger) {
    this._files.forEach(file => {
      logger.writeColor(chalk.bold.whiteBright, this.repeat(file.id, file.len));
      if (file.free > 0) {
        logger.writeColor(chalk.gray, this.repeat(FREE, file.free));
      }
    });
    logger.writeLine();
  }

  private displayLayout(logger: Logger) {
    this._layout.forEach(v => {
      if (primitive.isNumber(v)) {
        logger.writeColor(chalk.bold.whiteBright, v);
      } else {
        logger.writeColor(chalk.gray, v);
      }
    })
    logger.writeLine();
  }

  private repeat(v: DiskLayoutItem, count: number) {
    return Array(count).fill(v).join('');
  }
}