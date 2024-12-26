import { GenericGrid } from "./generic-grid.ts";

export class CharGrid extends GenericGrid<string> {

  constructor() {
    super((value: string) => value.at(0));  //single character
  }
}