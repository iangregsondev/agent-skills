# External skills

Third-party skills worth using alongside this repo. Nothing here is vendored,
forked or reproduced under `skills/` — the value is the install route and the
scope call, and copying the files would only buy a maintenance burden.

> [!IMPORTANT]
> **We did not write these skills, and we do not own, maintain, review or support
> them.** Listing one is a pointer, nothing more. Every question, bug, security
> report and support request belongs on its own repo, not on ours. Please read
> [What this list is not](#what-this-list-is-not) before installing anything.

Rows are grouped by source repo, not by skill — most repos hold more than we
list, and listing a repo is never a claim on all of it. A repo gets a second row
only when two of its skills want different scopes.

| Skills                                                                                                                                                                                                                                                                                                        | Source                                                    | Install | Recommended scope                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------- | ------------------------------------- |
| [`effect-ts`](https://github.com/Effect-TS/skills/tree/main/skills/effect-ts)                                                                                                                                                                                                                                 | [Effect-TS/skills](https://github.com/Effect-TS/skills)   | Skill   | Project — fires unasked, wants a repo |
| [`code-review`](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review), [`wayfinder`](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder), [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills) | [mattpocock/skills](https://github.com/mattpocock/skills) | Both    | Global                                |

## Install routes

Which route applies is a property of the source repo, not a choice we make:

- **Skill** — installed as loose, unnamespaced files (skills.sh and equivalents),
  per project or globally, and editable once copied in.
- **Plugin** — installed as a managed, namespaced (`plugin:skill`) bundle from a
  repo that ships a plugin marketplace manifest, and updated rather than edited.
- **Both** — the repo supports either route; pick by whether you want editable
  files or a namespaced, always-current copy.

For the command, the flags, and anything the author wants done after installing
— setup steps, required config, prerequisites — go to the source repo. It is the
only place that is current.

## Recommended scope

A skill installed **globally** is available in every repo you open. Installed
**per project** it exists only where you put it. Both routes above support
global; only the loose-skill route supports per project.

It is a recommendation, not a rule, and it is our reading rather than the
author's instruction — where an author states a scope, theirs wins.

**Global is the default**, and rows say only "Global" because there is nothing to
explain. A skill earns **Project** when installing it everywhere would cost you
something, which in practice means one of:

- it fires without being asked, so it will interject in repos it knows nothing
  about;
- it expects particular files or layout to exist, and stops to complain when they
  don't;
- it encodes one stack's conventions, which are wrong advice outside that stack.

Those rows carry the reason inline, in a few words. Anything longer belongs in
the notes below, and most entries need no note at all.

## Notes

Only where something isn't obvious from the table.

**mattpocock/skills** — the repo carries far more than the three listed; this is
a subset, not a verdict on the rest. On the loose-skill route watch for name
collisions: `code-review` and `tdd` also exist in this repo.

## What this list is not

These skills are other people's work, hosted in other people's repositories. A
row here is a pointer, not an endorsement, and not a claim about safety.

- **Not ours.** We did not write, review, audit or test anything on this page,
  and we have no say in what it does next. Read a skill before you install it,
  the same as any other code you pull into your project.
- **Support goes to the author, not to us.** Bugs, questions, feature requests,
  security reports and licensing all belong on the source repo's issue tracker.
  We can't answer for someone else's skill and won't take issues about one.
- **If it breaks something, that is between you and the author.** Installing is
  your call, made on their terms, with no warranty from us.
- **Portability is not implied.** Skills in this repo default to naming no
  language, framework, runner or package manager, and are tested against it. That
  default is ours and stops at our boundary — we make no claim either way about
  anything on this list. A skill here may be tied to a particular language,
  framework or toolchain, and that may be exactly its point. Read the source and
  decide whether it fits your project.
- **Upstream can change or disappear at any time** — including its install route
  and its behavior — with no notice to us. Rows go stale; the source link wins.
- **This applies only to the skills on this page.** The skills under `skills/`
  in this repo are ours, and those we do stand behind.
