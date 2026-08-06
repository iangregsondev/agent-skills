# walkthrough

## 2.0.0

### Major Changes

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Only the user starts these four now. `disable-model-invocation: true` keeps each one out of the list the harness
  injects, so neither the agent nor another skill can reach for it; typing `/name` still works, and so does a project's
  own configuration.

  They are the four where the agent deciding costs more than it saves. `mentor` and `walkthrough` are modes about the
  user rather than the task — misfired, `mentor` answers a request for a diff with homework, withholding the deliverable
  until the user notices and asks again. `us-english-spelling-sweep` and `agent-config-audit` report every finding before
  they change anything, so the cost there is scope, not damage: a passing remark about one British spelling becomes a
  repo-wide sweep nobody asked for.

  The descriptions are unchanged. Their trigger lists no longer route anything, but a human browsing the slash commands
  still reads them.

  One consequence worth knowing: a flagged skill is invisible to the agent even when it is asked what is installed, so it
  may report one of these as missing. `.claude-plugin/plugin.json` is the authority on what ships. The flag is also a
  Claude Code frontmatter field — under another harness, or installed loose, these may still auto-invoke.

### Minor Changes

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Each of these now says in its own body that the user starts it, and tells an agent that arrived on its own judgment to
  stand down.

  `disable-model-invocation: true` is what stops the agent reaching for them, but it is a Claude Code frontmatter field.
  Copied loose into a project driven by another harness, the field is unrecognised and the skill can still fire on its
  own — which is the exact misfire the flag exists to prevent. The body is what every harness reads, so the constraint
  now lives there too:

  > **The user starts it, never you.** `<why a misfire costs more than the catch.>` If you reached this file on your own
  > judgment, say so and stand down.

  Each carries its own reason: coaching someone who asked for a diff costs them the diff, gating changes for someone who
  never asked for gates spends their session on stops, a remark about one British spelling is not a request to sweep the
  repository, and nobody asked for a config audit by mentioning a config file.

  This does not make a misfire impossible under another harness. It converts one from "the session silently changes
  shape" into "the skill loads, says so, and stops".

### Patch Changes

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Rewrite the descriptions for the reader who actually has them. These four are user-invoked, so no agent matches on the
  description any more — what is left is the line a human reads in the slash-command list. Each one is now a single
  sentence saying what the skill does, and the trigger lists are gone. `mentor` had four phrasings of one trigger
  ("teach me, don't do it for me", "let me drive", "guide me, don't take over", "don't write it, help me write it");
  those existed to widen a model's match and matched nothing once the agent stopped reading them.

  `mentor` also stops implying it can hand off. Its bullet about someone who only wanted the code narrated pointed at
  `walkthrough` and said to "offer it" — but `walkthrough` is user-invoked too, so no skill can start it. It now names
  the skill and leaves starting it to the user.

## 1.0.0

### Major Changes

- [`02b0c14`](https://github.com/iangregsondev/agent-skills/commit/02b0c14ff380fcefae79b64d1ffd8eba3eca51d5) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add the `walkthrough` skill: the agent still writes the code, but one comprehensible change at a time — the sequence
  sketched up front, the real lines shown before they land, the reasoning given rather than the syntax restated, and
  every change gated on two questions, one of which is whether anything needs explaining further. Only an explicit yes
  advances: more explanation returns to the same change, a correction revises it before anything is built on top, a skip
  reports what was resting on it, and anything ambiguous is not approval. Only the user turns the gate off.
