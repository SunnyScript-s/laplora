# SAT growth research — focused V0.1 review

Week 3 written deliverable · October 14, 2026. This is a focused evidence review for a proposed educational model, not an exhaustive literature review or calibration study.

## Reviewed sources and scope

| ID | Source | Sections reviewed |
| --- | --- | --- |
| G1 | [Chang, Akbayin-Sahin & Howell, May 2025: Examining the Relationship Between Digital SAT Practice in Bluebook and SAT Performance](https://research.collegeboard.org/media/pdf/DigitalSATPracticeTests_052025.pdf) | Executive summary, methods, results, discussion, and regression appendix of the 16-page report |
| G2 | [Zhao, Zhang & Proctor, March 2026: Student-Level Growth Estimates for the SAT Suite](https://research.collegeboard.org/media/pdf/2026-sat-suite-student-growth-estimates.pdf) | Executive summary, methods, discussion, appropriate uses, and limitations; no table incorporated into Laplora |
| G3 | [Digital SAT Suite Technical Manual](https://research.collegeboard.org/media/pdf/Digital%20SAT%20Suite%20of%20Assessments%20Technical%20Manual-FINAL.pdf) | Printed pp. 30, 36, and 73: score intervals and vertical score scale; not the complete 238-page manual |
| G4 | [Fall 2026 SAT Weekend Understanding Scores](https://satsuite.collegeboard.org/media/pdf/sat-understanding-scores.pdf) | Printed p. 4: common score scale and same-day interpretation |
| G5 | [Fall 2026 PSAT/NMSQT Understanding Scores](https://satsuite.collegeboard.org/media/pdf/psat-nmsqt-understanding-scores.pdf) | Printed p. 5: shared scale, different floors/ceilings, and growth interpretation |
| G6 | [Build Your SAT Suite Study Plan](https://satsuite.collegeboard.org/practice/build-your-study-plan) | Full substantive page: targeted work, mistake review, and practice-test scheduling guidance |

These are College Board sources, including research about its own assessments/practice resources. Their official status establishes scoring authority, not independent confirmation of causal preparation effects. Do not claim the older Khan Academy paper cited in G1 was independently reviewed here.

## Digital practice study: what it found

G1 studied 148,154 students in the high-school graduating class of 2025 who took a March 2024 SAT School Day administration, with prior-year PSAT and required demographic information. Its matched comparisons contrasted completion of 1, 2, or 3+ full-length digital practice tests with completion of none. It excluded students who engaged in practice without completing a full-length test. The regressions controlled for observed prior achievement, demographic factors, prior SAT experience, and digital readiness behaviors.

The report describes estimated score differences of roughly 25, 45, and 60 points for those practice categories compared with similar non-completers. The main results give 25.7, 45.5, and 61.4 points; these are matched/regression associations, not within-student guaranteed gains or points to award in Laplora. The report also finds larger associated differences at lower prior achievement and discusses score ceilings.

G1 explicitly states on printed p. 7: “Estimates are not causal.” Unobserved motivation, guidance, and targeted academic support can still differ between groups. Its discussion notes that the study cannot separate these influences. SAT School Day results may not generalize to weekend takers. The model includes demographics that Laplora deliberately does not collect. The study counts test completion, not weekly study hours or a personal consistency rate.

Implication: full-length practice is a reasonable preparation input and scenario context. The report does not license adding 25 points per test, treating completion frequency as a causal coefficient, or converting its regression into a personal simulator.

## Longitudinal growth estimates: what they can and cannot do

G2 describes 15 assessment/grade/season pathways using test data from fall 2023 through spring 2025. It estimates conditional means and standard deviations by prior section score, with smoothing, and reports approximate typical-growth ranges. These are conditional cohort summaries; they are not a weekly preparation-dose experiment.

The report warns about self-selection, measurement error, individual instruction/engagement differences, unrepresented pathways, and changes in score relationships over time. Its approximate middle-68% interpretation relies on the relevant conditional distribution and is not an individual guarantee. The report explicitly rejects precise deterministic forecasts and causal claims about instructional effectiveness.

Implication: the tables could support a separate future cohort-context feature with appropriate pathway information. V0.1 will not import them, extrapolate them weekly, or add their observed growth to a study-hours curve. Doing so could double-count maturation/preparation and would require inputs absent from the current product.

## Research question ledger

| Question | Evidence and limits | Proposed modeling treatment |
| --- | --- | --- |
| Baseline and remaining room | Official scales impose score ceilings; G1 reports associations varying with prior achievement | Preserve section anchors; bounded diminishing-return curve is an experimental structural choice |
| PSAT versus SAT scale | G3–G5 confirm common vertical scale with different floors/ceilings | No linear rescaling; special below-SAT-floor policy needs owner approval |
| Weekly study hours | Reviewed digital study does not estimate a weekly-hour dose-response | Explicit experimental saturation function, not a research-derived points/hour claim |
| Consistency | G6 recommends a practical study plan; no personalized consistency coefficient was found here | Treat the declared completion fraction as a transparent simplifying assumption |
| Study methods and mistake review | G6 recommends targeted practice/review and explaining mistakes | Use descriptive guidance; do not assign unsupported numerical method rankings |
| Practice-test frequency | G1 finds noncausal associations; G6 recommends spacing tests by at least two weeks when possible | Budget guidance; no independent score bonus |
| Prep history | G1 includes prior SAT experience but does not validate Laplora's prep-history categories | Context only; observed baseline already reflects prior preparation |
| Time until test | G2 describes specific longitudinal pathways, not arbitrary weekly horizons | Exact calendar horizon in an explicitly experimental curve; no passive growth bonus |
| Uncertainty | Official measurement ranges and G2 cohort-growth ranges answer different questions | Illustrative parameter sensitivity only; disclose missing performance variability |

## Limits and next research

No personal growth rate, method multiplier, predictive accuracy, or calibrated uncertainty band is established by this review. Real outcomes can decline because of measurement variability, fatigue, health, stress, forgetting, or differing testing conditions; a monotone model must not be presented as a lower bound.

Future calibration needs appropriate consented longitudinal observations, exposure definitions, a reference model, out-of-sample evaluation, section-level error metrics, coverage assessment, and attention to distribution shifts. A 5–10-person usability beta is insufficient for that scientific task.

## Mentoring exercise

Explain why students who choose to complete practice tests might also be more motivated or receive more support. Matching measured characteristics helps, but it cannot guarantee those unseen differences disappear. That is why an association is useful evidence to discuss yet cannot automatically become a causal score-growth rule.
