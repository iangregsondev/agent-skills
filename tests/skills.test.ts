import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vite-plus/test";

const ROOT = new URL("..", import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, "skills");

/**
 * Every directory containing a SKILL.md, at any depth under skills/.
 * Returns [] when skills/ is absent — skills arrive one pull request at a time,
 * so an empty repo is a valid state, not a failure.
 */
function findSkills(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  const found: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry);
    if (!statSync(path).isDirectory()) continue;
    try {
      statSync(join(path, "SKILL.md"));
      found.push(path);
    } catch {
      found.push(...findSkills(path));
    }
  }
  return found;
}

/** Every .md file under dir, recursively. Returns [] if dir is absent. */
function findMarkdown(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return findMarkdown(path);
    return path.endsWith(".md") ? [path] : [];
  });
}

function frontmatter(skillMd: string): Record<string, string> {
  const match = /^---\n([\s\S]*?)\n---/.exec(skillMd);
  if (!match) return {};
  const fields: Record<string, string> = {};
  // Folded scalars (`key: >`) continue onto indented following lines.
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([a-z-]+):\s*(.*)$/.exec(lines[i]);
    if (!kv) continue;
    let value = kv[2];
    if (value === ">" || value === "|" || value === ">-") {
      const block: string[] = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) block.push(lines[++i].trim());
      value = block.join(" ");
    }
    // A nested mapping — `metadata:` is the spec's home for fields it doesn't define.
    // Flattened one level, so `metadata.assumes` reads like any other field.
    if (value === "") {
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        const child = /^\s+([a-z-]+):\s*(.*)$/.exec(lines[++i]);
        if (child) fields[`${kv[1]}.${child[1]}`] = child[2].trim();
      }
      continue;
    }
    fields[kv[1]] = value.trim();
  }
  return fields;
}

const skills = findSkills(SKILLS_DIR);

/** Paths listed in the plugin manifest, or null when no manifest exists yet. */
function readPromoted(): string[] | null {
  try {
    return JSON.parse(readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf8")).skills ?? [];
  } catch {
    return null;
  }
}
const promoted = readPromoted();

// Tool names a skill must not assume — the consuming project decides these.
// See the "Authoring skills" section of CLAUDE.md.
const FORBIDDEN = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "npx",
  "vitest",
  "jest",
  "pytest",
  "cargo",
  "package.json",
  "typescript",
];

it("a skill cannot exist without a plugin manifest to publish it", () => {
  // The reverse is fine: the manifest may land before the first skill.
  if (skills.length > 0)
    expect(promoted, "skills/ exists but .claude-plugin/plugin.json does not").not.toBeNull();
});

// The catalogue at iangregsondev/claude-plugins is the one marketplace offering this
// plugin. A manifest here would be a second, and both would offer the name
// `iangregson-skills` — of which only one can be installed at a time, with nothing
// telling a user which one they have. Nothing local catches that: the plugin still
// installs, every check here stays green, and the damage lands on users only.
it("publishes no marketplace of its own", () => {
  expect(
    existsSync(join(ROOT, ".claude-plugin/marketplace.json")),
    "found .claude-plugin/marketplace.json — the catalogue at iangregsondev/claude-plugins lists this plugin",
  ).toBe(false);
});

describe.each(skills.map((p) => [relative(ROOT, p), p]))("%s", (rel, path) => {
  const source = readFileSync(join(path, "SKILL.md"), "utf8");
  const fields = frontmatter(source);
  const dirName = path.split("/").pop();

  it("has valid frontmatter", () => {
    expect(source.startsWith("---"), "SKILL.md must open with YAML frontmatter").toBe(true);
    expect(fields.name, "frontmatter needs a name").toBeTruthy();
    expect(fields.description, "frontmatter needs a description").toBeTruthy();
  });

  it("name is kebab-case and matches its directory", () => {
    expect(fields.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(fields.name).toBe(dirName);
  });

  it("has a package.json whose name matches", () => {
    const pkg = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
    expect(pkg.name).toBe(dirName);
  });

  it("is listed in the README skills table", () => {
    // Also silent: the skill ships, but nobody browsing the repo ever learns it exists.
    const readme = readFileSync(join(ROOT, "README.md"), "utf8");
    expect(readme).toContain(`[\`${dirName}\`](${relative(ROOT, path)})`);
  });

  it("is registered in .claude-plugin/plugin.json", () => {
    // Omission fails silently at runtime: the skill never reaches plugin users.
    expect(promoted ?? []).toContain(`./${relative(ROOT, path)}`);
  });

  // Reference files ship with the skill, so they carry the same rule.
  const markdown = [join(path, "SKILL.md"), ...findMarkdown(join(path, "references"))];

  // Tool-agnostic is what we aim for, not something a skill has to be. One genuinely
  // about a single stack lists what it takes for granted in `metadata.assumes` —
  // comma-separated. Those names stop counting as leaks; everything else still does.
  const assumes = (fields["metadata.assumes"] ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const assumed = new Set(assumes.map((entry) => entry.toLowerCase()));

  it("names in its description whatever it assumes", () => {
    // The description is what someone reads before reaching for the skill, and for a
    // model-invoked one it also decides whether the skill fires at all. Either way, one
    // that reads as portable while assuming a stack sends its reader to a skill that
    // cannot help them.
    const unstated = assumes.filter(
      (entry) => !fields.description.toLowerCase().includes(entry.toLowerCase()),
    );
    expect(unstated, `assumed but absent from the description: ${unstated.join(", ")}`).toEqual([]);
  });

  it.each(markdown.map((f) => [relative(path, f), f]))(
    "%s names no language, runner, or package manager it has not declared",
    (_label, file) => {
      const text = readFileSync(file, "utf8");
      const body = text.startsWith("---") ? text.slice(text.indexOf("\n---", 3) + 4) : text;
      const prose = body
        .split("\n")
        .filter((line) => !line.trim().startsWith("```"))
        .join("\n");
      const leaked = FORBIDDEN.filter(
        (tool) =>
          !assumed.has(tool) &&
          new RegExp(`(^|[^\\w/.-])${tool.replace(".", "\\.")}([^\\w-]|$)`, "i").test(prose),
      );
      expect(leaked, `leaked tool names: ${leaked.join(", ")}`).toEqual([]);
    },
  );

  it.each(markdown.map((f) => [relative(path, f), f]))(
    "%s wraps angle-bracket placeholders in backticks",
    (_label, file) => {
      const swallowed = htmlLikeTags(readFileSync(file, "utf8"));
      expect(swallowed, `GitHub will delete these: ${swallowed.join(", ")}`).toEqual([]);
    },
  );
});

/**
 * Anything shaped like an HTML tag, outside code. GitHub renders `<why it matters>`
 * as an unknown element and its sanitizer drops the whole thing — text that reads
 * correctly in the repo silently loses a phrase on the rendered page. Backticks are
 * the fix, so the check is for placeholders left bare rather than for angle brackets.
 */
function htmlLikeTags(source: string): string[] {
  const stripped = source
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^(?: {4}|\t).*$/gm, "")
    .replace(/`[^`\n]*`/g, "");
  const allowed = new Set(["<br>", "<br/>", "<br />"]);
  const found = stripped.match(/<[A-Za-z!/][^>\n]*>/g) ?? [];
  return [...new Set(found.filter((tag) => !allowed.has(tag.toLowerCase())))];
}

/**
 * Changeset bodies become CHANGELOG.md entries and GitHub release notes, and both are
 * written once and never revisited — a placeholder swallowed there is only noticed by
 * someone reading the published page. The file is deleted at release, so a pull request
 * is the only moment this can fire.
 */
describe("changesets", () => {
  const dir = join(ROOT, ".changeset");
  let pending: string[];
  try {
    pending = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md");
  } catch {
    pending = [];
  }

  it.each(pending.length ? pending : [null])(
    "%s wraps angle-bracket placeholders in backticks",
    (file) => {
      if (file === null) return;
      const swallowed = htmlLikeTags(readFileSync(join(dir, file), "utf8"));
      expect(swallowed, `GitHub will delete these: ${swallowed.join(", ")}`).toEqual([]);
    },
  );
});
