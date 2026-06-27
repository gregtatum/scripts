// @ts-check

import assert from "node:assert/strict";
import test from "node:test";
import { parseGitShiftArgs } from "../src/index.js";

test("parses negative --by durations", () => {
  const { values, positionals } = parseGitShiftArgs([
    "HEAD~10..HEAD",
    "--when",
    "fri 0-24",
    "--by",
    "-2h",
    "--list",
  ]);

  assert.deepEqual(positionals, ["HEAD~10..HEAD"]);
  assert.equal(values.when, "fri 0-24");
  assert.equal(values.by, "-2h");
  assert.equal(values.list, true);
});
