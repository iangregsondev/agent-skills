# explain-clearly

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
