// Runs the real release version step, shows what it would produce, then undoes
// it — so the release can be tested before it runs for real on `main`.
//
// It runs `release:version`, the same task the release workflow runs. Testing a
// copy of the commands would only prove the copy works.
//
// Refuses to start unless the working tree is clean. That is the guard rail
// twice over: the revert cannot destroy uncommitted work, and the simulation
// cannot be committed by accident, because it reverts itself.

import { execFileSync, execSync } from "node:child_process";

const run = (command) => execSync(command, { encoding: "utf8" });
const show = (command) => execSync(command, { stdio: "inherit" });

const dirty = run("git status --porcelain").trim();
if (dirty) {
  console.error(
    "Working tree is not clean. Commit or stash first — this simulation reverts everything.\n",
  );
  console.error(dirty);
  process.exit(1);
}

console.log("Simulating the release version step...\n");

try {
  show("vp run release:version");

  console.log("\n--- versions after ---");
  show(
    "git --no-pager diff -- '**/package.json' .claude-plugin/plugin.json | grep -E '^[+-] +\"version\"' || true",
  );

  console.log("\n--- files touched ---");
  show("git status --short");
} finally {
  // The tree was verified clean above, so everything here is the simulation's.
  execFileSync("git", ["checkout", "--", "."], { stdio: "inherit" });
  execFileSync("git", ["clean", "-fdq", "--", "skills", ".changeset"], { stdio: "inherit" });
  console.log("\nReverted. Nothing to commit.");
}
