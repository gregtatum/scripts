// @ts-check

import { color } from "./ansi.js";
import { formatTimeShift } from "./format.js";

/**
 * @param {import("./shift-plan.js").PlannedCommit[]} plan
 */
export function printShiftPlan(plan) {
  console.log(`${color.green("+")} shifted  ${color.cyan("~")} clamped  ${color.dim("-")} unchanged`);

  for (const commit of plan) {
    const hash = color.yellow(commit.shortHash.padEnd(8));
    const author = commit.authorName.padEnd(12);
    const decorations = commit.decorations ? color.cyan(` (${commit.decorations})`) : "";
    const subject = commit.matches ? color.white(commit.subject) : color.dim(commit.subject);
    const timing = formatTimeShift(commit.authorDate, commit.newAuthorDate);
    const marker = commit.matches ? (commit.clamped ? color.cyan("~") : color.green("+")) : color.dim("-");
    const timingText = commit.matches
      ? commit.clamped
        ? color.cyan(timing)
        : color.green(timing)
      : color.dim(timing);

    console.log(`${marker} ${hash} ${timingText}  ${author}${decorations} ${subject}`);
  }
}
