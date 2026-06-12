// @ts-check

import { color } from "./ansi.js";
import { formatHumanDate } from "./format.js";

/**
 * @param {import("./shift-plan.js").PlannedCommit[]} plan
 */
export function printShiftPlan(plan) {
  for (const commit of plan) {
    const hash = color.yellow(commit.shortHash.padEnd(8));
    const author = commit.authorName.padEnd(12);
    const decorations = commit.decorations ? color.cyan(` (${commit.decorations})`) : "";
    const subject = commit.matches ? color.white(commit.subject) : color.dim(commit.subject);
    const before = formatHumanDate(commit.authorDate);
    const after = formatHumanDate(commit.newAuthorDate);
    const marker = commit.matches ? (commit.clamped ? color.cyan("~") : color.green("+")) : color.dim("-");
    const afterText = commit.matches
      ? commit.clamped
        ? color.cyan(after)
        : color.green(after)
      : color.dim(after);

    console.log(`${marker} ${hash} ${before} -> ${afterText} ${author}${decorations} ${subject}`);
  }
}
