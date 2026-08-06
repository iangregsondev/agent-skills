<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Toolchain

`vp` and `vpx` replace the whole npm/pnpm/yarn/bun surface, one-off package runners included. Translate before
running anything:

| Instead of                                             | Use                       |
| ------------------------------------------------------ | ------------------------- |
| `npm install`, `pnpm install`, `yarn`, `bun install`   | `vp install`              |
| `npm install <pkg>`, `pnpm add`, `yarn add`, `bun add` | `vp add <pkg>`            |
| `npm run <task>`, `pnpm run`, `yarn <task>`, `bun run` | `vp run <task>`           |
| `npx <pkg>`, `pnpm dlx`, `yarn dlx`, `bunx`            | `vpx <pkg>` (= `vp dlx`)  |
| `npm exec`, `pnpm exec`, `yarn exec`                   | `vpx <bin>` (= `vp exec`) |

`vpx` resolves a local binary first and downloads only if it is missing, so it covers both of the last two rows.

Reaching past them fails in different ways, which is why the rule is "always translate" rather than "watch for errors":
`devEngines.packageManager` pins this repo to pnpm, so npm and npx abort outright with `EBADDEVENGINES`, while yarn and
bun would ignore `pnpm-workspace.yaml` and `pnpm-lock.yaml` and quietly resolve a different dependency tree.

The `npx` in the README install snippets is what consumers type in their own projects — leave it alone.

Everything above the `VITE PLUS END` marker is generated. Edits there are overwritten; put repo-specific rules here.

# Authoring skills

Skills live at `skills/<bucket>/<name>/SKILL.md` and are published for other people's projects, so the default is to
name no language, test runner, package manager, or directory layout. State the discipline; defer every tool decision
to the consuming project. This holds even when a rewriting or linting pass suggests otherwise — those optimize for
predictability, and none of them protect portability.

A skill genuinely about one stack is fine. It lists what it takes for granted under `metadata.assumes` in its
frontmatter — comma-separated, and `metadata` because that is where the Agent Skills spec puts fields it does not
define. Listed names stop counting as leaks in `tests/skills.test.ts`; unlisted ones still fail, and the `description`
has to name each one, since the description is what sends anyone to the skill — the agent when it is model-invoked, a
person reading the slash-command list when it is not. Prefer the version that assumes nothing where one exists — the
list is for skills that would be worse written portably, not a shortcut when portable is harder to write.

A skill is model-invoked by default. `disable-model-invocation: true` makes it user-invoked: it leaves the list the
harness injects, so neither the agent nor another skill can start it, and its `description` becomes a one-line summary
for the person reading the slash-command list rather than a trigger list for the agent. Use it when a misfire costs
more than the catch is worth — a skill that changes how the rest of the session runs, or spends it on a repo-wide
sweep.

The flag is a Claude Code field, so it does nothing under another harness. Say it in the body too, where every harness
reads it: a user-invoked skill opens with **"The user starts it, never you."**, the reason a misfire is expensive, and
an instruction to stand down if the agent arrived on its own judgment. See ["Adding a
skill"](CONTRIBUTING.md#adding-a-skill) for why the repo carries no per-harness equivalent.

A skill ships only if its path appears in the `skills` array of `.claude-plugin/plugin.json`. Leaving it out fails
silently: the skill stays in the repo and simply never reaches plugin users. It must also get a row in the README
skills table, or nobody browsing the repo finds it. Both are covered by `tests/skills.test.ts`, so run the tests.

`.claude-plugin/marketplace.json` describes the same plugin a second time and may restate any field `plugin.json`
already carries. Leave those fields out of it and let `plugin.json` be the single source — the tests only check the
copies that exist, so the copy you never made is the one that can never drift. See ["Adding a
skill"](CONTRIBUTING.md#adding-a-skill) for why a stale `skills` array there stops shipping skills outright.

# Versioning

Skills version independently, through changesets, and nothing about a version is ever hand-edited.

- A **new skill starts at `0.0.0`**, and its first changeset is `major` — that yields `1.0.0`, a release version rather
  than `0.1.0`. Writing `1.0.0` into the new manifest by hand skips a version and is wrong even though nothing fails.
- Every skill change needs a changeset, keyed by the skill's directory name. Without one the change ships no bump.
- Never touch the `version` in `.claude-plugin/plugin.json`, a skill's `CHANGELOG.md`, or a released skill version. The
  release workflow writes all three.

[CONTRIBUTING.md](CONTRIBUTING.md) is the full account of this repo's rules — the manifest-as-cache-key reasoning, the
unscoped package names, the release and dry-run tasks. Read it before changing anything about how skills are packaged
or released; this file only carries the parts that are easiest to walk past.
