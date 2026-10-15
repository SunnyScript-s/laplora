# Laplora SAT model V0.1 — approved experimental specification

Week 4 deliverable · **V0.1 choices approved by the founder on October 14, 2026.** Implementation: src/model; verification: MODEL_TEST_REPORT.md.

This document specifies the approved educational mathematical model, not a scientifically validated individual prediction model. The engine implements these experimental coefficients. The founder approved them separately from the React/TypeScript architecture.

References: [input rules](INPUT_SPECIFICATION.md), [reviewed evidence](GROWTH_RESEARCH.md), [scenario and presentation rules](SIMULATION_RULES.md).

## Intended question

How does changing a preparation plan change a hypothetical score trajectory when we hold the starting observation and model assumptions fixed?

The model does not estimate a student's true latent ability, establish their potential score, predict a probability of meeting a target, or attribute causal points to a preparation method.

## Boundary and baseline handling

Validate and label the observed assessment first. For SAT and accepted shared-scale PSAT observations with both sections at least 200, use the reported section values as the hypothetical starting scores. Preserve the original assessment/date in result metadata. Do not scale PSAT by its maximum or infer past growth between its date and today.

Approved below-floor policy: preserve a valid PSAT observation with a section below 200, but return `needs-sat-baseline` rather than generating an SAT score curve. Do not silently replace its observed value with 200. Explain the lower PSAT floor and offer entry of an official full-length SAT practice result.

At a PSAT section ceiling of 760, disclose the restricted assessment ceiling; do not grant a numerical uplift. The common-scale interpretation is supported by official documentation; the hypothetical starting point today and all future growth remain assumptions.

## Effective practice

For section `j` (Math or Reading & Writing), define:

```text
h_j = h_total × a_j
e_j = c × H_j × (1 − exp(−h_j / H_j))
```

- `h_total`: planned hours/week, including tests and review.
- `a_j`: section allocation; nonnegative, with Math plus RW equal to 1.
- `c`: intended consistency divided by 100, between 0 and 1.
- `H_j`: experimental saturation scale in hours/week.
- `e_j`: effective hours/week under the model's assumptions.

Default allocation is 50/50, visibly disclosed. An approved advanced control can change it; the model must not infer an allocation from the weaker score. Consistency applies after weekly-hour saturation: this assumes that following an overly concentrated weekly plan less reliably is different from a smaller reliable plan. It is a simplifying average, not a simulation of attendance or weekly randomness.

For small hours, effective practice is close to consistency times the assigned hours. As assigned hours increase, added hours contribute less. `H_j` is a mathematical scale, not a recommendation that students study that many hours, and the curve is not derived from an observed hours-to-score relationship.

## Section growth equation

Let `s_j(t)` be the modeled section score after `t` weeks, and `s_j(0)` its hypothetical starting score:

```text
s_j(t) = 800 − (800 − s_j(0)) × exp(−k_j × e_j × t)

Equivalent weekly update:
s_j,next = 800 − (800 − s_j,current) × exp(−k_j × e_j × Δt)

total(t) = math(t) + readingWriting(t)
```

`k_j` has units of inverse effective hours. The exponent is dimensionless because effective hours/week times weeks is effective hours. `Δt` can be a fraction of a week. In plain language, effective preparation uses up some of the remaining room below 800; the same effective effort produces a smaller point change near the ceiling.

Use the closed form for constant plans so results do not depend on how graph points are sampled. Evaluate weekly dates and the exact final date, using elapsed calendar days divided by seven. Do not round intermediate values. Stable exponential calculations can avoid loss of precision for tiny horizons when the engine is implemented.

## Approved parameter set — entirely experimental

| Parameter | Math | Reading & Writing | Reason and status |
| --- | --- | --- | --- |
| Score ceiling | 800 | 800 | Official SAT scale limit; not a personal potential estimate |
| Saturation scale `H_j` | 4 hours/week | 4 hours/week | Explicit experimental weekly diminishing-return choice |
| Central `k_j` | 0.012/effective hour | 0.012/effective hour | Chosen for inspectable synthetic examples; not fitted to research or user outcomes |
| Slower sensitivity `k_j` | 0.006/effective hour | 0.006/effective hour | Half the central assumption; no probability meaning |
| Faster sensitivity `k_j` | 0.018/effective hour | 0.018/effective hour | 1.5 times the central assumption; no probability meaning |
| Default allocation | 50% | 50% | Simple disclosed default, not an optimal study prescription |

Use the same coefficients in both sections initially because reviewed evidence does not justify claiming a calibrated difference. Different section baselines and allocated hours still generate different trajectories. Allow section-specific parameters in the eventual engine contract for future approved revisions, but do not expose arbitrary coefficients as a normal student form requirement.

The synthetic examples below were inspected to make the proposal understandable. They are not training data, validation results, or evidence that these numerical choices are correct. An owner may choose different parameters after reviewing the consequences; approval accepts them as experimental model assumptions, not as scientific findings.

## Descriptive fields and preparation experience

Required prep history, methods, and practice-test frequency remain in the input/result context and support transparent guidance. They do not receive separate numerical boosts in V0.1. Weekly hours include every activity, preventing test time from being counted twice.

This approved choice avoids interpreting observational study associations as causal score bonuses, ranking tutoring against self-study without evidence, or double-counting prior preparation already reflected in the baseline. It also means that changing only a method/history/frequency field leaves the curve unchanged. Explain that limitation explicitly; do not imply that methods are equally effective in reality.

The target score is a reference marker only. It never enters `e_j` or `k_j`. The model has no passive growth term, forgetting term, test-day variability, school-instruction adjustment, or demographic coefficient. Absence of a term is a limitation, not a claim that the real-world factor does not matter.

## Structural mathematical properties

For an eligible starting score in 200–800, nonnegative time/rate/hours, valid allocation, and consistency in 0–1:

- At `t = 0`, the curve equals its starting score.
- At zero hours, zero consistency, or zero rate, practice-driven growth is zero.
- Scores remain between the starting value and 800; total equals the section sum and stays in 400–1600.
- The raw curve is nondecreasing over time. Its slope decreases as remaining room shrinks.
- Additional assigned hours increase effective practice with diminishing marginal contribution.
- A section already at 800 stays there; a section with zero allocation stays flat.
- Changing only the goal leaves the trajectories identical.
- Identical inputs and parameters produce identical results independently of React or network state.

These follow from the formula, not from empirical performance data. A monotone curve is not a lower bound on a future test result. Real scores can decrease.

## Worked examples

Hypothetical SAT baseline: Math 600 + RW 600 = 1200. Equal section allocation, 12 weeks from October 14, 2026 to January 6, 2027. Display each section to the nearest ten, then add them.

| Plan | Total hours/week | Consistency | Raw central Math / RW | Displayed central total | Slower–faster sensitivity totals |
| --- | --- | --- | --- | --- | --- |
| Current | 3 | 70% | 623.692 / 623.692 | 1240 | 1220–1260 |
| Increased Practice | 6 | 70% | 638.327 / 638.327 | 1280 | 1240–1300 |
| Custom: more consistent | 3 | 90% | 629.930 / 629.930 | 1260 | 1240–1280 |
| Custom: both changes | 6 | 85% | 645.532 / 645.532 | 1300 | 1240–1320 |

The apparent improvements are outputs of our chosen assumptions, not forecasts or study recommendations. The illustrative bands do not describe the distribution of actual test results.

Additional arithmetic checks using 6 total hours/week, 80% consistency, and equal allocation:

| Starting sections | Horizon | Raw central endpoint per section | Displayed total | Interpretation |
| --- | --- | --- | --- | --- |
| 450 / 450 | 12 weeks | 525.542 | 1060 | More remaining room produces larger modeled point gains |
| 600 / 600 | 12 weeks | 643.167 | 1280 | Moderate synthetic case |
| 750 / 750 | 12 weeks | 760.792 | 1520 | Ceiling limits modeled gains |
| 600 / 600 | 1 day | 600.578 | 1200 | Internal growth may be hidden by honest display rounding |
| 600 / 600 | 104 weeks | 775.683 | 1560 | Long extrapolation exposes a major limitation; no calibration supports this outcome |
| 800 / 800 | 12 weeks | 800 | 1600 | A score ceiling remains a ceiling |

The 104-week outcome shows why bounded arithmetic is not enough to establish realism. A fixed rate sustained that long can overstate attainable progress. The proposed interface warns about long horizons; no wording can turn that trajectory into a validated forecast.

## Uncertainty and limitations

The slower/central/faster cases vary only the experimental learning-rate assumption. They share the observed baseline, hours, consistency, allocation, and horizon. The range is a sensitivity visualization, not a confidence interval, percentile, probability, or comprehensive envelope for future scores. Actual results may lie outside it, including below the baseline.

This V0.1 cannot quantify baseline measurement error, current proficiency after an old score, individual learning differences, test-day conditions, or changes in engagement over time. A PSAT ceiling can hide higher proficiency. The curve does not prove that more hours always help in reality or that improvement continues at a stable rate for years.

## Approval and implementation record

The founder approved this parameterized model, illustrative range, descriptive treatment of history/methods/frequency, section allocation, and PSAT edge-case policy in INPUT_SPECIFICATION.md. The input and pure simulation engines are implemented with the acceptance matrix in SIMULATION_RULES.md. Future substantive equation/parameter changes still require approval. Tests establish implementation behavior, not empirical accuracy.

## Learning exercise

Starting at 600 leaves 200 points below the section ceiling; starting at 750 leaves 50. If the same preparation uses 10% of the remaining room, the model adds 20 points in the first case and 5 in the second. Explain why this is a coherent equation yet does not prove actual students improve that way.
