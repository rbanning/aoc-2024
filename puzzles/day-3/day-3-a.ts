import { parsers } from '../../helpers/parsers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

const verbose = new Verbose();

function parseValidCommands(input: string) {
  const regex = /(mul\(\d{1,3},\d{1,3}\))/g;
  const matches = input.matchAll(regex);  
  return Array.from(matches, (m) => m[0]);
}
function execCommand(command: string): number {
  command = command.substring('mul('.length); //remove front
  command = command.substring(0, command.length-1);
  return command
    .split(',')
    .reduce((sum, str) => sum*parsers.toIntAssert(str), 1);
}

export async function day3a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);

  //combine into one line of text and parse
  const commands = parseValidCommands(data.join(''))
  return commands.reduce((sum, cmd) => sum + execCommand(cmd), 0);

}

Verbose.setActive(false);
const answer = await day3a();
outputHeading(3, 'a');
outputAnswer(answer);