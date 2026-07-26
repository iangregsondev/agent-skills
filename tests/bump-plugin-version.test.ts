import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";
// @ts-expect-error -- plain .mjs script, no type declarations
import { bumpPatch } from "../scripts/bump-plugin-version.mjs";

const ROOT = new URL("..", import.meta.url).pathname;

describe("bumpPatch", () => {
  it("increments the patch", () => {
    expect(bumpPatch("1.0.0")).toBe("1.0.1");
    expect(bumpPatch("2.3.9")).toBe("2.3.10");
  });

  it("leaves major and minor alone", () => {
    expect(bumpPatch("4.7.0")).toBe("4.7.1");
  });

  it.each(["1.0", "1.0.0.0", "1.0.x", "v1.0.0", "", "1..0"])("rejects %o", (version) => {
    expect(() => bumpPatch(version)).toThrow(/MAJOR\.MINOR\.PATCH/);
  });
});

describe("plugin manifest", () => {
  it("carries a version the release bump can parse", () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf8"));
    expect(
      manifest.version,
      "plugin.json needs a version — Claude Code uses it to detect updates",
    ).toBeDefined();
    expect(() => bumpPatch(manifest.version)).not.toThrow();
  });
});
