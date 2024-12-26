import { parsers } from "../../helpers/parsers.ts";

export type OrderTuple = [number, number];


export class OrderingList {
  #data: OrderTuple[] = [];

  load(lines: string[]) {
    this.#data = lines.map(line => {
      const parts = parsers.toIntArrayAssert(line, '|');
      return parts.length === 2
        ? [parts[0], parts[1]]
        : null;
    });
  }


  validate(values: number[]) {
    if (values.length > 1) {
      const [current, ...rest] = values;
      return rest.every(v => !this.#data.some(t => t[0] === v && t[1] === current))
        && this.validate(rest);
    }
    //else
    return true;
  }

  sort(values: number[]) {
    values.sort((a,b) => {
      return (this.validate([a,b]))
        ? -1
        : 1;
    });
    return values;
  }

}