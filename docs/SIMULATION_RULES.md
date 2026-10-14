# Laplora simulation rules V0.1

Week 5 written deliverable · V0.1 choices approved by the founder October 14, 2026. Pure engine and scenario helpers implemented; guided interface remains future work.

References: [input specification](INPUT_SPECIFICATION.md), [written model](MODEL_SPECIFICATION.md), and [research limits](GROWTH_RESEARCH.md).

## Timeline and result contract

The simulation starts at the injected current date, with the explicitly disclosed hypothetical use of the observed baseline. Include the initial point, weekly dates, and the exact exam endpoint. For a target 84 days away there are 13 points including day zero; for tomorrow there are two. Do not duplicate the final point when it is already a weekly date. All scenario series use identical dates.

An eventual engine returns a versioned outcome:

- `invalid-input`: structured field errors; no numerical result.
- `needs-sat-baseline`: valid observed PSAT inputs outside the proposed SAT-model domain; preserved observation and clear explanation, no fabricated trajectory.
- `simulated`: observed baseline metadata, simulation start/target dates, input snapshot, parameter version, warnings, and date-indexed raw section/total trajectories for each sensitivity case.

Keep these results in browser memory. Model functions depend on explicit inputs, dates, and parameters; no implicit clock, browser storage, network calls, or React state.

## Display rounding and consistency

Use raw floating-point values internally. At display time, round each section to the nearest ten, with positive half-way ties rounding upward, then sum the displayed sections. Apply the same rule to the central line and both sensitivity cases. Never round the total independently; it can otherwise disagree with visible sections.

Displayed gains use displayed endpoint minus displayed starting total. Small positive raw gains can display as zero. Explain rounding when relevant. A displayed endpoint can round to 800 near the limit; this is not a guarantee of a perfect section. Valid source scores are already multiples of ten.

## Scenario semantics

**Current Plan:** exactly the validated original study inputs, with the shared observed baseline and model version.

**Increased Practice:** double total weekly hours, capped at the proposed 40-hour limit. Preserve consistency, allocation, methods, history, and frequency. Show the exact hours change. At 40 hours, disable the preset with a clear explanation that it cannot increase within the accepted range. This is a hypothetical comparison, not a recommendation to study 40 hours.

**Custom Scenario:** let the student edit the study-plan fields and the approved advanced allocation control. Preserve baseline, start date, target score/date, and experimental parameters. Label every changed field. If only descriptive fields change, explicitly state that V0.1 does not quantify their effects and the curve is unchanged.

A custom “More Consistent” scenario may use the same hours with a higher declared completion percentage; it must show the selected values instead of silently assigning an improvement. Changing both hours and consistency is valid but must identify both changes.

Reset removes comparison edits and restores the original Current Plan. Editing the baseline or goal requires returning to setup and regenerating all scenarios together. Recompute eligibility and warnings rather than reusing stale results.

## Range and target language

Preferred labels:

- “Central modeled trajectory”
- “Illustrative assumption range”
- “Slower / central / faster learning-rate assumption”
- “Under these assumptions…”

Near the range, show: “This range varies an experimental learning-rate assumption. It does not cover all possible test-day results. Your actual score may be higher or lower.”

Do not use “95% confidence,” “most likely score,” target probabilities, points-per-hour promises, or a numerical “prediction accuracy.” Do not relabel College Board's measurement range as Laplora's future-growth range.

Compare the displayed central endpoint with the target without awarding likelihood. Use “The central model is below your target under these assumptions,” not “Your target is impossible.” Even a target inside or below the range is not guaranteed. The target never changes the simulated curve.

## Model and interface acceptance matrix for later implementation

| Area | Required checks |
| --- | --- |
| Input validity | Correct test enums/scales/increments; blanks; nonfinite numbers; invalid or future dates; past exam; study-hour cap; consistency bounds |
| PSAT | Shared-scale values preserved; 160–190 accepted as observations but require the approved outcome; ceiling warning; no rescaling or clamping |
| Timeline | Tomorrow, exact weekly endpoint, partial final week, 728-day horizon, leap day, daylight-saving transitions, and date injection |
| Mathematical invariants | Exact baseline at zero time; zero effort/rate; finite values; valid section/total limits; 800 ceiling; section-total identity |
| Allocation | 0%, 50%, 100%; no duplicated hours; unallocated section flat; unequal starting sections |
| Diminishing returns | Smaller marginal raw gain from additional equal hour increments; declining time slope for positive effort; lower remaining room produces less point gain |
| Sensitivity | Slower ≤ central ≤ faster at every point; all cases share the baseline; zero-effort cases identical; no probability claims |
| Rounding | Half-way ties, near-ceiling display, tiny horizons, totals derived from rounded sections, and tie/zero differences |
| Comparisons | Identical inputs identical; goal-independent curves; clear changed fields; increased-hours cap; custom edits; reset; descriptive-only changes disclosed |
| UX | Error recovery, preserved form state, keyboard flow, text/table chart alternative, mobile fit, reduced motion, meaningful loading state, and understandable caveats |

Test independent expectations and properties rather than copying the formula into tests. Include closed-form reference cases, numerical boundary examples, and independently reviewed expected totals. Stress-test profiles from Week 8 remain required before an engine readiness claim.

## Current verification status

The implementation matches independently documented worked examples and passes input/model/scenario tests, including a 2,160-profile stress grid. See MODEL_TEST_REPORT.md for scope and actual counts. No calibration, prediction-accuracy evaluation, or student usability study has been performed.
