import { isNullable, Nullable } from '../../helpers/nullable.type.ts';
import { parsers } from '../../helpers/parsers.ts';
import { appRunner } from '../../app-runner.ts';
import { readData, Verbose } from '../../shared.ts';
Verbose.setActive(false);
const verbose = new Verbose();

await appRunner(2, 'b', day2b);


type Level = number;  
type Report = Level[];
type ReportMode = 'increasing' | 'decreasing';


export async function day2b(dataPath?: string) {
  const data = (await readData(dataPath)).filter(Boolean);
  const reports = data.map(m => parseToReport(m));
  return reports.filter(m => isSafeWithProblemDampener(m)).length;
}



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

function isSafeWithProblemDampener(report: Report, maxDelta: number = 3) {
  let clone = [...report];
  let problemIndex = 0;
  let result: boolean = isSafe(clone);
  while (!result && problemIndex < report.length) {
    clone = [...report];
    clone.splice(problemIndex, 1);
    result = isSafe(clone);
    problemIndex += 1;
  }
  return result;
}

