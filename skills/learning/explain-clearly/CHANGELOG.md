# explain-clearly

## 2.0.0

### Major Changes

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Only the user starts explain mode now, and the unprompted trigger is gone with it.

  `disable-model-invocation: true` keeps the skill out of the list the harness injects, so the agent can no longer reach
  for it. That leaves the explicit route: the user asks, or their own configuration holds it on. An output style or a
  line in the project's instruction file was always the durable way to keep the register for a whole session, and
  auto-invocation duplicated that with a mechanism the user could not switch off as cleanly — while firing on inference
  about someone's state of mind, the least reliable trigger the skill had.

  "Turning it on" loses its "Unprompted, at any sign of confusion" bullet, and the `description` loses the matching
  clause. Both advertised behavior the skill can no longer perform.

  The register itself is unchanged: every rule about how an explanation is written stays exactly as it was.

### Minor Changes

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - "Before you send" gains a sixth question — _any abstraction with no instance under it, or any gap crossed without being
  named?_ — which puts _concrete before abstract_ and _write the step in between_ under a check of their own. They were
  two of the rules the checklist did not reach, and unchecked rules are what the drift back to the compressed register
  takes first.

  The section now also says what it does not cover. Shape first, the project's own words, depth on offer and the pointed
  check have no question each; the last question is what catches them, and saying so is what stops it being read as a
  closing formality.

  The description drops its remaining trigger clause. The skill is user-invoked, so the description is read by a person
  choosing from a list, not by an agent deciding whether to fire.

- [#47](https://github.com/iangregsondev/agent-skills/pull/47) [`d93adfb`](https://github.com/iangregsondev/agent-skills/commit/d93adfbaa26eeb1198fcf9ccf664e584f6aa7b1b) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Each of these now says in its own body that the user starts it, and tells an agent that arrived on its own judgment to
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

## 1.1.0

### Minor Changes

- [#44](https://github.com/iangregsondev/agent-skills/pull/44) [`0e437e9`](https://github.com/iangregsondev/agent-skills/commit/0e437e94b5e470ab0ce8a2a89a46decf249ff5c1) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add two rules about how the sentences of an explanation are built, both inheriting the skill's existing triggers
  unchanged.

  The writing half of ASD-STE100 Simplified Technical English now governs the prose: one instruction per sentence, about
  20 words procedural and 25 descriptive, active voice with the actor named, verbs in place of nominalizations, articles
  and relative pronouns kept, and one term for one thing every time — the last of which catches what "define every term
  on first use" cannot, since a thing named three ways was defined correctly all three times. The 900-word dictionary is
  deliberately left out, and the skill says why.

  Where a project keeps a `CONTEXT.md`, its recorded vocabulary is now the vocabulary of the explanation: exact terms, no
  coined synonyms, each still defined on first use but defined _as_ the project's shared name, and a term that is wrong
  or ambiguous called out rather than quietly replaced. Read once per session, and inert in a project without the file.

  The "Before you send" checklist gains a fifth question covering both.

## 1.0.0

### Major Changes

- [#41](https://github.com/iangregsondev/agent-skills/pull/41) [`927ec9d`](https://github.com/iangregsondev/agent-skills/commit/927ec9dfb2b0b698aaea5b82affe987e4599a1a3) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add the `explain-clearly` skill: the answer is unchanged, the prose around it is not. Every term is defined where it
  first appears, the concrete case comes before the abstraction, hand-waving verbs are replaced by the literal steps,
  each non-obvious step says what breaks without it, and the close asks about the part people actually get stuck on —
  checked against four questions before every answer goes. It fires unprompted at any sign of confusion, so nobody has
  to ask twice to get the explanation they wanted first, and it holds for the session until the user ends it. Length is
  not the goal: a lookup still gets one line.
