export class Counter {
  private _store: number[];
  get slots() { return [...this._store];  }  

  get slotCount() { return this._store.length; }

  get value() {
    const base = this.slotCount;
    return this.slots.reduce((sum, num, index) => {
      return sum + Math.pow(num - this.initial, base - index)
    }, 0);
  }
  get maxValue() {
    const base = this.slotCount;
    return Array(base).reduce((sum, _, index) => {
      return sum + Math.pow(this.maxPerSlot-this.initial, base - index);
    }, 0);
  }
  
  private _initial: number;
  get initial() { return this._initial; }

  private _maxPerSlot: number;
  get maxPerSlot() { return this._maxPerSlot; }

  get isFull() { return this._store.every(m => m >= this.maxPerSlot); }


  
  constructor(slots: number, maxPerSlot: number, initial = 0) {
    this._initial = initial;
    this._store = new Array(slots).fill(initial);
    this._maxPerSlot = maxPerSlot;
  }


  at(index: number) {
    if (index >= 0 && index < this.slotCount) {
      return this._store[index];
    }
    //else
    throw new Error(`Attempt to access counter outside bounds: ${index}`);
  }

  increment() {
    let index = -1;
    for (let i = this.slotCount-1; i >= 0 && index < 0; i--) {
      const num = this._store[i];
      if (num < this.maxPerSlot) {
        index = i;
      }
    }
    if (index < 0) {
      return false; //isFull
    }
    //else
    this._store[index] += 1;
    while (index < this.slotCount-1) {
      index++;
      this._store[index] = 0;
    }
    return true;
  }
  
}