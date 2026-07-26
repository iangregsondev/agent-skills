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

**Use `vp` — not npm, pnpm, yarn or bun.** `npm` and `npx` will refuse to run here
anyway: `devEngines.packageManager` pins the project to pnpm and npm errors with
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
package-manager behaviour looks wrong, `vp env doctor` reports on it — include
its output when asking for help.

## Adding a skill

Skills live at `skills/<bucket>/<name>/SKILL.md`, with a `package.json` beside
them making the directory a workspace member. Buckets group by domain
(`engineering/`, `productivity/`, …); nesting depth is free-form.

Three rules specific to this repo:

1. **Keep skills tool-agnostic.** A skill names no language, test runner, package
   manager or directory layout — it defers every tool decision to the project it
   gets installed into. State the discipline, not the toolchain. See the
   "Authoring skills" section of [CLAUDE.md](CLAUDE.md).
2. **Register it to ship it.** A skill is published as part of the plugin only if
   its path appears in the `skills` array of `.claude-plugin/plugin.json`. A skill
   absent from that array stays in the repo but never reaches plugin users — which
   is how work-in-progress skills are kept back deliberately.

   **Do not add a `version` field to that manifest.** Claude Code uses the plugin
   `version` as the cache key for update detection: set it, and users receive
   changes only when you bump the string — new commits alone do nothing, and
   `/plugin update` tells them they are already up to date. Omitted, it falls back
   to the git commit SHA, so every merge to `main` is an update. Since skills here
   version independently, there is no single repo-level number for a plugin
   `version` to track, and an invented one would only rot. Leave it out.

3. **Add a changeset.** Versioning runs on
   [changesets](https://github.com/changesets/changesets):

   ```bash
   vpx changeset
   ```

   Without one, your change ships no version bump.

   Skills version independently, and a **new skill's first changeset is
   `major`** — from `0.0.0` that yields `1.0.0`, so a skill starts at a release
   version rather than `0.1.0`. After that, `minor` adds behaviour and `major`
   is for a change that breaks anyone relying on the old process.

### Optional: a final editing pass

[`writing-great-skills`](https://github.com/mattpocock/skills) is a good last
read over a new or edited skill — it sharpens the description into distinct
triggers, collapses duplicated and no-op lines, and pushes each step towards a
checkable finish condition. Install it however you prefer; it's user-invoked, so
you type its name rather than waiting for it to fire.

It optimises for predictability, not portability, so re-read your skill for
leaked tool names afterwards — rule 1 above is the one it won't defend.

## Pull requests

Branch off `main` and target `main`. Branch names follow
`<type>/<ticket>-<short-description>`, e.g. `feat/12-add-review-skill` or
`chore/no-ticket-bump-deps`.

The PR template will appear when you open the PR — fill it in rather than leaving
the body empty. CI runs `vp check` and the plugin validation on every PR; both
must pass.

Keep a PR to one skill or one coherent change. A PR adding three unrelated skills
is three PRs.

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
