// @ts-check

import assert from "node:assert/strict";
import test from "node:test";
import { matchesWhenRule, parseShift, parseWhenRule } from "../src/time-rules.js";

test("parses day and hour ranges", () => {
  const rule = parseWhenRule("mon-fri 2-10");
  assert.deepEqual([...rule.days], [1, 2, 3, 4, 5]);
  assert.equal(rule.startHour, 2);
  assert.equal(rule.endHour, 10);
});

test("parses wrapping day ranges", () => {
  const rule = parseWhenRule("fri-mon 9-17");
  assert.deepEqual([...rule.days], [5, 6, 0, 1]);
});

test("rejects invalid when rules", () => {
  assert.throws(() => parseWhenRule("monday 2-10"), /Expected --when/);
  assert.throws(() => parseWhenRule("mon-fri 10-2"), /Hour range/);
  assert.throws(() => parseWhenRule("mon-fri 2-25"), /within 0-24/);
});

test("matches half-open local hour ranges", () => {
  const rule = parseWhenRule("fri 2-10");
  assert.equal(matchesWhenRule(new Date(2026, 5, 12, 2, 0, 0), rule), true);
  assert.equal(matchesWhenRule(new Date(2026, 5, 12, 9, 59, 59), rule), true);
  assert.equal(matchesWhenRule(new Date(2026, 5, 12, 10, 0, 0), rule), false);
});

test("parses signed shifts", () => {
  assert.equal(parseShift("+5h"), 5 * 60 * 60 * 1000);
  assert.equal(parseShift("-2h"), -2 * 60 * 60 * 1000);
  assert.equal(parseShift("+30m"), 30 * 60 * 1000);
  assert.throws(() => parseShift("5h"), /Expected --by/);
});
