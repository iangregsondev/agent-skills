# explain-clearly

## 1.0.0

### Major Changes

- [#41](https://github.com/iangregsondev/agent-skills/pull/41) [`927ec9d`](https://github.com/iangregsondev/agent-skills/commit/927ec9dfb2b0b698aaea5b82affe987e4599a1a3) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add the `explain-clearly` skill: the answer is unchanged, the prose around it is not. Every term is defined where it
  first appears, the concrete case comes before the abstraction, hand-waving verbs are replaced by the literal steps,
  each non-obvious step says what breaks without it, and the close asks about the part people actually get stuck on —
  checked against four questions before every answer goes. It fires unprompted at any sign of confusion, so nobody has
  to ask twice to get the explanation they wanted first, and it holds for the session until the user ends it. Length is
  not the goal: a lookup still gets one line.
