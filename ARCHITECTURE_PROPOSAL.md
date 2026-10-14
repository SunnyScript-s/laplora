# Laplora V1 — architecture and development proposal

Status: React/TypeScript architecture, implementation-with-mentoring, and V0.1 input/model/scenario choices approved by the founder on October 14, 2026. Prepared October 14, 2026.

Primary reference: [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md), preserved verbatim from the supplied Notion Markdown export. The export contains one Markdown page and no linked subpage files. The original Notion link was inaccessible; the entire supplied export was read successfully.

## Product objective

Laplora should help a student understand how changing a preparation plan changes a possible score trajectory under explicit assumptions. A normal score report describes past performance; Laplora adds an interactive way to explore future preparation choices. It must make clear that these are experimental simulations, not validated individual predictions or guaranteed gains.

V1 accepts SAT, PSAT/NMSQT, PSAT 10, and official full-length practice results. Practice-test input must identify the underlying assessment so validation uses the appropriate scale. No original quiz, accounts, admissions estimates, domain-level prediction, or server-side student records are proposed.

## Approval record and remaining decisions

The founder approved the implementation-with-mentoring workflow and the proposed React/TypeScript architecture on October 14, 2026. This resolves the implementation conflict below. TypeScript is the production language; Python remains an optional learning topic, with no duplicate production engine proposed.

1. **Implementation and learning — resolved:** the plan's Development Rule 3 says, “Do not have AI generate the entire Laplora codebase while I simply paste it.” The founder approved bounded assistant implementation with mentoring: explain the reasoning and code, involve the founder in major decisions, and offer learning exercises.
2. **Architecture — approved:** use the client-side React/TypeScript proposal below. The plan emphasizes Python learning in Weeks 6–8 but does not explicitly mandate a Python production engine. A future Python production engine would require a separate architecture decision.
3. **Model gate — approved separately:** the founder approved the written V0.1 choices, including coefficients, PSAT treatment, sensitivity wording, descriptive-only fields, and limits. Future substantive model changes still require approval.

The founder selected typography Option A and approved the proposed landing/setup/results layouts on October 14, 2026. Guided setup, results, comparisons, background polish, and reduced-motion-aware animations are authorized. Continue through the remaining model, scope, beta, and release gates without requesting these existing approvals again.

## Recommended technology stack

| Technology | Purpose and reason | Tradeoff / alternative |
| --- | --- | --- |
| TypeScript + React + Vite | Typed inputs, reusable form/chart components, static deployment, and one language for UI and engine | Next.js adds server/rendering capabilities that V1 does not require; revisit if publishing needs demand server rendering |
| CSS variables + CSS Modules | Shared colors, spacing, glass surfaces, typography, and motion tokens with explicit component styles | Tailwind is reasonable if the founder prefers utilities; neither is required for this small app |
| Recharts | React chart integration, multiple trajectories, tooltips, and custom range visualization | Prototype uncertainty bands and keyboard interaction before committing; Visx offers more control with more implementation work |
| Motion for React | Coordinated step/result transitions with reduced-motion support | Use native CSS for simple hover/focus feedback; add the library at the motion milestone |
| Zod | Explicit input parsing and runtime validation alongside TypeScript types | Manual validators avoid a dependency but require more consistent error plumbing |
| Vitest + React Testing Library | Engine, boundary, and form interaction tests | Tests focus on behavior rather than duplicating formulas |
| Playwright + axe-core | Browser workflows, viewport checks, keyboard flows, and automated accessibility checks | Automated checks complement manual review; browser availability must be verified |
| npm + lockfile | Reproducible dependencies with `npm ci` | Pin a supported Node LTS release during initialization rather than relying on the cloud image's latest version |

No paid runtime services or application API keys are necessary for this architecture. A static host will be selected before beta deployment; publishing remains an explicit owner decision.

## Proposed structure and data flow

This is a proposal, not an existing scaffold:

```text
src/
  app/                 navigation and guided-flow state
  features/setup/      baseline, goal, study-plan forms
  features/results/    charts, summaries, assumption explanations
  features/scenarios/  bounded scenario editing and comparisons
  domain/              assessment types, date rules, input schemas
  model/               pure simulation functions and versioned parameters
  components/          accessible shared UI controls
  styles/              design tokens and global accessibility rules
tests/e2e/             browser workflows
docs/                  product, research, inputs, model, design, beta reports
```

Data flow: raw form values → validated student input → explicit model assumptions → independent section simulations → combined trajectory → result presentation. Scenario comparison changes approved study-plan inputs and reruns the same version of the engine.

The engine receives an explicit simulation start date and parameter set; it must not depend on React, browser storage, network calls, or an implicit clock. Results carry the model version, assumptions, and input snapshot. The target score is a comparison marker, not a mechanism that increases modeled growth.

Keep inputs in browser memory by default. Refresh clears them. Optional local persistence or export requires an agreed use case and clear deletion controls. Do not send scores through URLs or telemetry. Later feedback collection needs its own privacy decision.

## Research and mathematical approach

### Research status and sources

Update on October 14, 2026: official source access now works when using a browser-style User-Agent. Scoring, content-domain, test-structure, and Bluebook report facts were read and documented in [docs/SAT_RESEARCH.md](docs/SAT_RESEARCH.md). The failures below record the earlier planning session; they are no longer a current blocker. Preparation-growth coefficients remain unverified.

No new external research findings were verified in this session. Requests to the following official sources failed with proxy `403 Forbidden` responses:

- https://satsuite.collegeboard.org/sat/scores/understanding-scores
- https://satsuite.collegeboard.org/psat-nmsqt/scores/understanding-scores
- https://satsuite.collegeboard.org/psat-10/scores/understanding-scores
- https://satsuite.collegeboard.org/practice/practice-tests/bluebook
- https://research.collegeboard.org/reports/sat-suite

These links are research targets, not reviewed citations. Network access for `satsuite.collegeboard.org` and `research.collegeboard.org` was saved in the environment draft; this does not activate access or establish successful retrieval. Retry after settings are applied. Source documents supplied by the founder are another route.

Weeks 1–3 must establish assessment scales, score interpretation, content domains, practice-report contents, and any credible evidence about preparation. For every source, record its date, population, test version, research design, limitations, and whether a finding is descriptive, associational, or causal. Do not convert a reported association between study hours and improvement into a guaranteed individual gain.

Keep a ledger separating official scoring facts, supported empirical observations, and experimental model assumptions. Do not claim calibration or prediction accuracy without suitable held-out longitudinal data. Recruiting 5–10 beta testers can validate usability; it cannot establish population-level predictive accuracy.

### Model overview — see the separately approved V0.1 specification

Simulate Math and Reading & Writing separately in weekly steps, with a fractional final week. Let `s_j` be section score, `h_j` the weekly hours allocated to that section, and `c` consistency from 0 to 1. A candidate effective-practice function is:

```text
e_j = c × H_j × (1 − exp(−h_j / H_j))
s_j,next = 800 − (800 − s_j) × exp(−k_j × e_j × Δt)
total = math + readingWriting
```

`H_j > 0` controls diminishing returns from added hours; `k_j ≥ 0` controls modeled improvement per effective hour; `Δt` is weeks. The approved V0.1 uses H=4 and rates 0.006/0.012/0.018. The official SAT section ceiling of 800 has been verified. See docs/MODEL_SPECIFICATION.md for the complete approved policy and experimental limitations.

In plain language: more effective practice uses some of the remaining room below the section ceiling. Each additional hour has less modeled benefit, and progress slows near the ceiling. Zero hours or zero consistency produces no practice-driven growth; a score already at the ceiling stays there. These properties are mathematical design choices, not evidence that students follow this curve. Real performance can decline or fluctuate; a monotone central trajectory must disclose that limitation.

Allocate hours between sections without counting the same hour twice. A default split needs approval in the input/model specification. Study mix, prep history, and practice-test frequency require documented treatment; do not assign arbitrary tutoring or method multipliers. Full-length test hours and mistake-review hours are part of the total time budget. If an input cannot be justified or meaningfully used, resolve its role at the input gate rather than silently asking for it.

For PSAT inputs, first verify official cross-assessment score interpretation. Do not linearly stretch PSAT maxima to SAT maxima or promise an equivalent future SAT score. Distinguish PSAT/NMSQT and PSAT 10, including the assessment type behind a practice score. Propose a documented shared-scale baseline only if authoritative guidance supports it; explain the lower assessment ceiling and limits of comparability. Do not invent progress between an old baseline date and today. Establish baseline-age guidance and a warning policy in Week 2.

Initially, consider slower/central/faster parameter cases as an **illustrative assumption range**. It is not a confidence interval, percentile, or calibrated probability of test-day performance. Decide in Week 5 whether showing such a band helps students or misleads them. Preserve the observed baseline anchor; distinguish measurement uncertainty from uncertainty about growth. Monte Carlo simulation belongs to V2 unless the owner changes scope.

Retain numeric precision internally. Agree on display rounding, apply it consistently to section scores, and derive displayed totals from displayed sections. Do not imply scores are known to individual points. Validate date-only inputs without timezone-induced day shifts; include exact short and partial-week horizons.

## Milestones and acceptance gates

The original dates remain targets, not claims of completed work or guaranteed delivery. If research or approvals delay progress, report the impact before revising the schedule.

| Week / dates | Deliverable | Acceptance gate |
| --- | --- | --- |
| 1 · Oct 13–19, 2026 | Product specification and official SAT research | Scope, audience, scoring facts, disclaimers, and future ideas documented; source verification complete |
| 2 · Oct 20–26 | Input specification and guided user flow | Assessment-specific validation, baseline age, PSAT policy, required/optional fields agreed |
| 3 · Oct 27–Nov 2 | SAT growth research notes | Findings and assumptions separated; unsupported relationships identified |
| 4 · Nov 3–9 | Written model V0.1 | Equations, units, coefficients, section allocation, and limitations approved before engine coding |
| 5 · Nov 10–16 | Simulation rules V0.1 | Range wording, rounding, goals, and scenario semantics approved |
| 6 · Nov 17–23 | Input engine | Invalid/missing scores, dates, hours, consistency, and optional data tested |
| 7 · Nov 24–30 | Simulation engine V0.1 | Independent section results, exact horizons, total consistency, and limits tested |
| 8 · Dec 1–7 | Model V0.2 and stress-test report | Zero effort, short/long horizons, ceiling profiles, unequal sections, and sensitivity checked |
| 9 · Dec 8–14 | Design system and wireframes | Aero visual direction, readability, mobile flow, and accessible controls reviewed |
| 10 · Dec 15–21 | Frontend foundation | Guided flow, error recovery, mobile layout, and keyboard interaction verified |
| 11 · Dec 22–28 | Results dashboard | Charts match engine data; section totals, ranges, assumptions, and textual alternatives work |
| 12 · Dec 29–Jan 4, 2027 | Motion system | Purposeful transitions, reduced motion, and performance checked |
| 13 · Jan 5–11 | Scenario comparison | Changes are explicit; same-input scenarios match; custom edits and reset tested |
| 14 · Jan 12–18 | How Laplora Works | Source/assumption distinctions, limitations, independence, and privacy match actual behavior |
| 15 · Jan 19–25 | Private beta report | Owner recruits 5–10 students; comprehension and usability observations recorded with appropriate consent |
| 16 · Jan 26–Feb 1 | Release candidate | Regression, accessibility, mobile, performance, feedback privacy, and release documentation reviewed |
| Feb 2, 2027 | Public beta target | Owner approves release and deployment; known limitations visible |

## Visual direction and testing

Use a bright atmospheric background, aqua/sky-blue palette, restrained green accents, readable dark text, rounded panels, and limited glass depth. Design tokens unify all components. Approve wireframes before visual implementation. Transparency must retain contrast; focus rings, labels, chart summaries, and a data-table alternative must remain usable.

Test model invariants and independent expected behaviors: valid limits, finite outputs, baseline preservation, section-total agreement, consistent scenario rules, zero-effort behavior, diminishing gains, and ceiling behavior. Reject invalid enums, nonfinite numbers, incompatible score scales, impossible dates, and unreasonable time budgets. Verify form errors, browser back/reset behavior, responsive layouts, keyboard operation, and reduced motion. Report test counts and actual outcomes; never mark an unavailable browser check as passed.

## Git, documentation, and owner learning

Use the existing isolated `/workspace/laplora` checkout; no extra worktree is needed. Preserve the supplied plan. After the approval gate, create README, contributor guidance, and reproducible package scripts. Use meaningful local commits at completed milestones and feature branches when scope warrants them; use PRs for substantial reviewable changes. Do not force-push, rewrite history, or push without authorization. Never manufacture authorship or dates.

Maintain PROGRESS.md after each session with completed work, lessons, sources, decisions, failures, actual tests, commits, and the next task. Keep model and product decision records in docs. Explain each milestone in student-friendly terms, invite founder review, and identify small learning exercises once the implementation/learning workflow is agreed.

## Current checkpoint

Architecture, workflow, V0.1, typography, and wireframe approvals are recorded. The input and score engines are structurally verified, including a 2,160-profile stress grid. The guided React interface now connects to the engine with responsive results, interactive native SVG charts, preparation comparisons, motion controls, and How It Works. No additional chart or animation dependency was needed for these bounded curves and CSS transitions. See PROGRESS.md for verification and remaining beta/launch work.
