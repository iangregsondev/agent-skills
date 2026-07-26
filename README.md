# agent-skills

[![skills.sh](https://skills.sh/b/iangregsondev/agent-skills)](https://skills.sh/iangregsondev/agent-skills)
[![CI](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

> Reusable agent skills for AI coding agents.

Each skill is a self-contained `SKILL.md` folder that teaches an agent to handle
one task well — the discipline, not the toolchain. Skills name no language, test
runner, package manager, or directory layout, so they work in whatever project you
install them into, under Claude Code or any other Agent-Skills-standard harness.

## Skills

| Skill                                                                   | Bucket      | What it does                                                                           |
| ----------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| [`agent-config-audit`](skills/engineering/agent-config-audit)           | engineering | Sweeps a repo's agent config for pointers, commands and facts that stopped being true. |
| [`changeset`](skills/engineering/changeset)                             | engineering | Writes a changeset file directly, since the interactive prompts an agent can't answer. |
| [`dep-updates-combiner`](skills/engineering/dep-updates-combiner)       | engineering | Collapses many open dependency-update PRs into one branch and PR, so CI runs once.     |
| [`tdd`](skills/engineering/tdd)                                         | engineering | Test-driven development gated on user approval of the failing test.                    |
| [`mentor`](skills/learning/mentor)                                      | learning    | The agent writes no code and coaches instead, so you type every line yourself.         |
| [`us-english-spelling-sweep`](skills/writing/us-english-spelling-sweep) | writing     | Converts a repo to US English, reporting every finding before it changes anything.     |

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
language, runner or package manager leaks into its prose.

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

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: skills stay tool-agnostic, every
skill needs registering for publication, and changes need a changeset.

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## License

MIT — see [LICENSE.md](LICENSE.md).
