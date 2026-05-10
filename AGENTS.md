# Repository Working Notes

This file records the preferred working conventions for changes in this repository.

## Branch Naming

Use short, single-purpose branch names in lowercase:

- `feature/...` for user-facing additions or UI changes
- `fix/...` for bugs, regressions, and security fixes
- `chore/...` for CI, GitHub settings, dependencies, and maintenance
- `docs/...` for documentation-only changes
- `refactor/...` for structural code cleanup without intended behavior change

Examples:

- `feature/header-branding`
- `fix/hydration-warning`
- `fix/next-security-update`
- `chore/github-guardrails`

## Commit Messages

Use short imperative commit messages:

- `Refine header branding`
- `Fix hydration warning`
- `Update Next.js security dependencies`
- `Add repository guardrails for CI and pull requests`

Avoid vague messages such as:

- `update`
- `fix stuff`
- `changes`
- `wip`

## Pull Requests

Keep PRs narrow and single-purpose.

Preferred PR structure:

- `Summary`
- `Why`
- `Validation`
- `Risks / Follow-up`

## Merge Strategy

The repository is configured for a squash-merge workflow.

- Open a branch for every change
- Do not work directly on `main`
- Prefer one logical change per PR
- Use `Squash and merge`

## Validation

Before opening or merging a PR, prefer running the checks that match the change:

- `npm run build`
- `npm audit`

## Notes For Future Changes

- Avoid unnecessary `out/` churn unless the exported output is intentionally being refreshed
- Keep UI/content changes separate from dependency or GitHub configuration changes when practical
