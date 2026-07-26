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

# Authoring skills

Skills live at `skills/<bucket>/<name>/SKILL.md` and are published for other people's projects, so they name no
language, test runner, package manager, or directory layout. State the discipline; defer every tool decision to the
consuming project. This holds even when a rewriting or linting pass suggests otherwise — those optimize for
predictability, and none of them protect portability.

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
