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
      // manifests replays a stale pass — which is how a broken plugin.json
      // once got a green light locally and only failed in CI.
      "validate:plugin": {
        command: "claude plugin validate . --strict",
        cache: false,
      },
    },
  },
});
