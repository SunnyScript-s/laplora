# SAT validation evidence review — Phase 4

Reviewed October 16, 2026. This is a focused review of sources relevant to Laplora, not a systematic literature review, a new empirical study, or a calibration result. Read alongside [SAT scoring research](SAT_RESEARCH.md), [growth research](GROWTH_RESEARCH.md), and the [validation roadmap](MODEL_VALIDATION_ROADMAP.md).

## Sources and inspection scope

All four PDFs below were retrieved directly from their linked publisher/research-host URLs with TLS verification, converted to text and inspected in this phase. Page references are printed page numbers, not PDF viewer offsets. Source files were used locally and are not redistributed in this repository.

| ID | Source and version inspected | Relevant sections inspected | Authority and limitations |
| --- | --- | --- | --- |
| R1 / G1 | Chang, Akbayin-Sahin & Howell, [Examining the Relationship Between Digital SAT Practice in Bluebook and SAT Performance](https://research.collegeboard.org/media/pdf/DigitalSATPracticeTests_052025.pdf), May 2025 | Data/methodology pp. 5–6, results and noncausal caveat p. 7; existing G1 review covers broader discussion/appendix | College Board observational analysis of its own practice product; not independent causal confirmation |
| R2 / G2 | Zhao, Zhang & Proctor, [Student-Level Growth Estimates for the SAT Suite](https://research.collegeboard.org/media/pdf/2026-sat-suite-student-growth-estimates.pdf), March 2026 | Pathway/method descriptions, conditional range discussion, appropriate uses and limitations pp. 9–10 | Official longitudinal cohort estimates; not a study-hours intervention |
| R3 / G3 | College Board, [Digital SAT Suite of Assessments Technical Manual](https://research.collegeboard.org/media/pdf/Digital%20SAT%20Suite%20of%20Assessments%20Technical%20Manual-FINAL.pdf), version served on review date | Digital continuity/changes in chapter 1, practice resources table 1.2 p. 18, standard errors and reliability §§6.3.2–6.3.3 pp. 95–96 | Primary authority for test design and scoring methods; not a validation study of Laplora or every practice-use condition; full manual not reviewed |
| R4 | Goodman, Gurantz & Smith, [Take Two! SAT Retaking and College Enrollment Gaps](https://www.nber.org/system/files/working_papers/w24945/w24945.pdf), NBER Working Paper 24945, August 2018, revised April 2019 | Abstract, introduction pp. 1–4, data and score definitions p. 6, regression-discontinuity design description | Academic quasi-experimental study using College Board data. This citation is to the inspected working-paper version, not a claim to have reviewed a later journal version |

## What the evidence supports

### Digital preparation and score improvement

R1 analyzes 148,154 students in the graduating class of 2025 who took the March 2024 school-day SAT and had prior PSAT and required demographic information. Its comparison excludes students who started digital practice without completing a full-length test. Completion could occur in multiple sittings, which differs from a strictly standardized practice assessment.

Its adjusted comparisons associate completing 1, 2, or 3+ full-length tests with respectively 25.7, 45.5, and 61.4 higher total points than comparable non-completers. These are between-group estimates, not guaranteed within-student improvements. The report explicitly states: “Estimates are not causal” (p. 7, footnote 4). Motivation, support and other unobserved differences can remain after matching. Weekend takers and other populations may differ.

**Laplora implication:** retaining preparation context is defensible; adding points per completed test, estimating weekly-hour rates from these contrasts, or treating consistency as a fitted causal multiplier is not. Lower-baseline associations and score ceilings do not validate our particular exponential curve. The study does not provide coefficients for H=4 or k=0.006/0.012/0.018.

### Retaking is distinct from a preparation dose

R4 uses discontinuities in retake behavior around round-number score thresholds as an instrument in a fuzzy regression-discontinuity design. Under the design's identification assumptions, its estimates concern students whose retaking responds to those thresholds. This is stronger causal identification than merely comparing voluntary retakers with non-retakers, but it is not a randomized study of hours, consistency, tutoring, or Bluebook use.

The data cover high-school classes of 2006–2014, when the SAT had Math, Critical Reading and Writing sections and a 600–2400 total scale. The paper distinguishes a later single test score from an admissions superscore assembled across attempts. Its introduction reports an estimated 46-point increase in retake scores on that historical 2400 scale and a larger superscore effect (p. 3). **Neither number is a modern digital-SAT coefficient. Do not multiply by 1600/2400 or add it to a growth curve.** Superscore increases also answer a different question from a future single-administration result.

**Laplora implication:** retain assessment dates and first-attempt/form information, avoid superscores as follow-up observations, and study retest selection separately. Causal findings for a particular historical subgroup cannot establish present-day individual predictive accuracy. The authors acknowledge limits to generalizing from threshold-induced retakers.

### Score change over time

R2 summarizes observed section-score changes for defined assessment/grade/season pathways using data from fall 2023 through spring 2025. Conditional means and approximate middle-68% ranges describe those cohorts; they do not isolate instructional or preparation effects. Its limitations explicitly include self-selection, measurement error, unrepresented pathways and changes in population relationships over time.

**Laplora implication:** a future cohort-context comparator could be considered only for supported pathways and with appropriate grade/season metadata and separate approval. Do not interpolate arbitrary weekly rates, treat its ranges as Laplora intervals, or add cohort growth to preparation growth without addressing double counting. A common SAT Suite scale does not justify a deterministic PSAT-to-future-SAT conversion.

### Practice reliability and measurement noise

R3 distinguishes standard error of measurement (SEM), conditional SEM and score reliability. Conditional SEM concerns precision at a score level; reliability depends on measurement error relative to score variance in the population (§§6.3.2–6.3.3). Neither is the error distribution of a future growth forecast. Avoid inventing one universal “± points” figure from the manual.

R3's practice-resource description says Bluebook offers digital adaptive forms using the test interface and format, alongside longer linear forms intended for paper-based accommodations. This supports recording the assessment format. It does **not** establish that a self-administered home practice score, possibly paused or repeated, has the same reliability or predictive relationship as a proctored operational administration. R1's inclusion of multiple-sitting practice reinforces that distinction.

**Evidence gap:** this focused review did not establish a transportable test–retest reliability estimate for the exact at-home practice conditions Laplora users will supply. Do not interpret that as proof that no such research exists. Review form-specific technical evidence and collect repeated, comparable observations under an approved protocol before fitting an observation-error model. Practice → practice performance does not by itself validate practice → official-SAT predictions.

### Historical versus digital SAT

R3 describes continuity of the modern 400–1600 score scale alongside changes to adaptive delivery, timing, item presentation and tools. Shared score meaning does not imply invariant preparation effects across formats. R4 predates both the 2016 redesign and current digital delivery; its three-section scale is especially unsuitable for direct numerical transfer. Even a historical two-section 1600-scale study would require a population, measurement and context review before transfer.

The Phase 2 evaluator conservatively excludes paper tests, PSAT comparisons, mixed sources, reused forms, and nonstandard/unknown conditions. This is a current analysis policy, not a claim that official accommodated tests are invalid or incomparable in general. Matching an `accommodated` label cannot itself prove that two administrations used comparable conditions.

## Evidence classifications and unresolved questions

| Topic | Classification today | Consequence |
| --- | --- | --- |
| Score scale, section structure and formal measurement concepts | Official descriptive/technical evidence | Enforce score contracts; do not confuse scale validity with forecast validity |
| Digital full-length practice associations | Observational evidence | No per-test or per-hour causal coefficient |
| Historical threshold-induced retaking | Quasi-experimental causal evidence within design assumptions | No direct transfer to digital individual trajectories or study-dose effects |
| Conditional longitudinal SAT Suite growth | Descriptive cohort evidence | Potential future context, not an additive growth term |
| H, k, intended consistency and section allocation response | Experimental Laplora assumptions | Leave coefficients unchanged; require independent data before revisions |
| At-home practice → official-test agreement and uncertainty | Unresolved for Laplora's target population | Research and prospectively validate separately |
| Predictive value beyond no-change/mean-growth | Unverified | Synthetic tests and mathematical consistency are insufficient |

No randomized digital study-hour effect was established by this review. No user records were collected or analyzed. College Board is the publisher of three sources and the data provider for R4; avoid presenting the ledger as four independent replications. New evidence should record population, assessment version, outcome definition, causal design, uncertainty and applicability before entering the model roadmap.

## Reproducibility receipts

SHA-256 of retrieved PDFs on October 16, 2026 (URLs can later change):

```text
R1 1559a7cdedd396ecf189f0802843a5093b2ee242ded6b5c9ef9a21eef7daf627
R2 57ca995f9cd23923d9a711bf484b8b3a2f228fd89b113d40afa4fe24f4e151db
R3 d9613f8f5046ce5e33530afe562ba9611d08293bff8918febc77f74f8b34b8f4
R4 1f61acd7a292ac520d824edca0f95e5edc7cd75579421cbf5c35b8a8229c6ffe
```
