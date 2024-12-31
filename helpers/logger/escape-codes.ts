const ESC = '\x1b';
export const ESC_CODES = {
  clear: ESC + '[2J',

  save: ESC + '7',
  restore: ESC + '8',

  move: {
    home: ESC + '[H',
    to: (x: number, y: number) => ESC + `[{${y}};{${x}}`,
    toCol: (x: number) => ESC + `[${x}G`,
    up: (lines: number) => ESC + `[${lines}A`,
    down: (lines: number) => ESC + `[${lines}B`,
    right: (lines: number) => ESC + `[${lines}C`,
    left: (lines: number) => ESC + `[${lines}D`,
    beginning: {
      next: (lines: number) => ESC + `[${lines}E`,
      previous: (lines: number) => ESC + `[${lines}F`,
    },

    save: ESC + '[s',
    recall: ESC + '[r',

  }
}