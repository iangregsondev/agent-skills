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
      layout — it defers tool decisions to the consuming project
- [ ] Its path is listed in the `skills` array of `.claude-plugin/plugin.json`
      (or is deliberately held back)
- [ ] The `description` lists one trigger per branch, with no synonym padding
