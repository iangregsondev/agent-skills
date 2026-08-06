# Ian Gregson's agent skills

[![skills.sh](https://skills.sh/b/iangregsondev/agent-skills)](https://skills.sh/iangregsondev/agent-skills)
[![CI](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

> Skills for AI coding agents — one task each, kept portable across projects,
> languages and harnesses wherever the task allows.

Each skill is a self-contained `SKILL.md` folder that teaches an agent to handle
one task well — the discipline, not the toolchain. The default is to name no
language, test runner, package manager or directory layout, so a skill works in
whatever project you install it into, under Claude Code or any other
Agent-Skills-standard harness. Where a skill genuinely can't be written that way,
its description says what it's tied to rather than hiding it.

## Skills

| Skill                                                                   | Bucket      | What it does                                                                            |
| ----------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| [`agent-config-audit`](skills/engineering/agent-config-audit)           | engineering | Sweeps a repo's agent config for pointers, commands and facts that stopped being true.  |
| [`changeset`](skills/engineering/changeset)                             | engineering | Writes a changeset file directly, since the interactive prompts an agent can't answer.  |
| [`dep-updates-combiner`](skills/engineering/dep-updates-combiner)       | engineering | Collapses many open dependency-update PRs into one branch and PR, so CI runs once.      |
| [`tdd`](skills/engineering/tdd)                                         | engineering | Test-driven development gated on user approval of the failing test.                     |
| [`explain-clearly`](skills/learning/explain-clearly)                    | learning    | Explains in full the first time — terms defined, steps literal, nothing hand-waved.     |
| [`mentor`](skills/learning/mentor)                                      | learning    | The agent writes no code and coaches instead, so you type every line yourself.          |
| [`walkthrough`](skills/learning/walkthrough)                            | learning    | One change at a time, shown and explained, gated on your understanding before the next. |
| [`us-english-spelling-sweep`](skills/writing/us-english-spelling-sweep) | writing     | Converts a repo to US English, reporting every finding before it changes anything.      |

## Third-party skills

**[EXTERNAL-SKILLS.md](EXTERNAL-SKILLS.md) — a curated list of third-party skills
worth running alongside these.** It records how each one installs, and points at
the source for everything else.

Nothing on that list is written, maintained, reviewed or endorsed by this repo,
and none of it is vendored here. Support and security reports go to the author,
on their own repo. The portability default above applies to the skills in this
repo only — external ones are frequently built around one language or framework.

## Installation

Two routes, reading the same files.

**As loose skills**, via [skills.sh](https://skills.sh) — copies editable skill
files into your project, unnamespaced:

```bash
npx skills add iangregsondev/agent-skills             # all of them
npx skills add iangregsondev/agent-skills --skill tdd # just one
```

**As a Claude Code plugin** — read-only, always current, and namespaced so it
can't collide with a skill of the same name elsewhere:

```
/plugin marketplace add iangregsondev/agent-skills
/plugin install iangregson-skills
```

## Invoking a skill

Skills fire two ways: automatically, when what you ask matches the skill's
`description`; or by name, typed as a slash command. Installed as a plugin the
name is namespaced — `/iangregson-skills:tdd` rather than `/tdd`.

Invocation is a model judgment, not a keyword match. To make a skill fire
reliably in a given repo, use its vocabulary in that repo's `CLAUDE.md`.

Five fire by name only: `mentor`, `walkthrough`, `explain-clearly`,
`us-english-spelling-sweep` and `agent-config-audit`. Each one changes how the
whole session runs, or spends it on a repo-wide sweep, so the decision to start
one is yours. They carry `disable-model-invocation: true`, which keeps them out
of the list the agent chooses from — a Claude Code field, so under another
harness they can still fire on their own. Each one therefore says the same thing
in its body, where every harness reads it, and stands down if it was not you who
started it.

## Structure

```
skills/
  <bucket>/
    <skill-name>/
      SKILL.md        # frontmatter (name, description) + the process
      package.json    # workspace member; keywords carry the category
```

Buckets group skills by domain (`engineering/`, `productivity/`, …). Nesting is
free-form — the workspace glob is `skills/**`, and the plugin manifest lists
skill paths explicitly, so neither depends on a fixed depth.

`tests/skills.test.ts` validates every skill that exists: frontmatter, that the
name matches its directory, that it is registered for publication, and that no
language, runner or package manager has leaked into its prose beyond what the
skill lists under `metadata.assumes` — a list every skill here is currently empty
of.

## Development

This repo uses [Vite+](https://viteplus.dev) — a single `vp` CLI wrapping runtime,
package management and tooling. Use `vp`, not npm/pnpm/yarn.

```bash
vp install     # after cloning, and after pulling changes
vp check       # format, lint, type check
vp test        # validate skills
vp run ready   # both of the above
```

Versioning is handled by [changesets](https://github.com/changesets/changesets).
Adding or changing a skill needs a changeset:

```bash
vpx changeset
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: skills aim to stay
tool-agnostic, every skill needs registering for publication, and changes need a
changeset.

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## License

MIT — see [LICENSE.md](LICENSE.md).
