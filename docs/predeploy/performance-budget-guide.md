# Performance budget guide

Performance here is **stewardship, not gamification**. This guide explains what performance budgets are, why we use them, when to run the check, and how to interpret results. The goal is to catch meaningful regressions without turning Lighthouse into a source of anxiety or noise.

---

## What are performance budgets?

Performance budgets are **explicit limits** on metrics that matter for this site:

- **Core Web Vitals** — LCP (ms), INP (ms), CLS. They reflect user‑visible load and interaction quality.
- **Asset size** — Total JS (kb), total CSS (kb), font request count. They keep parse and transfer cost in check.
- **Third‑party usage** — Max number of third‑party requests and an allowlist (analytics, CMS, maps, etc.).

Budgets are defined in **`config/performance-budgets.json`**. They are conservative but realistic, and adjustable without code changes. Each section in the config documents why that budget exists.

---

## Why budgets instead of chasing Lighthouse scores?

We use budgets so that:

1. **Only meaningful regressions** are flagged. The summary does not list every Lighthouse suggestion—only violations and warnings against our own thresholds.
2. **Releases stay predictable.** Green = no action. Yellow = note and fix if trivial. Red = fix or waive with rationale.
3. **Cursor and humans** treat the budget file as the source of truth. We avoid metric maximalism and micro‑optimizations when we’re within budget.

Lighthouse is the **measurement tool**; the budgets are the **decision boundary**.

---

## When to run the budget check

Use the same pass levels as the [SEO pre-deploy checklist](seo-predeploy-checklist.md):

| Pass        | When to run                         | Performance budget check |
|------------|--------------------------------------|---------------------------|
| **Fast**   | Small changes, hotfixes, tight time  | Optional. Run if you touched JS/CSS, images, or third‑party scripts. |
| **Standard** | Normal feature releases, content work | Run once with production harness: `pnpm run check:perf:prod`. Review summary. |
| **Release** | Launch, big features, major dependency bumps | Mandatory. Run production budget check; resolve or waive violations. Note result in [release template](release-template.md). |

**How to run (source of truth):**

```bash
pnpm run check:perf:prod
```

`check:perf:prod` orchestrates build/start/readiness/check/cleanup and avoids dev-only artifacts.

For exploratory local work only (not release gating), you can still run:

```bash
pnpm run check:perf -- --mode mobile
```

If dev-only scripts are detected (for example, `next-devtools` or HMR artifacts), the check exits with code `1` and asks you to run the production harness.

---

## Interpreting output

### JSON: `output/performance-<timestamp>.json`

- **`metrics`** — Raw values (LCP, INP, CLS, JS/CSS/font sizes, third‑party count) as extracted from Lighthouse.
- **`comparison.violations`** — Metrics that **exceed** the budget (red).
- **`comparison.warnings`** — Metrics **approaching** the limit (e.g. ≥90% of budget; yellow).
- **`comparison.allSatisfied`** — `true` when there are no violations and no warnings.

Use the JSON for automation or to compare runs over time.

### Markdown summary: `output/performance-summary-<timestamp>.md`

- If **all budgets are satisfied**, the summary states that explicitly and says no action is required.
- Otherwise it lists:
  - **Violations** — Metric, budget, actual value, likely cause, severity.
  - **Warnings** — Same structure; these are “approaching limit.”
- At the bottom: **Status** — Green / Yellow / Red and a pointer to this guide.

The summary does **not** list every Lighthouse issue—only budget‑relevant violations and warnings.

---

## Escalation discipline

| Status  | Meaning | Action |
|--------|--------|--------|
| **Green** | All budgets satisfied | No action required. |
| **Yellow** | One or more warnings (approaching limit) | Note in release template; fix if trivial. Do not block release for yellow alone. |
| **Red** | One or more violations (exceeded budget) | **Must** be addressed or explicitly waived with rationale. Red is a release blocker unless waived. |

### When are budget violations acceptable?

- **Explicit waiver:** Document in the release template (or PR) which metric is over budget and why it’s acceptable (e.g. one‑time marketing script, A/B test, known fix in next sprint).
- **Short‑lived spikes:** E.g. a new analytics script that will be optimized in the next release. Still document and track.

### When should performance work escalate to architectural review?

- Repeated violations on the same metric after “fixes.”
- Adding a new category of third‑party (not on the allowlist) that pushes over the third‑party budget.
- Core Web Vitals consistently red on key pages with no clear, small fix.

---

## Examples

### Acceptable violation (with waiver)

- **Scenario:** LCP is 2.8s (budget 2.5s) on the homepage after adding a high‑impact hero video.
- **Acceptable if:** The business accepts the tradeoff for this release and the team documents “Hero video approved; LCP waiver for Q1; optimize in Q2” in the release template.

### Dangerous violation (should not ship without fix or clear waiver)

- **Scenario:** Total JS is 600 kb (budget 450 kb) after a new dependency; no waiver or plan.
- **Why dangerous:** Uncontrolled JS growth leads to slower TTI and worse INP on real devices. Fix (e.g. code‑split, lazy load, or remove) or get an explicit waiver with owner and follow‑up.

### What not to fix

- **Within budget:** Do not optimize Lighthouse scores or add work just to “improve” a metric that is already under the budget. Avoid micro‑optimizations when the budget is satisfied.
- **Generic best practices:** Performance advice in this repo should reference the budgets and this guide, not a long list of generic tips. If a metric is within budget, “improving” it is optional and often unnecessary.

---

## Summary

- **Budgets** = `config/performance-budgets.json`. They are the source of truth.
- **Tool** = `tools/performance-budget` (Lighthouse under the hood). Use `pnpm run check:perf:prod` for enforcement.
- **Output** = JSON (metrics + comparison) + Markdown summary (violations and warnings only).
- **Discipline** = Green → no action. Yellow → note; fix if trivial. Red → fix or waive with rationale. Escalate when violations persist or new third‑party categories are needed.

For Cursor and contributors: treat performance as stewardship. Use the budget check before release; don’t chase scores when already in the green.
