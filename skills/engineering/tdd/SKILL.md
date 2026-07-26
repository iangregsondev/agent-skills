---
name: tdd
description: >
  Test-driven development gated on user approval of the failing test. Use when implementing new behavior, fixing a bug,
  or when the user asks for TDD by any name. Not for docs, config, or refactors already covered by tests.
---

# TDD Loop

**The test is the specification.** Once a test fails for the right reason, it must not be weakened to accommodate the
implementation.

Agree the feedback loop size with the user first — one test per cycle, or a batch prepared ahead. It depends on the
task. If unsure, prefer fewer tests per cycle.

## 1. Choose the test type

What the behavior needs decides this, not preference:

- **Unit** — pure. No network, no containers, no infrastructure. Use in-memory fakes and stubs. Must pass anywhere with
  zero setup.
- **Integration** — needs live infrastructure (a container, a database, a real service).
- **End-to-end** — full flows through the public entry point.

**Then find how this project separates them** — a filename suffix, a directory, a test tag, a runner config — by
reading the tests that already exist. Projects vary: some split all three, some run unit and integration in one lane and
only isolate end-to-end, some make no distinction at all. Adopt whatever is there.

The one rule that holds regardless: **every test belongs in a lane that provides the infrastructure it needs.** A test
requiring a database belongs in a lane that starts one. That is what keeps CI honest — not how the file is labelled.

If the behavior could reasonably be tested at more than one level, that is a design decision, not a lookup. Raise it at
the gate in step 5.

Settled when you can name the exact file or lane this test will live in, and point at the existing test that told you.

## 2. Design the test

- Pin down the exact behavior and the precise assertions before writing anything.
- **Fixing a bug? The test must reproduce it.** It has to fail _because the defect is present_, not because a feature is
  missing — otherwise it isn't pinned to the bug and will pass again for the wrong reason. It stays afterwards as the
  regression test.
- **Assert the value, not its existence.** "It is not null", "it is not empty", "it did not throw", "the function was
  called" — these pass against implementations you already know are wrong. Assert what it equals, what it contains, how
  many there are, what changed.
- **Sanity check every assertion:** picture a plausible but incorrect implementation. If the assertion still passes
  against it, it isn't pinning the behavior down — tighten it before moving on.
- Prefer hand-written stubs and fakes over mocking frameworks — a small stub that returns the expected data.
- Design it so it can be written once and never modified.

Settled when every assertion has survived that sanity check.

## 3. Write the test

Write the design and nothing else — one behavior, and only the assertions step 2 called for. Fresh ideas arriving now
are the next cycle's test, not this one's.

## 4. Observe RED

Run the narrowest command that exercises just this test, taking that command from the project itself — its agent
instructions, task or build configuration, contributing guide, or CI workflow. CI is the most reliable source: those
commands are proven to run. **Never assume a test runner, package manager, or directory layout** — the project has
already chosen all three; read that choice.

Confirm it fails **for the expected reason** — a failed assertion on the behavior under test. A compile or syntax
error, a bad import, or a setup crash is _not_ red; fix the harness first, then re-run.

**If it passes on the first run, stop — that is not a green light.** Either the behavior already exists, so this test
drives nothing and the work may already be done, or the assertion is vacuous and would pass against any implementation.
Work out which, and tell the user. Never carry a passing test into the gate.

## 5. GATE — stop for user review

Present the failing test to the user, along with the test type chosen and why. They review it, and ideally commit it,
**before implementation begins**. Approval is what opens the gate; wait for it.

Implementing past an unapproved test means building against a specification nobody agreed to.

## 6. Implement

The minimum code that makes the test pass. Follow the project's existing conventions and architectural rules.

## 7. Observe GREEN

Re-run the exact command from step 4. Confirm the new test passes **and** the surrounding suite still does.

## 8. Review

Re-read the diff as a reviewer would, then run the same verification this project runs before merge, scoped to what
changed. Find it where you found the test command in step 4 — CI is the definitive list.

Which checks exist is the project's decision, and it varies by language and by choice: a compiler, a type checker, a
linter, a formatter, static analysis, none of them. Run exactly the set it defines — including the ones that look
unrelated to your change, since those are the ones that catch what you didn't predict.

## 9. Consider refactor

Improve names and structure while the tests stay green. Re-run them afterwards.

**Do not touch the tests here.** Refactoring changes structure, not behavior, and the tests are the only thing proving
that. Editing both at once means nothing is holding behavior fixed. If a refactor appears to require a test change, it
is a behavior change — stop, and start a new cycle at step 1.

## 10. Next item

Return to step 1 for the next behavior.

## If the implementation cannot pass the test as written

Do **not** weaken it. No relaxing an exact-value assertion into a range or a truthiness check, no deleting the awkward
case, no "the fake can't do X, so we assert Y instead" substitutions.

Instead, gather all such cases and present them to the user: what the test expects, what currently exists, why the gap
is there, and the options for closing it (fix the fake, change the API design, split the behavior). Wait for their
decision.
