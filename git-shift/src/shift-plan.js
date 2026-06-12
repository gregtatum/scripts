// @ts-check

import { matchesWhenRule } from "./time-rules.js";

export const MIN_SPACING_MS = 60 * 1000;

/**
 * @typedef {{
 *   hash: string,
 *   shortHash: string,
 *   authorName: string,
 *   authorDate: Date,
 *   committerDate: Date,
 *   decorations: string,
 *   subject: string,
 * }} CommitInfo
 *
 * @typedef {CommitInfo & {
 *   matches: boolean,
 *   clamped: boolean,
 *   impossible: boolean,
 *   newAuthorDate: Date,
 *   newCommitterDate: Date,
 * }} PlannedCommit
 */

/**
 * @param {CommitInfo[]} commits parent-to-child order
 * @param {import("./time-rules.js").WhenRule} whenRule
 * @param {number} shiftMs
 * @returns {PlannedCommit[]}
 */
export function buildShiftPlan(commits, whenRule, shiftMs) {
  /** @type {PlannedCommit[]} */
  const plan = commits.map(commit => {
    const matches = matchesWhenRule(commit.authorDate, whenRule);
    const newAuthorDate = matches
      ? new Date(commit.authorDate.getTime() + shiftMs)
      : new Date(commit.authorDate);
    const newCommitterDate = matches
      ? new Date(commit.committerDate.getTime() + shiftMs)
      : new Date(commit.committerDate);

    return {
      ...commit,
      matches,
      clamped: false,
      impossible: false,
      newAuthorDate,
      newCommitterDate,
    };
  });

  clampPlan(plan, "newAuthorDate");

  for (const commit of plan) {
    if (commit.matches && commit.clamped) {
      const authorDelta = commit.newAuthorDate.getTime() - commit.authorDate.getTime();
      commit.newCommitterDate = new Date(commit.committerDate.getTime() + authorDelta);
    }
  }

  return plan;
}

/**
 * @param {PlannedCommit[]} plan
 * @param {"newAuthorDate"} field
 */
function clampPlan(plan, field) {
  const maxIterations = Math.max(1, plan.length * plan.length);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let moved = false;

    for (let index = 1; index < plan.length; index++) {
      const previous = plan[index - 1];
      const commit = plan[index];
      const gap = commit[field].getTime() - previous[field].getTime();
      if (gap >= MIN_SPACING_MS) {
        continue;
      }

      if (commit.matches) {
        commit[field] = new Date(previous[field].getTime() + MIN_SPACING_MS);
        commit.clamped = true;
        moved = true;
      } else if (previous.matches) {
        previous[field] = new Date(commit[field].getTime() - MIN_SPACING_MS);
        previous.clamped = true;
        moved = true;
      } else {
        previous.impossible = true;
        commit.impossible = true;
      }
    }

    if (!moved) {
      break;
    }
  }

  markImpossibleViolations(plan, field);
}

/**
 * @param {PlannedCommit[]} plan
 * @param {"newAuthorDate"} field
 */
function markImpossibleViolations(plan, field) {
  for (let index = 1; index < plan.length; index++) {
    const previous = plan[index - 1];
    const commit = plan[index];
    if (commit[field].getTime() - previous[field].getTime() >= MIN_SPACING_MS) {
      continue;
    }
    previous.impossible = true;
    commit.impossible = true;
  }
}

/**
 * @param {PlannedCommit[]} plan
 */
export function assertPossiblePlan(plan) {
  const impossible = plan.filter(commit => commit.impossible);
  if (impossible.length > 0) {
    const hashes = impossible.map(commit => commit.shortHash).join(", ");
    throw new Error(`Could not preserve 1 minute timestamp spacing for: ${hashes}`);
  }
}

/**
 * @param {PlannedCommit[]} plan
 */
export function hasChanges(plan) {
  return plan.some(commit => commit.newAuthorDate.getTime() !== commit.authorDate.getTime());
}
