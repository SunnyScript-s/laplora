# Laplora architecture

Laplora runs its experimental SAT simulations entirely in the browser. The React/TypeScript architecture and V0.1 mathematical rules were approved on October 14, 2026. The [original development plan](DEVELOPMENT_PLAN.md) remains the roadmap; this document describes the implemented system.

## Stack

| Technology | Role |
| --- | --- |
| React + TypeScript | Guided forms, view state, results, and shared typed contracts |
| Vite | Development server and static production build |
| CSS Modules + shared CSS variables | Responsive layout, typography, colors, and motion |
| Native SVG | Score trajectories, comparison curves, and decorative artwork |
| Zod | Runtime input validation |
| Vitest | Pure input, calendar, simulation, and scenario tests |
| Playwright + axe-core | Browser workflows, keyboard behavior, reflow, and automated accessibility checks |
| npm + committed lockfile | Reproducible dependency installation |

Node 24.19.0 and npm 11.9.0 are pinned for development. No backend, paid runtime service, application API key, chart library, or animation library is required.

## Code organization

```text
src/
  app/        guided setup, navigation state, results, charts, and comparisons
  domain/     assessment inputs, validation, and date-only calculations
  model/      pure simulation functions, scenarios, and versioned parameters
  product/    tier, feature, and planned offer definitions
  styles/     global tokens, accessibility rules, and local fonts
tests/
  unit/       calendar, input, model, and scenario behavior
  e2e/        browser workflows and accessibility checks
public/       favicon and distributed font license notices
docs/         product, research, model, design, and verification records
scripts/      standalone preview generation
```

## Data flow

Raw form strings → validated student input → explicit model parameters → separate Math and Reading & Writing trajectories → combined totals → charts, tables, and explanations.

The model receives an explicit start date and parameter set. It does not depend on React, browser storage, network calls, or an implicit clock. Results include the model version, assumptions, and input snapshot. Target score is a comparison marker; it does not increase modeled growth.

Scenario comparisons keep baseline scores, goals, dates, and model version fixed. They change only the supported study-plan fields and disclose those changes. Preparation methods, experience, and practice-test frequency provide context without unvalidated numerical bonuses.

## Mathematical contract

Each section uses diminishing returns in effective practice and remaining room below 800:

```text
e = consistency × H × (1 − exp(−sectionHours / H))
score(t) = baseline + (800 − baseline) × (1 − exp(−k × e × t))
```

V0.1 uses H=4 and slower/central/faster rates 0.006/0.012/0.018. These coefficients are experimental. The range is a sensitivity illustration, not a confidence interval or a probability of test-day performance.

Zero hours or zero consistency produces no practice-driven growth; a section at 800 stays there. Weekly samples include the exact partial-week endpoint. Internal calculations retain precision; displayed section scores round to tens before totals are added. Date-only calculations avoid timezone shifts.

SAT baselines and compatible PSAT observations follow the [input specification](docs/INPUT_SPECIFICATION.md). PSAT section scores below the SAT floor are preserved as observations and require a scored SAT baseline before an SAT trajectory is produced. Old observations do not receive invented progress between the baseline date and today.

See the [model specification](docs/MODEL_SPECIFICATION.md), [simulation rules](docs/SIMULATION_RULES.md), and [research notes](docs/GROWTH_RESEARCH.md) for assumptions, evidence, boundaries, and limitations.

## Interface and privacy

View state handles landing, guided setup, results, How It Works, and pricing. Both informational views keep the active setup/results component mounted but hidden, preserving step and comparison state while students browse. Draft inputs and comparison state survive in-app navigation; browser Back does not navigate individual form steps. Refresh clears all entered data. Reset asks before discarding entered work.

The app uses no accounts, database, score telemetry, or server-side student records. Inputs are not placed in URLs. Any future persistence, feedback collection, or account feature needs a separate privacy and product decision.

The current design uses orange/amber glass artwork, Disket Mono display type, and Manrope body text. SVG charts have keyboard timeline exploration and a table alternative. Semantic controls, field errors, visible focus, and system reduced-motion support are shared requirements. The small footer credit identifies the project owner.

## Planned monetization

The pricing view presents Free, planned monthly Pro, and a potential one-time 90-day pass. Product definitions live in src/product/plans.ts with stable feature, tier, and offer IDs, explicit availability, prices in cents, currency, and billing period. This catalog describes the product; it grants no entitlements and collects no data. The UI reuses existing panels, controls, design tokens, and entrance motion.

Future authenticated services can reference these IDs for saved plans, practice scores, subscriptions, and entitlements. Server-side entitlement checks, ownership checks, subscription lifecycle handling, and account/data deletion must accompany actual premium implementation; a client-side plan definition is not authorization. No service adapter, payment SDK, account creation, or fake premium implementation is introduced here. See [MONETIZATION.md](docs/MONETIZATION.md).

## Verification and remaining work

Unit tests cover validation, calendar behavior, score boundaries, zero effort, ceilings, section-total consistency, and scenario behavior, including a 2,160-profile stress grid. Browser tests cover the guided flow, comparisons, input errors, privacy behavior, keyboard interaction, motion preferences, automated accessibility scans, and enlarged-text reflow.

These checks establish software behavior, not empirical prediction accuracy or complete accessibility compliance. Physical-device and screen-reader review, performance measurements, student beta feedback, feedback-storage decisions, and deployment remain separate milestones. The public beta target is February 2, 2027.

See [PROGRESS.md](PROGRESS.md) and the test reports for actual results and unresolved limits. Keep substantive model, architecture, and scope changes reviewable by the project owner. Preserve accurate commit history and the original source plan.
