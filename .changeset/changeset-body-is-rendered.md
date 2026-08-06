---
"changeset": minor
---

Say that the changeset body is rendered before anyone reads it.

The skill now names where the body goes — copied verbatim into `CHANGELOG.md`, and into whatever the project publishes
from there — and that every one of those surfaces renders it. It also names the failure that survives review:
`<anything in angle brackets>` reads as an HTML tag, so a renderer either deletes it with its contents or emits an
element nothing displays, while the source still reads correctly. Wrap placeholders in backticks.
