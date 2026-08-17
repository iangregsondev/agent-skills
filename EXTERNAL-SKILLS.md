# External skills

Third-party skills worth using alongside this repo. Nothing here is vendored,
forked or reproduced under `skills/` — the value is the install route, and
copying the files would only buy a maintenance burden.

> [!IMPORTANT]
> **We did not write these skills, and we do not own, maintain, review or support
> them.** Listing one is a pointer, nothing more. Every question, bug, security
> report and support request belongs on its own repo, not on ours. Please read
> [What this list is not](#what-this-list-is-not) before installing anything.

Rows are grouped by source repo, not by skill — most repos hold more than we
list, and listing a repo is never a claim on all of it.

| Skills                                                                                                                                                                                                                                                                                                        | Source                                                    | Install |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------- |
| [`effect-ts`](https://github.com/Effect-TS/skills/tree/main/skills/effect-ts)                                                                                                                                                                                                                                 | [Effect-TS/skills](https://github.com/Effect-TS/skills)   | Skill   |
| [`code-review`](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review), [`wayfinder`](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder), [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills) | [mattpocock/skills](https://github.com/mattpocock/skills) | Both    |

## Install routes

Which route applies is a property of the source repo, not a choice we make:

- **Skill** — installed as loose, unnamespaced files (skills.sh and equivalents),
  per project or globally, and editable once copied in.
- **Plugin** — installed as a managed, namespaced (`plugin:skill`) bundle from a
  marketplace manifest that lists it, which may sit in the plugin's own repo or
  in a separate catalogue, and updated rather than edited.
- **Both** — the repo supports either route; pick by whether you want editable
  files or a namespaced, always-current copy.

For the command, the flags, and anything the author wants done after installing
— setup steps, required config, prerequisites — go to the source repo. It is the
only place that is current.

## Notes

Only where something isn't obvious from the table.

**mattpocock/skills** — the repo carries far more than the three listed; this is
a subset, not a verdict on the rest.

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
