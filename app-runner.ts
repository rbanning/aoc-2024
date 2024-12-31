import { outputAnswer, outputHeading, Test } from "./shared.ts";

export async function appRunner(day: number, test: Test, callback: () => unknown) {
  const startTime = performance.now();
  outputHeading(day, test);

  const answer = await callback();

  const endTime = performance.now();
  outputAnswer(answer, formatTimeElapsed(endTime - startTime));
}


function formatTimeElapsed(ms: number) {
  if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  }

  let sec = Math.round(ms/1000);
  if (sec < 60) {
    return `${sec} sec.`;
  }

  let min = Math.floor(sec / 60);
  sec = sec % 60;
  if (min < 60) {
    return `${min} min. ${sec} sec.`;
  }

  let hr = Math.floor(min / 60);
  min = min % 60;
  return `${hr} hr. ${min} min. ${sec} sec.`;
}