import { Nullable } from "./nullable.type.ts";

export type Primitive = Nullable<
  | string
  | number
  | boolean
  | symbol
  | bigint
>;