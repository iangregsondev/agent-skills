## Summary

<!-- What does this change and why? One or two sentences. -->

## Related issue

<!-- e.g. #12 — use a plain reference, not a closing keyword. -->

## Type of change

- [ ] New skill
- [ ] Change to an existing skill
- [ ] Documentation
- [ ] Tooling / CI / repo config

## Checklist

- [ ] `vp run ready` passes
- [ ] If this adds or changes a skill, a changeset is included (`vpx changeset`)
- [ ] If a plugin manifest exists, `claude plugin validate . --strict` passes

For a new or changed skill:

- [ ] The skill names no language, test runner, package manager, or directory
      layout — it defers tool decisions to the consuming project. If it genuinely
      needs one, `metadata.assumes` lists it, the `description` names it too, and
      the PR says why the portable version would be worse
- [ ] Its path is listed in the `skills` array of `.claude-plugin/plugin.json`
      (or is deliberately held back)
- [ ] The `description` matches how the skill is invoked — one trigger per
      branch with no synonym padding if the agent can fire it, or a one-line
      summary with the triggers stripped if it is user-invoked
      (`disable-model-invocation: true`)
- [ ] A user-invoked skill says so in its body too — who starts it, why a
      misfire is expensive, and to stand down if the agent arrived on its own
      judgment. The frontmatter flag is Claude Code only; the body travels
