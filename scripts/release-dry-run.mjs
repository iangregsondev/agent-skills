// Runs the real release version step, shows what it would produce, then undoes
// it — so the release can be tested before it runs for real on `main`.
//
// It runs `release:version`, the same task the release workflow runs. Testing a
// copy of the commands would only prove the copy works.
//
// Refuses to start unless the working tree is clean. That is the guard rail
// twice over: the revert cannot destroy uncommitted work, and the simulation
// cannot be committed by accident, because it reverts itself.
//
// Pass --keep to skip the revert and inspect the files directly. It then prints
// how to clean up, because nothing else will.

import { execFileSync, execSync } from "node:child_process";

const keep = process.argv.includes("--keep");
const git = (...args) => execFileSync("git", args, { stdio: "inherit" });

const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim();
if (dirty) {
  console.error(
    "Working tree is not clean. Commit or stash first — this simulation reverts everything.\n",
  );
  console.error(dirty);
  process.exit(1);
}

console.log("Simulating the release version step...\n");

try {
  execSync("vp run release:version", { stdio: "inherit" });

  // Stage everything so the diff includes generated files such as CHANGELOG.md.
  // Untracked files are invisible to `git diff` otherwise, and the changelog is
  // the part most worth reading.
  git("add", "-A");
  console.log("\n=== what the release would produce ===\n");
  git("--no-pager", "diff", "--cached");
} finally {
  if (keep) {
    console.log("\nLeft in place (--keep). To clean up:");
    console.log("  git reset --hard && git clean -fd -- skills .changeset");
  } else {
    // The tree was verified clean above, so everything here is the simulation's.
    git("reset", "--hard", "--quiet");
    git("clean", "-fdq", "--", "skills", ".changeset");
    console.log("\nReverted. Nothing to commit.");
  }
}
