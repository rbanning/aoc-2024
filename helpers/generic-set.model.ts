export class GenericSet<T> {
  private _store: Set<string> = new Set();

  get size() {
    return this._store.size;
  }

  add(value: T) {
    return this._store.add(this.#transformValue(value));
  }

  has(value: T) {
    return this._store.has(this.#transformValue(value));
  }

  clear() {
    return this._store.clear();
  }

  delete(value: T) {
    return this._store.delete(this.#transformValue(value));
  }

  entries(): [T,T][] {
    return this.toArray().map(v => [v,v]);
  }

  forEach(callback: (a: T, b: T, set: GenericSet<T>) => void) {
    return this.toArray().forEach(v => callback(v, v, this));
  }

  keys(): T[] {
    return this.toArray();
  }
  values(): T[] {
    return this.toArray();
  }

  toArray(): T[] {
    return Array.from(this._store.entries()).map(tuple => this.#parseString(tuple[0]));

  }

  raw() {
    return new Set(this._store);
  }

  #transformValue(value: T): string {
    return JSON.stringify(value);
  }
  #parseString(str: string): T {
    return JSON.parse(str);
  }

  public static fromArray<T>(array: T[]): GenericSet<T> {
    const ret = new GenericSet<T>();
    for (let index = 0; index < array.length; index++) {
      ret.add(array[index]);      
    }
    return ret;
  }
}