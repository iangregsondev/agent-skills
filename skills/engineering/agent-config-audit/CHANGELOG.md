# agent-config-audit

## 1.0.0

### Major Changes

- [#20](https://github.com/iangregsondev/agent-skills/pull/20) [`3b32544`](https://github.com/iangregsondev/agent-skills/commit/3b325445cdb4b51ffcea47fc12b70db0c7c8bbae) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add the `agent-config-audit` skill: a report-only sweep of a repository's agent configuration — instruction files,
  rules, skills, hooks, settings and the docs they point at — that extracts every claim the config makes about the
  repository and tests it, catching pointers to things that moved, commands that no longer run, facts that stopped being
  true, and wiring that was never registered.
