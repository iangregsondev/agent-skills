---
"mentor": patch
"walkthrough": patch
"us-english-spelling-sweep": patch
"agent-config-audit": patch
---

Rewrite the descriptions for the reader who actually has them. These four are user-invoked, so no agent matches on the
description any more — what is left is the line a human reads in the slash-command list. Each one is now a single
sentence saying what the skill does, and the trigger lists are gone. `mentor` had four phrasings of one trigger
("teach me, don't do it for me", "let me drive", "guide me, don't take over", "don't write it, help me write it");
those existed to widen a model's match and matched nothing once the agent stopped reading them.

`mentor` also stops implying it can hand off. Its bullet about someone who only wanted the code narrated pointed at
`walkthrough` and said to "offer it" — but `walkthrough` is user-invoked too, so no skill can start it. It now names
the skill and leaves starting it to the user.
