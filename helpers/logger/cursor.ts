import { ESC_CODES } from "./escape-codes.ts";
import { IWriter } from "./writer.interface.ts";

export class Cursor {
  #out: IWriter;

  constructor(out?: IWriter) {
    this.#out = out ?? process.stdout;
  }

  get beginning() {
    return {
      line: () => this.toCol(0),
      next: (lines: number) => { this.#out.write(ESC_CODES.move.beginning.next(lines)); },
      previous: (lines: number) => { this.#out.write(ESC_CODES.move.beginning.previous(lines)); },
    }
  }

  home() { this.#out.write(ESC_CODES.move.home); }
  to(x: number, y: number) { this.#out.write(ESC_CODES.move.to(x,y)); }
  toCol(x: number) { this.#out.write(ESC_CODES.move.toCol(x)); }
  up(lines: number) { this.#out.write(ESC_CODES.move.up(lines)); }
  down(lines: number) { this.#out.write(ESC_CODES.move.down(lines)); }
  right(lines: number) { this.#out.write(ESC_CODES.move.right(lines)); }
  left(lines: number) { this.#out.write(ESC_CODES.move.left(lines)); }  

  saveLocation() { this.#out.write(ESC_CODES.save); }
  restoreLocation() { this.#out.write(ESC_CODES.restore); }
}