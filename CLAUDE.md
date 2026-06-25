# qr-to-dxf — Project Instructions for Claude

## Project Overview

`qr-to-dxf` is a TypeScript npm package that converts QR codes to DXF files for use with laser cutters and CNC machines. Published on npm as `qr-to-dxf`; source is at `github.com/Nakashun-mf/npm_qr2dxf`.

## Architecture

```
src/
  types.ts       — QRDxfOptions interface, function type exports
  generator.ts   — QR generation via qrcode.create(); returns boolean matrix
  dxf-writer.ts  — Converts matrix to DXF entities (SOLID, HATCH, LWPOLYLINE)
  index.ts       — Public API entry point
dist/
  index.js       — CJS output
  index.mjs      — ESM output
  index.d.ts     — Type declarations
```

**Build**: tsup (esbuild-based, no type-checking). Always run `npm run type-check` separately.

## Key Technical Notes

- `modules.data` in the `qrcode` library is typed as `Uint8Array` but behaves as a 2D boolean array at runtime; the cast in `generator.ts` is intentional but fragile (tracked in issue #4)
- DXF entities: SOLID (3DFACE), HATCH, LWPOLYLINE — each has different compatibility with laser cutter software
- `generateQRDxfFile()` uses `fs/promises` (Node.js-only); `generateQRDxf()` is the browser-safe path
- The `size` parameter in `matrixToDxf()` is redundant — it can be derived from the matrix (tracked in issue #5)

## Quality Gates (all must pass on every PR)

```bash
npm run type-check     # TypeScript strict mode (tsc --noEmit)
npm run lint           # ESLint with typescript-eslint/recommended
npm run build          # tsup CJS + ESM dual output
npm run test:coverage  # Vitest with thresholds: lines/functions/statements ≥80%, branches ≥70%
```

## Commit Convention (Conventional Commits — enforced via commitlint)

| Prefix | Triggers |
|--------|----------|
| `feat:` | minor release |
| `fix:` | patch release |
| `feat!:` or `BREAKING CHANGE:` footer | major release |
| `chore:`, `docs:`, `test:`, `refactor:`, `ci:` | no release |

PR titles must follow the same format (used as squash commit message).

## Open Issue Backlog

When making changes, watch for these known issues:

- [#4](https://github.com/Nakashun-mf/npm_qr2dxf/issues/4) — Fragile internal type cast in `generator.ts` (`modules.data as unknown as Uint8Array`)
- [#5](https://github.com/Nakashun-mf/npm_qr2dxf/issues/5) — Redundant `size` parameter in `matrixToDxf` (breaking change to fix)
- [#6](https://github.com/Nakashun-mf/npm_qr2dxf/issues/6) — No input validation (empty string, oversized URL, invalid options)
- [#7](https://github.com/Nakashun-mf/npm_qr2dxf/issues/7) — HATCH boundary path may not close correctly per DXF spec
- [#8](https://github.com/Nakashun-mf/npm_qr2dxf/issues/8) — No browser-safe bundle / environment-agnostic export split
- [#9](https://github.com/Nakashun-mf/npm_qr2dxf/issues/9) — Test coverage gaps (error paths, malformed input, boundary conditions)
- [#12](https://github.com/Nakashun-mf/npm_qr2dxf/issues/12) — Missing JSDoc on public API
- [#13](https://github.com/Nakashun-mf/npm_qr2dxf/issues/13) — No integration test validating real DXF output structure

## PR Review Checklist

When reviewing pull requests:

- [ ] All 4 quality gates pass (type-check → lint → build → test:coverage)
- [ ] No `any` types introduced without explicit justification comment
- [ ] If `dxf-writer.ts` is touched: DXF entity structure remains valid (check entity counts and coordinate precision)
- [ ] Public API surface unchanged unless PR title contains `!` or `BREAKING CHANGE` footer
- [ ] New public functions have JSDoc
- [ ] New functionality has corresponding tests
- [ ] PR title follows Conventional Commits format
- [ ] No `console.log` (only `console.warn` / `console.error` are allowed by lint)
