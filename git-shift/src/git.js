// @ts-check

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { formatGitDate } from "./format.js";

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{env?: NodeJS.ProcessEnv, stdio?: import("node:child_process").StdioOptions}} [options]
 */
export function runGit(command, args, options = {}) {
  const actualArgs = command === "git" ? ["-c", "core.fsmonitor=false", ...args] : args;
  const result = spawnSync(command, actualArgs, {
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || `${command} ${args.join(" ")} failed`;
    throw new Error(detail);
  }

  return typeof result.stdout === "string" ? result.stdout.trim() : "";
}

/**
 * @param {string} range
 */
export function parseTwoDotRange(range) {
  if (range.includes("...")) {
    throw new Error("Only two-dot ranges are supported, for example HEAD~10..HEAD.");
  }
  const parts = range.split("..");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Expected a two-dot range, for example HEAD~10..HEAD.");
  }
  return { base: parts[0], tip: parts[1] };
}

/**
 * @param {string} range
 * @returns {import("./shift-plan.js").CommitInfo[]}
 */
export function readCommits(range) {
  const hashesOutput = runGit("git", ["rev-list", "--reverse", range]);
  const hashes = hashesOutput ? hashesOutput.split("\n") : [];
  if (hashes.length === 0) {
    throw new Error(`No commits found for range "${range}".`);
  }

  const format = "%H%x1f%h%x1f%an%x1f%aI%x1f%cI%x1f%D%x1f%s%x1e";
  return hashes.map(commitHash => {
    const record = runGit("git", ["show", "-s", `--format=${format}`, commitHash]).trim().replace(/\x1e$/, "");
    const [hash, shortHash, authorName, authorDate, committerDate, decorations, subject] = record.split("\x1f");
    return {
      hash,
      shortHash,
      authorName,
      authorDate: new Date(authorDate),
      committerDate: new Date(committerDate),
      decorations: decorations ?? "",
      subject: subject ?? "",
    };
  });
}

export function assertCleanWorkingTree() {
  const status = runGit("git", ["status", "--porcelain"]);
  if (status !== "") {
    throw new Error("Working tree is not clean. Commit or stash changes before rewriting history.");
  }
}

/**
 * @param {string} name
 */
export function createBackupRef(name) {
  const head = runGit("git", ["rev-parse", "HEAD"]);
  const ref = `refs/backup/git-shift/${name}`;
  runGit("git", ["update-ref", ref, head]);
  return ref;
}

/**
 * @param {import("./shift-plan.js").PlannedCommit[]} plan
 */
export function writeRebasePlan(plan) {
  const dir = mkdtempSync(join(tmpdir(), "git-shift-"));
  const planPath = join(dir, "plan.json");
  const data = {};
  for (const commit of plan) {
    if (!commit.matches && !commit.clamped) {
      continue;
    }
    data[commit.hash] = {
      authorDate: formatGitDate(commit.newAuthorDate),
      committerDate: formatGitDate(commit.newCommitterDate),
    };
  }
  writeFileSync(planPath, JSON.stringify(data, null, 2));
  return planPath;
}

/**
 * @param {string} range
 * @param {import("./shift-plan.js").PlannedCommit[]} plan
 */
export function applyShiftPlan(range, plan) {
  const { base } = parseTwoDotRange(range);
  assertCleanWorkingTree();
  const backupRef = createBackupRef(new Date().toISOString().replace(/[:.]/g, "-"));
  const planPath = writeRebasePlan(plan);
  const editor = new URL("./rebase-editor.js", import.meta.url).pathname;
  const amend = new URL("./amend-commit.js", import.meta.url).pathname;

  const env = {
    GIT_SHIFT_PLAN: planPath,
    GIT_SHIFT_AMEND: amend,
    GIT_SEQUENCE_EDITOR: `node ${editor}`,
  };

  try {
    runGit("git", ["rebase", "-i", base], { env, stdio: "inherit" });
  } catch (error) {
    throw new Error(
      [
        error instanceof Error ? error.message : String(error),
        "",
        `A backup ref was created at ${backupRef}.`,
        "Resolve or abort the rebase with `git rebase --abort`.",
      ].join("\n")
    );
  }

  return backupRef;
}
