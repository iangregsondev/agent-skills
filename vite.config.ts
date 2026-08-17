import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
    tasks: {
      // Uncached: the run takes under a second, and a cache that misses the
      // manifest replays a stale pass — which is how a broken plugin.json
      // once got a green light locally and only failed in CI.
      //
      // No --strict. The plugin root is this repo's workspace root, so CLAUDE.md
      // sits beside plugin.json and the validator warns it is not shipped to
      // plugin users — true, and not resolvable while the manifest stays at the
      // root. --strict fails the run on it. Errors still fail without the flag,
      // so a malformed manifest or a skills path pointing nowhere is still caught.
      "validate:plugin": {
        command: "claude plugin validate .",
        cache: false,
      },
      // What the release workflow runs to produce a release pull request.
      // Lives here rather than inline in the workflow so `release:dry-run` can
      // exercise the real thing instead of a copy of it.
      "release:version": {
        command: "vpx changeset version && node scripts/bump-plugin-version.mjs",
        cache: false,
      },
      "release:dry-run": {
        command: "node scripts/release-dry-run.mjs",
        cache: false,
      },
    },
  },
});
