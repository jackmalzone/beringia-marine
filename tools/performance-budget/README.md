# Performance budget check

Runs Lighthouse against a target URL, compares results to `config/performance-budgets.json`, and writes JSON + Markdown summary. Only budget violations and warnings are reported—not every Lighthouse finding.

## Prerequisites

- Node 18+
- For local exploratory runs: target app running (e.g. `pnpm dev` on `http://localhost:3000`)
- For release/CI enforcement: run against production via `check:perf:prod`

## Usage

```bash
# Exploratory/local run (can be noisy in dev mode)
pnpm run check:perf

# Enforcement run (build + start + wait + check + cleanup)
pnpm run check:perf:prod
```

`check:perf` now fails fast if development-only artifacts are detected (`next-devtools`, HMR, etc.). This prevents accidental budget decisions from dev-mode telemetry.

### CLI options

| Option       | Default                          | Description                    |
|-------------|-----------------------------------|--------------------------------|
| `--url`     | `http://localhost:3000`          | URL to audit                   |
| `--budgets` | `config/performance-budgets.json`| Path to budget config          |
| `--mode`    | `mobile`                          | `mobile` or `desktop`          |
| `--help`    | —                                 | Show help                      |

## Output

- **`output/performance-<timestamp>.json`** — Full metrics and comparison (violations, warnings, `allSatisfied`).
- **`output/performance-summary-<timestamp>.md`** — Human-readable summary: violations only, then warnings; status (Green / Yellow / Red).

Exit codes:

- `0` — All budgets satisfied or only warnings.
- `1` — Invalid run (for example, dev-mode artifacts detected).
- `2` — One or more violations (release-blocking unless waived).

## Escalation

- **Green** — All budgets satisfied → no action.
- **Yellow** — Warnings only → note in release template; fix if trivial.
- **Red** — Any violation → must be addressed or explicitly waived with rationale.

See [docs/predeploy/performance-budget-guide.md](../../docs/predeploy/performance-budget-guide.md) for when to run (Fast / Standard / Release) and when violations are acceptable.
