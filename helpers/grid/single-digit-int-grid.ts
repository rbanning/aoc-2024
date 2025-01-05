import { parsers } from "../parsers.ts";
import { GenericGrid } from "./generic-grid.ts";

export class SingleDigitIntGrid extends GenericGrid<number> {

  constructor() {
    super((value: string) => parsers.toIntAssert(value.at(0))); //single digit int
  }
}