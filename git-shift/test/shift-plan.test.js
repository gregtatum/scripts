// @ts-check

import assert from "node:assert/strict";
import test from "node:test";
import { assertPossiblePlan, buildShiftPlan } from "../src/shift-plan.js";
import { parseWhenRule } from "../src/time-rules.js";

/**
 * @param {string} hash
 * @param {Date} date
 */
function commit(hash, date) {
  return {
    hash,
    shortHash: hash.slice(0, 7),
    authorName: "Greg Tatum",
    authorDate: date,
    committerDate: date,
    decorations: "",
    subject: `commit ${hash}`,
  };
}

test("shifts matching commits and leaves non-matches alone", () => {
  const rule = parseWhenRule("fri 2-10");
  const commits = [
    commit("aaaaaaaa", new Date(2026, 5, 12, 1, 0, 0)),
    commit("bbbbbbbb", new Date(2026, 5, 12, 2, 0, 0)),
  ];
  const plan = buildShiftPlan(commits, rule, 5 * 60 * 60 * 1000);

  assert.equal(plan[0].matches, false);
  assert.equal(plan[0].newAuthorDate.getHours(), 1);
  assert.equal(plan[1].matches, true);
  assert.equal(plan[1].newAuthorDate.getHours(), 7);
});

test("clamps shifted commits to preserve parent ordering", () => {
  const rule = parseWhenRule("fri 2-10");
  const commits = [
    commit("aaaaaaaa", new Date(2026, 5, 12, 8, 0, 0)),
    commit("bbbbbbbb", new Date(2026, 5, 12, 9, 0, 0)),
    commit("cccccccc", new Date(2026, 5, 12, 9, 0, 30)),
  ];
  const plan = buildShiftPlan(commits, rule, 5 * 60 * 1000);

  assert.equal(plan[1].clamped, false);
  assert.equal(plan[2].clamped, true);
  assert.equal(plan[2].newAuthorDate.getTime() - plan[1].newAuthorDate.getTime(), 60 * 1000);
  assert.doesNotThrow(() => assertPossiblePlan(plan));
});

test("reports impossible dense ranges", () => {
  const rule = parseWhenRule("fri 2-10");
  const commits = [
    commit("aaaaaaaa", new Date(2026, 5, 12, 1, 0, 0)),
    commit("bbbbbbbb", new Date(2026, 5, 12, 1, 0, 30)),
  ];
  const plan = buildShiftPlan(commits, rule, 5 * 60 * 60 * 1000);

  assert.throws(() => assertPossiblePlan(plan), /Could not preserve 1 minute/);
});
