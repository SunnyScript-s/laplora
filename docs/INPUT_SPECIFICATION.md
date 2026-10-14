# Laplora input specification V0.1

Week 2 written deliverable · October 14, 2026 · Proposed policies, awaiting model/input approval.

References: [product specification](PRODUCT_SPECIFICATION.md), [scoring research](SAT_RESEARCH.md), [growth research](GROWTH_RESEARCH.md), [user flow](USER_FLOW.md), and [model proposal](MODEL_SPECIFICATION.md).

## Input purpose and validation

Official score limits/increments are facts. Study limits, age warnings, timeline caps, and modeling eligibility below are proposed product policies, not scientific thresholds.

| Field | Required | Proposed representation and validation | Role |
| --- | --- | --- | --- |
| Baseline source | Yes | `official` or `official-practice`; reject missing/unknown values | Distinguish an official administration from scored full-length practice |
| Baseline assessment | Yes | `sat`, `psat-nmsqt`, or `psat-10`; practice must identify its underlying assessment | Choose the correct input scale; preserve this label in results |
| Baseline date | Yes | Real date-only `YYYY-MM-DD`, on or before the injected current date | Show the age of the observation; do not infer intervening improvement |
| Math score | Yes | Integer multiple of 10; SAT 200–800, PSAT/NMSQT or PSAT 10 160–760 | Observed Math anchor |
| Reading & Writing score | Yes | Same assessment-specific rules as Math | Observed Reading & Writing anchor |
| Baseline total | Derived | Sum of the validated sections; not a third editable score | Prevent conflicting totals |
| Target SAT score | Yes | Integer multiple of 10 in 400–1600 | Goal marker; must not change the growth calculation |
| Target date | Yes | Real date after the current date and no more than 728 days away | Exact simulation horizon; up to 104 weeks |
| Weekly study hours | Yes | Finite number in 0–40, in quarter-hour increments | Total weekly budget for all preparation activities |
| Expected consistency | Yes | Integer percentage in 0–100; normalize to 0–1 | Fraction of the intended plan followed on average |
| Prep history | Yes | `just-starting`, `some-preparation`, or `consistent-preparation` | Context in the explanation; no unvalidated numerical multiplier |
| Study methods | Yes | Nonempty unique selection from `targeted-practice`, `full-length-tests`, `mistake-review`, `tutoring-class`; allow `unsure` alone | Context and practice guidance; not an automatic score bonus |
| Full-length practice frequency | Yes | `none`, `every-four-weeks`, `every-two-weeks`, or `weekly` | Budget/consistency guidance; no additive points-per-test bonus |

The 40-hour cap bounds an unusually intensive hypothetical schedule; it is not a recommended workload. The 728-day cap limits extrapolation and graph size; it is not a validated research horizon. Both require founder approval.

Reject blank required values rather than turning them into zero. Reject NaN, infinity, booleans, arrays, unknown enums, and invalid date strings at the domain boundary. The form should parse strict decimal numeric text; do not accept a scientific-notation string as a student's score. Missing optional values remain absent rather than becoming invented defaults.

Allow a target below or equal to the baseline; explain that the entered goal is already at or below the observed total. Never force growth toward the target. Zero hours or zero consistency is valid: the proposed practice-driven central trajectory stays flat, with an explicit reminder that actual test performance can vary.

## PSAT baseline policy — approval required

Official Fall 2026 score guides and the technical manual confirm that the SAT Suite uses a common vertical score scale. A PSAT section score of 500 is therefore a shared-scale observation; do not multiply it by 800/760. This says nothing about future growth or differences caused by the date of testing.

Proposed V0.1 handling:

1. Accept and preserve all valid PSAT/NMSQT and PSAT 10 inputs, including section scores 160–190.
2. For both sections at least 200, use the reported section values as shared-scale anchors. Clearly identify the observation as PSAT and explain that no same-day SAT was observed.
3. If either section is below 200, return an explanatory `needs-sat-baseline` outcome instead of generating an SAT trajectory. Recommend a scored official full-length SAT practice result. Do not silently clamp 160 to 200, rescale it, or display an invalid SAT section score.
4. If either PSAT section is 760, warn that the assessment ceiling may limit what the score reveals; do not add 40 free points or claim the student is exactly 40 points below their potential.

Step 3 limits simulation coverage for a subset of otherwise valid PSAT baselines. It is an explicit founder decision, not an already approved requirement. The alternative is to design and approve a separate below-floor shared-scale representation, without calling sub-200 values SAT scores. That would require additional modeling and chart rules.

## Dates and old baselines

Use the browser's local calendar date when collecting inputs, then inject that explicit date into validation/model functions. Store date-only values; compute elapsed calendar days without daylight-saving or UTC-parsing shifts. Verify calendar validity by components instead of allowing invalid dates to normalize into another month. Tests must cover leap days and daylight-saving boundaries.

The proposed simulation starts today. It uses the observed baseline as the hypothetical starting level today and labels that assumption. It does not draw an invented line from the historical test date to today. All scenarios use the same start date and observed baseline.

Proposed age warnings:

- At more than 90 days old: “This score may not reflect your current performance. We are using it as the starting point today and have not estimated improvement since that test.”
- At more than 365 days old: make that warning prominent and recommend a newer official full-length result.

Do not hard-reject a historical baseline only because of age. These warning thresholds are usability policies, not calibrated limits. Future baseline dates are invalid. A target tomorrow is valid and creates a fractional-week horizon. Targets today or in the past are invalid.

## Study plan and missing evidence

Weekly hours include tests, targeted work, mistake review, and tutoring. Do not count full-length tests as extra hours or award their observational study associations as independent score bonuses.

The ordinary flow uses an explicit 50/50 section-hour allocation. Show this assumption. An optional Math-share control in advanced study settings can range from 0% to 100%; Reading & Writing receives the remainder. Do not silently assign more hours to the weaker section or infer a skill profile from total scores. This optional allocation control is part of the proposed model and needs approval.

Warn for schedules above 20 hours/week and horizons above 26 weeks; invite the student to check realism, without presenting either threshold as a medical or statistical boundary.

For budget guidance only, approximate a full test plus its standard break as 2.4 hours. Practice tests can finish sooner or be paused, and accommodations can change timing; this is a planning estimate, not an exact duration rule. If the chosen frequency appears to consume most of the weekly budget, explain that it leaves less time for review. Warn rather than blocking on this approximation.

Prep history and study methods are required by the supplied plan, but reviewed evidence does not establish defensible personalized coefficients for them. Propose using them in transparent context/guidance in V0.1. Method-only changes then produce the same numerical curve, with an explanation that the model does not quantify the difference. Do not pretend all methods are equally effective in reality. If the founder wants those fields to change numerical results, specify and approve experimental weights first.

## Optional advanced inputs

Preserve the roadmap distinction: earlier scores, domain indicators, mistake-review details, and planned breaks are optional future capabilities, not hidden requirements for the initial flow. The only advanced control proposed for the first engine is section-hour allocation. Unsupported inputs must not be accepted and silently influence calculations.

## Validation acceptance examples

| Example | Expected behavior |
| --- | --- |
| SAT Math 200 / RW 800 | Valid observation; total 1000 |
| SAT Math 190 | Invalid SAT score |
| PSAT Math 160 / RW 760 | Valid observation; proposed `needs-sat-baseline` outcome |
| PSAT Math 770 | Invalid PSAT score |
| Section 605, missing score, Infinity, or unknown test | Reject with field-specific error |
| Future baseline date or impossible February 30 | Reject |
| Exam tomorrow | Valid partial week |
| Exam today, past exam, or more than 728 days away | Reject under proposed policy |
| 0 hours, 0% consistency, or a lower target | Valid; explain the resulting context |
| 40 hours/week | Valid but warn; 40.25 is outside the proposed cap |
| Mixed `unsure` plus another method | Reject ambiguous selection |

No input validation engine is implemented by this document. Week 6 implementation follows approval of the input and model specifications.
