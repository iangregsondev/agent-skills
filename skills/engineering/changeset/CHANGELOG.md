# changeset

## 1.1.0

### Minor Changes

- [#53](https://github.com/iangregsondev/agent-skills/pull/53) [`8c8aca6`](https://github.com/iangregsondev/agent-skills/commit/8c8aca6e99bbdf95f205690525da1672e52e505f) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Say that the changeset body is rendered before anyone reads it.

  The skill now names where the body goes — copied verbatim into `CHANGELOG.md`, and into whatever the project publishes
  from there — and that every one of those surfaces renders it. It also names the failure that survives review:
  `<anything in angle brackets>` reads as an HTML tag, so a renderer either deletes it with its contents or emits an
  element nothing displays, while the source still reads correctly. Wrap placeholders in backticks.

## 1.0.0

### Major Changes

- [#17](https://github.com/iangregsondev/agent-skills/pull/17) [`b863c5c`](https://github.com/iangregsondev/agent-skills/commit/b863c5c2c51f6477b9aa800ce606e79684789f33) Thanks [@iangregsondev](https://github.com/iangregsondev)! - Add the changeset skill: write the changeset file directly, since the interactive CLI asks questions an agent cannot
  answer, and get the package selection and SemVer bump right.
