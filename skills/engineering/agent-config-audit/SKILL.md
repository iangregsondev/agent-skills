---
name: agent-config-audit
description: >
  Audit a repository's agent configuration for rot — pointers to things that moved, commands that no longer run, facts
  that stopped being true, wiring nothing ever registered. Reads the instruction layer alone — the files an agent
  consults before it acts — and reports its findings before changing anything.
disable-model-invocation: true
---

# Audit the agent configuration

Config rot is silent. The config layer is the one part of a repository that ships unexecuted: a moved path still
compiles, an outdated claim still passes every test, and both go on quietly misleading every session that reads them.
This is the check that catches them.

**Report only.** Propose fixes and wait for approval before applying any.

## 1. Find the config layer

Read what this repository actually has. The config layer is everything that instructs an agent rather than shipping to
production: instruction files at the root and nested in subdirectories, whatever config directory the harness reads,
and the docs and scripts those files point at. Follow references outward one level — a config file that cites a doc
pulls that doc into scope.

**Settled when** you can name every file in scope, and account for each adjacent file you left outside it.

## 2. Extract the claims

Config is a pile of claims about a repository that has since moved on. Each one is checkable. Sort them:

- **Pointers** — paths, links, globs, file and directory names.
- **Commands** — anything a reader or a hook is told to run.
- **Facts** — versions, dependencies, counts, "we always do X here".
- **Wiring** — a definition that only takes effect if something else registers or triggers it.

**Settled when** every assertion in every scope file sits under one of the four.

## 3. Test every claim against the repository

- **Pointers** must resolve. A glob must match at least one tracked file — one that matches nothing is a rule that
  never fires, and nobody ever finds out.
- **Commands** must exist as this project defines them: a task it declares, a script on disk, a tool it installs. Take
  the spelling from wherever the project defines it. Follow a script's own references one level down.
- **Facts** must be checked against the source that owns them — the manifest, the lock, the workflow. Prose repeating
  a claim is a second claim, and evidence for neither.
- **Wiring** must be complete: the definition exists, parses, and is registered wherever this harness requires
  registration. Read each trigger description against the body it belongs to. A description that has drifted from its
  body is worse than a missing one: it fires confidently, on the wrong work.

**Settled when** every claim carries a verdict: verified against something you opened, or recorded as unchecked with
the reason. Rot survives on the claims that leave with neither.

## 4. Read for what matching cannot catch

- **Compression drift** — where a short rule restates a longer doc, read both sides. Flag contradictions, and flag
  whatever one side has that the other lost. The short form wins an agent's attention, so a constraint it dropped is a
  constraint deleted.
- **Stale truths** — the gotchas, the impact tables, the "always" and "never" claims. Prose that was true a year ago is
  the most confident kind of wrong.
- **Bloat** — a file loaded on every turn is a tax on every turn. Name the sections that grew. Anything relevant only
  when particular files are touched belongs in a scoped rule that fires only when they are.
- **Formatter damage** — structures a formatter has flattened: fences or tables collapsed into run-on prose, list
  markers absorbed into paragraphs, indentation that changed what a nested block belongs to.

**Settled when** all four have been read for across the whole scope, including the files whose every claim passed.

## Report

Group by severity — **broken** (points at nothing, or would fail if run), **stale** (outdated against this repository),
**drift** (two sources disagree and neither is marked as the winner). Give each finding a `file:line`, what is wrong,
and the specific fix.

Close with your blind spots: what you left out of scope, and every claim step 3 recorded as unchecked, each with its
reason. Declaring them is what keeps the reader's suspicion alive exactly where your coverage stopped — the rest of the
report earns its clean bill of health by being bounded.

Then stop for approval.
