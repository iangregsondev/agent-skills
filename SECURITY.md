# Security Policy

## Reporting a vulnerability

Please do **not** report security vulnerabilities through public GitHub issues,
discussions, or pull requests — a public report is itself a disclosure.

Instead, use
[GitHub's private vulnerability reporting](https://github.com/iangregsondev/agent-skills/security/advisories/new)
to open a draft advisory. It's private, and it lets us work on the fix and the
advisory in the same place.

Please include:

- what the problem is and why it's a security issue rather than a bug;
- the skill or file affected, and the version or commit you're looking at;
- steps to reproduce, or a proof of concept;
- what an attacker could achieve with it.

## What counts as a vulnerability here

This repo ships **Markdown skill files**, not runtime code — nothing here executes
on your machine by installing it. That makes the realistic threats narrower than
for a typical package, and worth naming:

- **A skill that instructs an agent to do something harmful** — exfiltrating
  secrets, running destructive commands, disabling safety checks, or reaching out
  to an unexpected network endpoint.
- **Prompt injection carried in a skill** — content designed to override the
  operator's instructions rather than describe a process.
- **A supply-chain problem in the tooling** — the build, release workflow, or a
  dependency.

Reports about the _quality_ of a skill — it fires when it shouldn't, or gives poor
advice — aren't security issues. Open a normal
[issue](https://github.com/iangregsondev/agent-skills/issues) for those.

## Supported versions

This project has no tagged releases yet and sits at version `0.0.0`. Until a first
release, only the current `main` branch is supported — fixes land there and
nowhere else.

Once releases begin, this section will list the versions receiving fixes.

## What to expect

This repo is maintained by one person in their own time, so there's no guaranteed
response time and no bug bounty. Reports are read and handled on a best-effort
basis.

If a report is valid, the fix lands on `main` and a GitHub advisory is published.
Credit is given to the reporter unless you'd rather stay anonymous — say which you
prefer in the report.
