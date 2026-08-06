# Contributing

Thanks for considering a contribution. This repo collects agent skills — each one
a `SKILL.md` describing a repeatable process for a coding agent.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before taking part.

## Ways to contribute

- **Add a skill** — a process you repeat often enough to be worth encoding.
- **Improve an existing skill** — sharpen a step, cut a redundant rule, fix a
  wrong instruction.
- **Report a problem** — a skill that fires when it shouldn't, or fails to fire
  when it should.

## Reporting issues

Search [existing issues](https://github.com/iangregsondev/agent-skills/issues)
first. If nothing matches, open a new one and pick the template that fits — it
asks for what's needed to act on the report.

For a skill that misbehaves, include the skill name, what you asked, what it did,
and what you expected. Skill invocation is a model judgment rather than a keyword
match, so the exact wording you used matters.

**Do not open a public issue for a security vulnerability.** Follow
[SECURITY.md](SECURITY.md) instead — a public issue is itself a disclosure.

## Development setup

This repo uses [Vite+](https://viteplus.dev), a single `vp` CLI wrapping the
runtime, package manager and tooling.

**Use `vp` — not npm, pnpm, yarn or bun — and `vpx` in place of `npx`, `pnpm dlx`,
`yarn dlx` or `bunx`.** `npm` and `npx` will refuse to run here anyway:
`devEngines.packageManager` pins the project to pnpm and npm errors with
`EBADDEVENGINES`.

Requires Node.js >= 22.18.0.

```bash
git clone https://github.com/iangregsondev/agent-skills.git
cd agent-skills
vp install
```

Run `vp install` again after pulling changes.

## Checks

```bash
vp run ready   # format, lint, type check, validate every skill and the plugin manifests
```

Run it before opening a pull request; CI runs the same steps. If setup or
package-manager behavior looks wrong, `vp env doctor` reports on it — include
its output when asking for help.

## Adding a skill

Skills live at `skills/<bucket>/<name>/SKILL.md`, with a `package.json` beside
them making the directory a workspace member. Buckets group by domain
(`engineering/`, `productivity/`, …); nesting depth is free-form.

### The `package.json` beside a skill

It exists to make the directory a workspace member so changesets can version it.
Its `name` is the skill's directory name, unscoped, and every skill is
`"private": true`.

Nothing here is published to a registry. Skills reach people through this repo —
via skills.sh or the Claude Code plugin — and neither reads `package.json`:
installing resolves the _directory_, and the slash command comes from the `name`
in `SKILL.md` frontmatter. The package name therefore drives only three things:
changeset keys, `CHANGELOG.md` headers, and git tag names (`tdd@1.0.0`).

That is why the names carry no `@scope` — an unscoped name can only collide
inside a registry these never enter. `tests/skills.test.ts` asserts the name
matches the directory.

Four rules specific to this repo:

1. **Try to keep skills tool-agnostic.** Aim for a skill that names no language,
   test runner, package manager or directory layout, deferring every tool
   decision to the project it gets installed into. State the discipline, not the
   toolchain. See the "Authoring skills" section of [CLAUDE.md](CLAUDE.md).

   Some skills are genuinely about one stack, and those are welcome. Say what the
   skill takes for granted and the check makes room for it:

   ```yaml
   ---
   name: my-skill
   description: … for TypeScript projects using Vitest. …
   metadata:
     assumes: TypeScript, Vitest
   ---
   ```

   `metadata.assumes` is a comma-separated list, and `metadata` is where the
   [Agent Skills spec](https://agentskills.io/specification) puts fields it doesn't
   define itself, so nothing outside this repo trips over it.

   Two things follow from listing something there. It stops counting as a leaked
   tool name in `tests/skills.test.ts` — but only the names you list; anything else
   still fails. And the `description` has to name it too, because the description is
   what sends anyone to the skill: for a model-invoked one it decides whether the
   skill fires at all, and for a user-invoked one it is the line a person reads
   before typing the name. Either way, one that reads as portable while assuming a
   stack reaches projects it can't help.

   Reach for the version that assumes nothing where one exists. The list is for
   skills that would be worse written portably, not a way around the check.

2. **Choose how it gets invoked.** By default a skill is **model-invoked**: the
   harness injects its `description` into the agent's context and the agent decides
   when to reach for it. Adding `disable-model-invocation: true` makes it
   **user-invoked** — it leaves that list entirely, so neither the agent nor another
   skill can start it, and only a person typing its name can.

   Model-invocation is the default because the agent noticing the work is usually
   the whole value: a missing changeset caught without anyone remembering to ask.
   Turn it off when a misfire costs more than the catch is worth. A skill that
   changes how the rest of the session runs, or that spends the session on a
   repo-wide sweep nobody asked for, is one only the user should start.

   The choice decides who the `description` is written for:

   - **Model-invoked** — one trigger per branch, no synonym padding, because that
     text is what routes the agent to the skill.
   - **User-invoked** — a one-line summary of what the skill does, trigger list
     stripped. It routes nothing; it is the line a person reads in the
     slash-command list.

   A user-invoked skill is invisible to the agent even when it is asked what is
   installed, so it may report the skill as missing and route around something that
   is present and working. `.claude-plugin/plugin.json` is the authority on what
   ships, not the agent's own account of itself.

   **Say it in the body as well as the frontmatter.** `disable-model-invocation` is a
   Claude Code field. Through the plugin it does exactly what it says; copied loose
   into a project driven by another harness, the field is unrecognised and the skill
   can still fire on its own. This repo carries no equivalent for those harnesses on
   purpose — each expresses invocation control in its own frontmatter or policy file,
   and a field this repo cannot exercise is a claim it cannot keep, going stale
   silently where the gap at least stays visible.

   What every harness does read is the skill body. So a user-invoked skill opens with
   a line saying who starts it, and telling an agent that arrived on its own judgment
   to stand down:

   ```markdown
   **The user starts it, never you.** <why a misfire costs more than the catch.>
   If you reached this file on your own judgment, say so and stand down.
   ```

   That converts a misfire from "the session silently changes shape" into "the skill
   loads, says so, and stops" — not zero cost, but recoverable, and it holds
   everywhere the file travels.

3. **Register it to ship it.** A skill is published as part of the plugin only if
   its path appears in the `skills` array of `.claude-plugin/plugin.json`. A skill
   absent from that array stays in the repo but never reaches plugin users — which
   is how work-in-progress skills are kept back deliberately.

   Give it a row in the README skills table too, or nobody browsing the repo learns
   it exists. Both are checked by `tests/skills.test.ts`, because both fail silently:
   the repo stays green either way.

   `.claude-plugin/marketplace.json` is a third file describing the same plugin, and
   its entry may restate any field from `plugin.json` — `keywords`, `description`,
   even `skills`. Nothing reconciles the copies at install time. **Prefer omitting a
   field there and letting `plugin.json` be the single source**; a duplicated `skills`
   array is the dangerous one, since this marketplace's root `source: "./"` makes the
   entry's list the complete set, so anything it forgets stops shipping. Whatever the
   entry does duplicate, the tests assert it matches.

   **Never hand-edit that manifest's `version`.** Claude Code uses it as the cache
   key for update detection: if it does not change, `/plugin update` tells users
   they are already up to date and they never receive the new skill. Because
   skills version independently, there is no repo-level number for it to mirror —
   it is a serial number for the bundle, and only has to differ from the last
   release. So the release workflow bumps its patch automatically, right after
   `changeset version`, and the bump lands in the same release pull request. There
   is nothing to remember and no changeset to write for it.

4. **Add a changeset.** Versioning runs on
   [changesets](https://github.com/changesets/changesets):

   ```bash
   vpx changeset
   ```

   Without one, your change ships no version bump.

   Skills version independently, and a **new skill's first changeset is
   `major`** — from `0.0.0` that yields `1.0.0`, so a skill starts at a release
   version rather than `0.1.0`. After that, `minor` adds behavior and `major`
   is for a change that breaks anyone relying on the old process.

### Optional: a final editing pass

[`writing-great-skills`](https://github.com/mattpocock/skills) is a good last
read over a new or edited skill — it sharpens the description into distinct
triggers, collapses duplicated and no-op lines, and pushes each step toward a
checkable finish condition. It is listed in
[EXTERNAL-SKILLS.md](EXTERNAL-SKILLS.md) with its install route and scope; it's
user-invoked, so you type its name rather than waiting for it to fire.

It optimizes for predictability, not portability, so re-read your skill for
leaked tool names afterwards — rule 1 above is the one it won't defend.

## Releases

Merging to `main` starts the release: the workflow runs `vp run release:version`
— `changeset version` to bump the skills whose changesets are pending, then the
plugin patch bump — and opens a "chore: version skills" pull request. Merging
that one applies the versions and tags them.

You can run the whole thing locally first:

```bash
vp run release:dry-run
```

It runs the same `release:version` task the workflow does, prints the full diff
of what the release would produce — including generated files like `CHANGELOG.md`
— then reverts. It refuses to start unless your working tree is clean, so it can
never revert away your own work, and because it undoes itself there is nothing to
accidentally commit.

To inspect the generated files directly rather than reading a diff, keep them:

```bash
vp run release:dry-run --keep
```

Nothing then cleans up after you. Undo it with the command it prints:

```bash
git reset --hard && git clean -fd -- skills .changeset
```

Reach for those two if a simulation is interrupted before it reverts, or if you
ran `release:version` directly — it is the real release step and does not revert.
Both commands discard uncommitted work, so check `git status` first.

Nothing about a release is hand-edited. Skill versions come from changesets and
the plugin version is bumped by script, so a release needs no commit of yours
beyond the changeset you already wrote.

## Pull requests

Branch off `main` and target `main`. Branch names follow
`<type>/<ticket>-<short-description>`, e.g. `feat/12-add-review-skill` or
`chore/no-ticket-bump-deps`.

The PR template will appear when you open the PR — fill it in rather than leaving
the body empty. CI runs `vp check` and the plugin validation on every PR; both
must pass.

Keep a PR to one skill or one coherent change. A PR adding three unrelated skills
is three PRs.

### Keeping a branch current

A PR must be up to date with `main` before it can merge, so that CI has run against
the code that will actually land — a branch and `main` can each be green and still
break together, and only testing the combination catches it.

**Rebase onto `main` rather than merging it in**, so the branch stays a clean line of
your own commits:

```bash
git fetch origin && git rebase origin/main
git push --force-with-lease
```

GitHub's "Update branch" button writes a merge commit by default; its "Update with
rebase" option does the same as the above. Use `--force-with-lease` rather than
`--force` — it refuses if someone else has pushed to your branch in the meantime.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`. Use the imperative mood, lower case, no trailing period — the scope is
usually the skill you touched, as in `feat(<skill-name>): add a review gate`.

This is convention rather than tooling — nothing lints it — so it relies on you.

## License

Contributions are accepted under the [MIT License](LICENSE.md).
