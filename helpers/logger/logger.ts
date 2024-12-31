import chalk from "chalk";
import { Cursor } from "./cursor.ts";
import { ESC_CODES } from "./escape-codes.ts";
import { ILoggerOut } from "./logger.interface.ts";
import { IWriter } from "./writer.interface.ts";

export class Logger {
  #out: ILoggerOut;
  #writer: IWriter;

  constructor(target?: ILoggerOut) {
    this.#out = target ?? console;
    this.#writer = process.stdout;
    this.move = new Cursor();
  }

  //standard
  debug(...params: unknown[]) {
    this.#out.log(chalk.bgGrey.yellow("> DEBUG >", ...params), chalk.reset());
  }
  log(...params: unknown[]) {
    this.#out.log(...params);
  }
  warn(...params: unknown[]) {
    this.#out.log(chalk.bgYellow.whiteBright("> WARN >", ...params), chalk.reset());
  }
  error(...params: unknown[]) {
    this.#out.log(chalk.bgRed.whiteBright("> ERROR >", ...params), chalk.reset());
  }

  //without newline
  write(...params: unknown[]) {
    this.#writer.write(this.#parseUnknown(params));
  }
  writeColor(color: (text: string) => string, ...params: unknown[]) {
    this.write(color(this.#parseUnknown(params)) + chalk.reset());
  }
  writeLine(...params: unknown[]) {
    this.write(...params);
    this.#writer.write('\n');
  }

  //clear the console
  clear() {
    this.#out.log(ESC_CODES.clear);
  }

  move: Cursor;


  #parseUnknown(values: unknown[]) {
    return values.map(v => `${v}`).join('');
  }
}