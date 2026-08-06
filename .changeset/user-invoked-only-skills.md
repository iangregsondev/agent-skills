---
"mentor": major
"walkthrough": major
"us-english-spelling-sweep": major
"agent-config-audit": major
---

Only the user starts these four now. `disable-model-invocation: true` keeps each one out of the list the harness
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
