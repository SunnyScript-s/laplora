# Model implementation and stress-test report

October 14, 2026 · Approved model version `0.1.0-experimental`.

## What was verified

The local command `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify` completed successfully:

- TypeScript checking passed.
- 123 unit tests passed across input, model, and scenario suites; no failures or skips.
- Production build passed.
- 2 existing foundation browser runs passed: desktop and mobile Chromium viewports.

The browser tests exercise the existing development page. They do not exercise a student simulation form or results dashboard; those interfaces are not implemented yet. GitHub Actions has not run remotely.

## Input engine

Verified assessment-specific limits and ten-point score increments, target bounds, missing values, malformed objects, unknown fields/enums, nonfinite values, study-time/consistency/allocation limits, duplicate or ambiguous methods, old-score and scheduling warnings, and deliberate decimal parsing.

Calendar tests include leap years, invalid date normalization, same-day/past/future relationships, an exact 728-day horizon, daylight-saving boundaries, early calendar years, and a supplied local date differing from UTC. Zero effort and lower goals remain valid inputs.

## Pure model and scenarios

Verified the independently documented raw/rounded examples, baseline preservation, separate section allocation, zero effort/rate, ceilings, total/section consistency, deterministic results without input mutation, exact weekly/fractional endpoints, goal independence, and slower ≤ central ≤ faster.

Scenario tests cover increased-hours doubling/capping, the 40-hour disabled preset, supported custom changes, preservation of baseline/goal/date/model, revalidation, reset via an empty patch, method-order equivalence, descriptive-only disclosures, and forbidden baseline/date/parameter edits.

The approved PSAT policy accepts and preserves observed 160–190 section scores, returns `needs-sat-baseline`, and generates no SAT curve for them. Eligible PSAT anchors are not rescaled; a 760 observation remains 760 at the modeled start and carries a ceiling warning.

## Stress grid

One unit test evaluates **2,160 valid profiles**:

- 10 section-score pairs, including 400 minimum total, 900, 1200, 1400, 1500, imbalanced sections, a 760 PSAT-like anchor, and 1600.
- 6 weekly-hour choices: 0, 0.25, 3, 6, 20, 40.
- 3 consistency values: 0%, 70%, 100%.
- 3 Math allocations: 0%, 50%, 100%.
- 4 horizons: 1, 8, 84, 728 days.

Each profile is checked across all three sensitivity cases and every sampled point for finite totals, valid scores, section-total identity, monotone practice-driven growth, and ordered sensitivity cases. The 2,160 profiles are cases inside one test, not 2,160 separately counted tests.

Separate tests check diminishing hour returns and declining time slopes, rather than relying only on scores remaining bounded.

## Review corrections

- Added exact degenerate-case returns in the low-level math utility so zero time and a perfect section cannot produce NaN with unusually large finite utility rates. Student-facing simulation still uses only the approved fixed coefficients.
- Rejected non-record scenario patches such as Date and Map rather than silently treating them as empty edits.
- Made warning wording precise: more than 365 days, and at least half of the estimated preparation budget.

No approved coefficient or equation was changed. A parameter revision to V0.2 is not warranted solely because structural tests pass; retain the approved V0.1 model pending evidence or an approved revision. This is the Week 8 stress-test deliverable, with the parameter-version difference recorded explicitly rather than inventing a calibration improvement.

## Limits

These checks establish that the implementation follows the approved rules for tested cases. They do not establish scientific validity, realistic individual growth, range coverage, causal preparation effects, or prediction accuracy. The long-horizon synthetic result approaching 1560 from 1200 remains an acknowledged extrapolation limitation, not a validated finding.

Future interface tests, accessibility review, cross-browser checks, and private beta observations remain required. Real student outcomes and research-supported calibration are separate work with consent/privacy considerations.
