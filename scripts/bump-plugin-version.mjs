// Bumps the patch of `.claude-plugin/plugin.json`'s version.
//
// Claude Code uses that version as the cache key for update detection: if it
// does not change, `/plugin update` reports users are already up to date and
// they never receive the new skills. Skills here version independently, so
// there is no repo-level number to mirror — the plugin version is a serial
// number for the bundle, and only has to differ from the last release.
//
// Run by the release workflow immediately after `changeset version`, so the
// bump lands in the same release pull request. Never edit the version by hand.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MANIFEST = new URL("../.claude-plugin/plugin.json", import.meta.url);

/** "1.2.3" -> "1.2.4". Throws on anything that is not MAJOR.MINOR.PATCH. */
export function bumpPatch(version) {
  // Digits per part, not Number(): "1..0" splits into three parts and
  // Number("") is a perfectly valid 0, so it would bump to "1.0.1".
  const parts = String(version ?? "").split(".");
  if (parts.length !== 3 || !parts.every((part) => /^\d+$/.test(part))) {
    throw new Error(
      `plugin.json version must be MAJOR.MINOR.PATCH, got ${JSON.stringify(version)}`,
    );
  }
  const [major, minor, patch] = parts.map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function main() {
  const source = readFileSync(MANIFEST, "utf8");
  const from = JSON.parse(source).version;
  const to = bumpPatch(from);

  // Patch the one line rather than re-serialising: JSON.stringify would expand
  // the inline arrays the formatter keeps on one line, turning a one-line bump
  // into a reformat that then fails `vp check`.
  const before = `"version": "${from}"`;
  const after = `"version": "${to}"`;
  if (!source.includes(before)) throw new Error(`could not find ${before} in plugin.json`);
  writeFileSync(MANIFEST, source.replace(before, after));

  console.log(`plugin.json: ${from} -> ${to}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
