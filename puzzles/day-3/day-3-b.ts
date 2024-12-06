import { parsers } from '../../helpers/parsers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

const verbose = new Verbose();


function stripDonts(input: string) {
  const regex = /(don't\(\)[\s\S]*?do\(\))/g;   //FRUSTRATED ... used [\s\S]* not [\s\S]*? ... hour debugging :-(
  input = input.replace(regex, '');
  //remove any tailing don't()
  const index = input.indexOf("don't()");
  if (index >=0 ) {
    input = input.substring(0, index);
  }
  // const trailingDont = /(don't\(\)[\s\S]*)$/
  // input = input.replace(trailingDont, '');
  return input;
}

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



export async function day3b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);

    //combine into one line of text and strip out doNots
    const cleanData = stripDonts(data.join(''));
    const commands = parseValidCommands(cleanData);

    //console.log("Commands: ", commands);

    return commands.reduce((sum, cmd) => sum + execCommand(cmd), 0);

    //10345261
  
}

Verbose.setActive(false);
const answer = await day3b();
outputHeading(3, 'b');
outputAnswer(answer);