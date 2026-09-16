// Runs `claude plugin validate --strict` against the files git would ship, not the
// working directory.
//
// `--strict` warns on any CLAUDE.md or CLAUDE.local.md at the plugin root, because a
// plugin cannot ship project context that way. CLAUDE.local.md is per-developer and
// gitignored, so it never reaches a user — but it sits in the working directory and
// would fail every local run. Copying tracked plus untracked-but-not-ignored files
// into a temp directory validates exactly what a push would publish, and nothing
// that only exists on one machine.

import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);

const stage = mkdtempSync(join(tmpdir(), "validate-plugin-"));

try {
  for (const file of files) {
    const target = join(stage, file);
    mkdirSync(dirname(target), { recursive: true });
    // A path git still tracks but the working tree has deleted is not shipped either.
    try {
      cpSync(file, target);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  execFileSync("claude", ["plugin", "validate", stage, "--strict"], { stdio: "inherit" });
} catch (error) {
  process.exitCode = typeof error.status === "number" ? error.status : 1;
} finally {
  rmSync(stage, { recursive: true, force: true });
}
