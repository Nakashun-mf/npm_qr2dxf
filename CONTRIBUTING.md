# Contributing

## Setup

```bash
git clone https://github.com/Nakashun-mf/npm_qr2dxf.git
cd npm_qr2dxf
npm install   # also installs git hooks via husky
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build CJS + ESM output to `dist/` |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run type-check` | TypeScript type check (no emit) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).
Messages are enforced by commitlint on every commit.

| Prefix | Triggers release | Example |
|--------|------------------|---------|
| `feat:` | minor version | `feat: add SVG output format` |
| `fix:` | patch version | `fix: correct Y-axis inversion for HATCH` |
| `BREAKING CHANGE:` | major version | added in commit body |
| `docs:` `chore:` `test:` `refactor:` | no release | maintenance work |

## Quality Gates

All of the following must pass before a PR can merge:

- **Type check** — `npm run type-check` (no TypeScript errors)
- **Lint** — `npm run lint` (no ESLint errors)
- **Build** — `npm run build` (tsup succeeds)
- **Tests** — `npm test` (all pass)
- **Coverage** — lines ≥ 80%, functions ≥ 80%, branches ≥ 70%

These are enforced automatically by CI on every push and pull request.

## Releasing

Releases are fully automated via `semantic-release` on every push to `main`.
Do **not** manually bump `version` in `package.json` or edit `CHANGELOG.md`.

## Pull Requests

1. Branch from `main`
2. Keep PRs focused — one feature or fix per PR
3. Ensure CI is green before requesting review
