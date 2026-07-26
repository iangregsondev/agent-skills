# agent-skills

[![skills.sh](https://skills.sh/b/iangregsondev/agent-skills)](https://skills.sh/iangregsondev/agent-skills)
[![CI](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/iangregsondev/agent-skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

> Reusable agent skills for AI coding agents.

Each skill is a self-contained `SKILL.md` folder that teaches an agent to handle
one task well — the discipline, not the toolchain. Skills name no language, test
runner, package manager, or directory layout, so they work in whatever project you
install them into, under Claude Code or any other Agent-Skills-standard harness.

## Status

**No skills published yet.** This repository currently holds the structure,
tooling and checks that skills will land into; each skill arrives in its own pull
request. Until the first one does, there is nothing to install.

## Structure

```
skills/
  <bucket>/
    <skill-name>/
      SKILL.md        # frontmatter (name, description) + the process
      package.json    # workspace member; keywords carry the category
```

Buckets group skills by domain (`engineering/`, `productivity/`, …). Nesting is
free-form — the workspace glob is `skills/**`, and the plugin manifest will list
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
