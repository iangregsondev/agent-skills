---
"agent-config-audit": major
---

Add the `agent-config-audit` skill: a report-only sweep of a repository's agent configuration — instruction files,
rules, skills, hooks, settings and the docs they point at — that extracts every claim the config makes about the
repository and tests it, catching pointers to things that moved, commands that no longer run, facts that stopped being
true, and wiring that was never registered.
