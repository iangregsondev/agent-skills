---
"explain-clearly": major
---

Only the user starts explain mode now, and the unprompted trigger is gone with it.

`disable-model-invocation: true` keeps the skill out of the list the harness injects, so the agent can no longer reach
for it. That leaves the explicit route: the user asks, or their own configuration holds it on. An output style or a
line in the project's instruction file was always the durable way to keep the register for a whole session, and
auto-invocation duplicated that with a mechanism the user could not switch off as cleanly — while firing on inference
about someone's state of mind, the least reliable trigger the skill had.

"Turning it on" loses its "Unprompted, at any sign of confusion" bullet, and the `description` loses the matching
clause. Both advertised behavior the skill can no longer perform.

The register itself is unchanged: every rule about how an explanation is written stays exactly as it was.
