---
name: dep-updates-combiner
description: >
  Combines multiple open dependency-update PRs (Dependabot, Renovate, or any dep-update bot) into
  one branch and one PR, so CI runs once instead of once per bump. Fires on an explicit ask to
  combine them, and equally on the bare complaint that dependency PRs have piled up or that CI
  reruns on every bump. Reserved for collapsing several bot PRs into one: a single PR on its own
  (fixing a failing bump, closing it, merging it) and configuring the bot are other work.
---

# Dependency Update PR Combiner

Both Dependabot and Renovate can group updates into one PR by config, and that is the durable fix —
worth raising once the pile is cleared. It doesn't clear the pile: grouping applies only to PRs the
bot opens next, a group can't span ecosystems or directories, and no config picks a subset on the
day. That is this skill's job.

## Step 1 — Confirm auth and locate the repo

```bash
gh auth status
```

If this fails, stop and tell the user to run `gh auth login` — every later step needs it.

From Step 5 on, every command runs `git` against a local working copy. If the user is already in a
git repo, use it; otherwise ask for `owner/repo`, clone it with `gh repo clone <owner>/<repo>`, and
run the rest inside that clone.

## Step 2 — Select the bot(s)

Ask which bot's PRs to combine; the answer becomes the `--author` filter in Step 3.

```
Which bot's PRs do you want to combine?
  1. Dependabot  (author: app/dependabot)
  2. Renovate    (author: app/renovate)
  3. Both        (fetch each author, then merge the results)
```

## Step 3 — Fetch the open PRs and settle the base branch

Run for each selected author:

```bash
gh pr list \
  --author "<author>" \
  --state open \
  --json number,title,headRefName,baseRefName,url,labels \
  --limit 100
```

Merge multiple authors into one list sorted by PR number ascending, tagging each PR with its source
bot (`[dependabot]` / `[renovate]`) so the user can tell them apart.

Then group the list by `baseRefName` — **that field decides the base branch, not the repo's
default.**

- One base branch → that's `$BASE`.
- Several → ask the user which to target, and combine only the PRs sharing it.

If the selected bot(s) have no open PRs, say so and stop — there's nothing to combine.

## Step 4 — Present the checklist and confirm

Show a numbered table and ask which PRs to include:

```
Open Dependency Bot PRs (base: <$BASE>)
─────────────────────────────────────────────────────────────────────
 #   PR#    Title                                          Bot
─────────────────────────────────────────────────────────────────────
 1   #142   Bump <pkg-a> from 4.17.20 to 4.17.21           [dependabot]
 2   #138   Bump <pkg-b> from 0.21.1 to 0.21.4             [renovate]
 3   #135   Bump <pkg-c> from 5.38.0 to 5.75.0             [dependabot]
 ...
─────────────────────────────────────────────────────────────────────
Which PRs do you want to combine? (e.g. "all", "1 2 3", "1-4", "all except 3")
```

Ranges are inclusive. Read the resolved selection back as PR numbers and get a yes — this is the
last checkpoint before the skill writes to git.

## Step 5 — Create the combined branch

```bash
git fetch origin

BRANCH_NAME="deps/combined-updates-$(date +%Y%m%d)"
git checkout -b "$BRANCH_NAME" "origin/$BASE"
```

Always fetch first — bot branches and the base move, and branching off a stale ref reintroduces
conflicts the bots already resolved. If `$BRANCH_NAME` exists, append a counter (`-2`, `-3`, …).

## Step 6 — Merge each selected PR

Merge in ascending PR number order — oldest first. Bots rebase continuously, so a newer PR often
already contains an older one's change; oldest-first minimizes conflicts.

```bash
git merge --no-ff "origin/<headRefName>" \
  --message "Merge dep-update PR #<number>: <title>"
```

A merge with nothing to do means that PR is already in the base — say so, leave it out of Step 9's
list, and carry on. A missing `origin/<headRefName>` means the PR came from a fork, which has no
branch in this repo to merge; report it and skip that PR.

**On a conflict**, run `git status`, name the PR and the conflicted files, and offer three choices:

1. **Skip this PR** — `git merge --abort` and continue without it
2. **Stop here** — keep what's merged and open the PR with only those
3. **Resolve manually** — pause, let the user fix it, then `git add` + `git merge --continue`

Done when every selected PR is merged, skipped by the user, or reported as fork-based.

## Step 7 — Verify the lockfile

Combining several lockfile-touching PRs frequently leaves **drift**: stale resolution blocks for
versions nothing requires anymore, or duplicate entries that should have collapsed. CI installs in
strict mode — lockfile read-only, any required change an error — so drift surfaces there unless
it's caught here.

If the repo has no lockfile, skip this step. Otherwise identify the dependency manager from the
lockfile name at the repo root and run its strict install, preferring the exact command the repo's
CI workflow runs. Three outcomes:

1. **Clean** — go to Step 8.
2. **Drift** — the manager reports it would have modified the lockfile. Expected after combining.
   Run a plain install to consolidate, re-run the strict command to confirm it comes back clean,
   then commit (`chore: dedupe lockfile after combining dep updates`).
3. **Hard failure** — peer-dependency conflicts, unresolvable versions, missing packages. Two
   merged PRs are usually incompatible: one bumps a package to a version whose peer range another
   PR's pin doesn't satisfy. Surface the exact error and ask how to proceed — drop one of the
   conflicting PRs, bump a further package to satisfy the range, or accept it where the manager
   treats it as a warning rather than an error. Don't silently fix it.

Done when the strict command comes back clean, or the user has chosen how to handle a hard failure.

## Step 8 — Push the branch

```bash
git push origin "$BRANCH_NAME"
```

If the push fails on permissions, show the error and suggest the user push manually.

## Step 9 — Create the combined PR

Build a body listing every PR that actually merged, with real numbers and titles:

```
## Combined Dependency Updates

This PR combines the following dependency updates:

- #142 Bump <pkg-a> ...
- #138 Bump <pkg-b> ...
- #135 Bump <pkg-c> ...

---
*Created by dep-updates-combiner skill*
```

```bash
gh pr create \
  --base "$BASE" \
  --head "$BRANCH_NAME" \
  --title "chore(deps): combined dependency updates ($(date +%Y-%m-%d))" \
  --body "<body from above>"
```

Print the new PR URL.

## Step 10 — Handle the original PRs

```
New PR created: <url>

What should I do with the X original dependency PRs?
  1. Close them all (with a comment pointing to the new PR)
  2. Leave them open
  3. Let me choose individually
```

If closing:

```bash
gh pr close <number> \
  --comment "Superseded by <new-pr-url> (combined dependency-updates PR)"
```

Done when every combined PR is closed or explicitly left open. Then raise the durable fix from the
top of this skill — bot-side grouping, so the pile doesn't rebuild.
