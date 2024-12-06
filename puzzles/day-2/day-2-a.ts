import { isNullable, Nullable } from '../../helpers/nullable.type.ts';
import { parsers } from '../../helpers/parsers.ts';
import { readData, outputHeading, outputAnswer, Verbose } from '../../shared.ts';

const verbose = new Verbose();

type Level = number;  
type Report = Level[];
type ReportMode = 'increasing' | 'decreasing';
function parseToReport(line: string): Level[] {
  return parsers.toIntArrayAssert(line);
}

function isSafe(report: Report, maxDelta: number = 3) {
  let mode: Nullable<ReportMode>;
  return report.every((current, index) => {
    //skip first element
    if (index === 0) { return true; }

    //else
    const previous = report[index-1];
    const delta = (previous - current);
    mode ??= delta < 0
      ? 'decreasing'
      : delta > 0
        ? 'increasing'
        :  null;
    return !isNullable(mode)
      && Math.abs(delta) <= maxDelta
      && (mode === 'increasing' ? delta > 0 : delta < 0);
  })
}

export async function day2a(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const reports = data.map(m => parseToReport(m));
  return reports.filter(m => isSafe(m)).length;
}

Verbose.setActive(false);
const answer = await day2a();
outputHeading(2, 'a');
outputAnswer(answer);

