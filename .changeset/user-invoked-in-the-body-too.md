---
"mentor": minor
"walkthrough": minor
"explain-clearly": minor
"us-english-spelling-sweep": minor
"agent-config-audit": minor
---

Each of these now says in its own body that the user starts it, and tells an agent that arrived on its own judgment to
stand down.

`disable-model-invocation: true` is what stops the agent reaching for them, but it is a Claude Code frontmatter field.
Copied loose into a project driven by another harness, the field is unrecognised and the skill can still fire on its
own — which is the exact misfire the flag exists to prevent. The body is what every harness reads, so the constraint
now lives there too:

> **The user starts it, never you.** <why a misfire costs more than the catch.> If you reached this file on your own
> judgment, say so and stand down.

Each carries its own reason: coaching someone who asked for a diff costs them the diff, gating changes for someone who
never asked for gates spends their session on stops, a remark about one British spelling is not a request to sweep the
repository, and nobody asked for a config audit by mentioning a config file.

This does not make a misfire impossible under another harness. It converts one from "the session silently changes
shape" into "the skill loads, says so, and stops".
