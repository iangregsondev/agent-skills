---
name: changeset
description: >
  Changesets — write the changeset file directly, since the interactive CLI asks questions an agent cannot answer. Use
  when a change to released code is ready to commit and has no changeset yet, when a check fails with "packages have
  been changed but no changesets were found", when only docs or tooling changed and the release needs an explicit
  "nothing to release", or when the user asks for a changeset, a release note, or a version bump. Not for running a
  release or editing versions and changelogs by hand — automation owns those.
---

# Write a changeset without the prompts

The interactive `changeset add` asks questions an agent has no way to answer — write the file yourself instead. The
format is trivial; the judgment is in package selection and bump type.

## 1. Does this change need a changeset at all?

Docs, tooling, CI or test-only changes → an **empty changeset**: an explicit "nothing to release" that still satisfies
the check. `changeset add --empty` is non-interactive and only writes the file, or write it yourself — an empty
changeset is the frontmatter delimiters and nothing else:

```markdown
---
---
```

Changes to published source → a real changeset, continue below.

## 2. Pick the packages

- List the packages you **directly changed** and nothing else. Changesets bumps internal dependents on its own; listing
  them yourself over-bumps them and writes them a changelog entry describing work they didn't get.
- Every name must be one Changesets will release: published, and absent from the `ignore` array in
  `.changeset/config.json`. Read that array — the directory tree doesn't reveal it.
- Take each name from the package's own manifest. A directory name is not that name — the two diverge routinely, by a
  scope, a prefix, an abbreviation, or entirely — and a name matching no package fails the version step later, long
  after you've moved on.

## 3. Pick the bump

| Bump    | When                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------- |
| `major` | Breaking change to a public API — a removed or renamed export, changed behavior consumers rely on |
| `minor` | New backwards-compatible behavior                                                                 |
| `patch` | Bug fix or internal improvement with no API change                                                |

**Decide the bump against the package's public surface, not against the description of the change.** The surface is
what consumers can reach — the declared entry points and the documented API — not everything the source exports. A
changed signature, return shape, thrown error or default on that surface is breaking even though no export disappeared;
a symbol reachable only by an internal path isn't on the surface at all. "Internal refactor" is a claim; the entry
points are the evidence.

If two bumps are both defensible, ask the user — the bump is a release decision, and once a release runs it is
published.

## 4. Write the file

Create `.changeset/<slug>.md`. Any unique kebab-case slug works; describe the change (`fix-retry-timeout.md`) so the
file is readable in review.

```markdown
---
"@scope/package-name": patch
---

Short imperative summary, written for whoever reads the changelog.

Optional body: what changed and why. For a breaking change, describe the migration a consumer has to make.
```

Quote the package names — an unquoted value starting with `@` is not valid YAML. Multiple packages get one line each,
and their bumps may differ.

## 5. Verify

Changesets ships its own check: `changeset status --since=<base-branch>` prints what would be released and exits
non-zero when a changed package has no changeset covering it. Run it however this project runs its installed tools, and
confirm it reports nothing missing.

Commit the changeset alongside the change. `changeset version` applies the bumps and writes the changelog entries at
release time — never hand-edit either.
