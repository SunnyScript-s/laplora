# Laplora SAT V1 product specification

Week 1 deliverable · October 14, 2026

References: [original development plan](../DEVELOPMENT_PLAN.md), [approved architecture](../ARCHITECTURE_PROPOSAL.md), and [official scoring research](SAT_RESEARCH.md).

## Problem statement

High-school students preparing for the SAT can see their current performance in a score report, but a report does not let them explore how different preparation plans might change possible future progress. Laplora will use an existing official test or full-length practice result as a baseline, then simulate separate Math and Reading & Writing trajectories under documented, experimental assumptions. Students can compare preparation scenarios, understand diminishing returns and remaining room for improvement, and see the limitations of the model without being promised a particular score.

## Target user and purpose

The primary user is a high-school student with a recent SAT, PSAT/NMSQT, PSAT 10, or official full-length practice result who is preparing for an SAT. The experience should also be understandable to parents, teachers, and counselors.

Laplora is educational, mathematical, experimental, and independent. It is not a College Board product, validated individual score predictor, tutoring replacement, admissions predictor, or guarantee of improvement. A private beta tests usability and comprehension; it does not establish prediction accuracy.

## What a student should learn

Laplora should help a student understand how changing study time, consistency, and an agreed preparation strategy changes a simulated trajectory under the same assumptions. The student should be able to identify which inputs changed, compare the sections, and explain why the displayed outcome is uncertain. Their target is a reference point; choosing a higher target must not automatically produce higher modeled growth.

## V1 scope

### Accepted baselines

- Official SAT scores, including the two section scores from SAT School Day where applicable. Essay scores are excluded.
- Official PSAT/NMSQT scores.
- Official PSAT 10 scores.
- Scored official full-length practice results, identified by the underlying assessment: SAT, PSAT/NMSQT, or PSAT 10.

An unscored Bluebook test preview, original Laplora quiz, PSAT 8/9 result, or an unidentified third-party diagnostic is outside V1 scope. This follows the baseline list in the development plan. The interface must clarify the underlying assessment rather than treating all practice tests as SAT-scale scores.

### Planned required inputs

| Input | Purpose |
| --- | --- |
| Baseline type, assessment, and date | Interpret the scale and age of the observation |
| Math and Reading & Writing scores | Anchor separate section trajectories; derive the total |
| Target SAT score and test date | Compare the modeled outcome with a goal over an explicit timeline |
| Weekly study hours and expected consistency | Describe planned effort and how reliably it is followed |
| Preparation history | Describe experience; its numerical role must be justified in the model specification |
| Study mix | Describe targeted practice, tests, mistake review, tutoring/class, or a mixture |
| Full-length practice-test frequency | Describe preparation structure without counting test time twice |

All planned fields come from the supplied requirements. Week 2 evaluates answerability, validation, and model relevance. Collecting a field does not establish that a scientific coefficient exists for it. If a field cannot be used responsibly, raise that issue with the founder before changing scope.

### Optional advanced inputs

Domain performance, earlier score/date observations, regular mistake-review behavior, and planned breaks are optional possibilities in the plan. The initial guided flow must work without them. Domain-aware prediction, historical tracking, or persistence must not enter V1 silently.

### Planned outputs

- Score-over-time trajectories for Math, Reading & Writing, and the combined total.
- Interactive graphs with readable text/table alternatives.
- Current Plan, Increased Practice, and Custom Scenario comparison, with explicit changed inputs; exact behavior is specified in Week 5.
- Goal and exam-date context without guarantees.
- Visible mathematical assumptions, model version, limitations, score boundaries, and diminishing-return behavior.
- An uncertainty representation only after its interpretation and wording are approved. An illustrative assumption range is not a confidence interval.

## Experience and design

Guided flow: choose baseline → enter section scores → set goal and date → describe study plan → run simulation → explore results → compare scenarios → read how it works.

Use a bright sky/aqua palette, restrained green accents, rounded glass-inspired panels, readable typography, and consistent spacing. Contrast and focus visibility take priority over transparency. Motion should communicate changes and respect reduced-motion settings. Detailed visual design belongs to Week 9.

Later owner direction, October 14, 2026: replace the aqua/green palette with a vibrant orange DORfic-inspired treatment and spinning background motion. The latest request explicitly supersedes the color direction above; approved flow, fonts, model, readable contrast, and motion controls remain required. See DESIGN_SYSTEM.md for the implemented palette.

## Privacy and credibility

- Run V1 calculations in the browser; keep scores in memory by default.
- Do not request names, school, income, GPA, intelligence ratings, or college lists.
- Do not send student inputs through analytics, URLs, or a server.
- Do not add accounts, a database, or paid APIs without an approved need.
- Feedback collection at launch requires a separate storage/privacy decision.
- Place experimental-model wording near results and explain independence from College Board.
- Avoid likelihood claims, calibrated percentages, or points-per-hour promises without appropriate evidence.

## Acceptance criteria for the eventual V1

Valid assessments and inputs produce internally consistent, bounded, finite results. Invalid or missing inputs receive understandable errors. Timelines include the exact target date; dates do not shift with timezone handling. Scenario comparisons use the same model version and identify changes. The interface works on phones and with a keyboard, offers chart alternatives, respects reduced motion, and explains assumptions where decisions are made.

Tests will include score boundaries, nonfinite values, missing data, past dates, short/long horizons, unrealistic schedules, zero effort, section imbalance, ceilings, diminishing returns, and scenario consistency. These are planned requirements; none of these application capabilities is implemented by this specification.

## Week 1 completion and Week 2 decisions

Week 1 product-definition tasks are covered by this specification, SAT_RESEARCH.md, and FUTURE_IDEAS.md. The founder-approved architecture and mentoring workflow are recorded separately.

Week 2 must specify score increments, cross-assessment baseline handling, baseline-age guidance, date/horizon limits, study-hour validation, consistency definitions, study-time allocation, required versus optional fields, and accessible form order. Mathematical policies remain open; no final conversion or growth coefficients are approved.
