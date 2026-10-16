# Laplora model validation roadmap

Phase 4 · October 16, 2026 · **Predictive accuracy remains unverified.**

This is an implementation-ready research and evaluation plan, not authorization to collect student data, change coefficients, publish accuracy claims, or start Phase 5. Santiago authorized this roadmap and source review. The current website and `0.1.0-experimental` model remain unchanged.

References: [focused evidence review](VALIDATION_RESEARCH_REVIEW.md), [approved model specification](MODEL_SPECIFICATION.md), [existing research](GROWTH_RESEARCH.md), and [local validation workflow/schema](../validation/README.md).

## Current baseline and limits

V0.1 models each section using remaining room below 800, experimental hour saturation H=4 and learning rates 0.006/0.012/0.018. Target score is only a marker. History, study methods and test frequency are descriptive. Section gains depend on declared planned hours, intended consistency, allocation and elapsed time, not fitted empirical effects.

| Limitation | Risk to interpretation | Required evidence or proposed response |
| --- | --- | --- |
| Fixed, identical section rates and hour saturation | Real learning may differ by section, student, skill and horizon | Fit only approved candidates using adequate training variation; compare to simpler alternatives |
| Monotone trajectories with no forgetting, maturation, schooling or test-day noise | Real scores can decline; long-horizon trajectories may overstate growth | Include declines in evaluation; investigate residual patterns before adding terms |
| Baseline treated as an exact starting observation | Measurement error and regression to the mean can look like growth | Repeated comparable observations and a separately justified measurement model |
| Planned hours and intended consistency are self-reports | Misreporting and plan changes may distort associations | Preserve timestamped baseline plans; audit actual hours separately, never leak them into baseline predictions |
| Sensitivity range varies only k | Coverage is not a probability or complete performance envelope | Keep current labels; develop prediction intervals separately only after validation |
| Shared-scale PSAT anchors in the UI | Different ceilings/floors and elapsed growth prevent a personal conversion | Current primary validation remains SAT-only; any PSAT protocol needs separate evidence/approval |
| Selected volunteers and incomplete follow-up | Estimates may not generalize to typical users | Document recruitment, nonresponse and population coverage; seek independent temporal/external cohorts |
| Same-source practice pairs and official pairs pooled | Conditions and forecast targets can differ | Report source-specific performance before any claim about official SAT outcomes |

Current Phase 2/3 tools provide deterministic splits, quality checks, descriptive errors and local reports. They do not provide data consent, durable test-access controls, calibrated intervals, uncertainty estimates for performance metrics, causal identification or representative sampling.

## 1. Agree on the prediction question and protocol

**Proposed next research decision, not implemented:** define whether a candidate predicts a future official SAT or a comparable official full-length practice outcome. Declare the section/total outcomes, target population, horizon, first-attempt test forms and allowed conditions before viewing results. A same-administration Math+RW total is required; do not use superscores assembled across dates.

Keep distinct cohorts for official → official, practice → practice and a future practice → official question. The last is currently excluded by the evaluator and would require an approved eligibility change and its own validation. Record this mismatch explicitly: success on the current dataset is not evidence for every website use case.

Collect a baseline plan before outcomes are known and define the prediction timestamp and planned follow-up date. The existing retrospective evaluator conditions on the actual follow-up date; a prospective protocol must specify how rescheduling and missed tests are handled without using outcomes to select a horizon. Predeclare inclusion rules, primary metric, comparator, smallest meaningful improvement, uncertainty procedure and stopping rules. Log all planned candidate comparisons.

**Exit evidence:** a dated protocol approved by the owner and reviewed by a qualified statistical/research adviser for any public accuracy claim. No numerical success threshold should be picked after seeing favorable results.

## 2. Obtain appropriate data safely

Minimum current technical requirements are the [25-column schema](../validation/README.md#csv-schema): stable random participant ID, genuine assessment dates and section scores, assessment/source/format/conditions, first attempt at each specific form, and baseline-recorded plan/context. Optional realized hours remain audit-only. Valid values alone do not prove truthful or comparable observations.

Before recruitment, establish informed consent/assent and guardian requirements where applicable, a documented purpose, access limits, withdrawal handling and a concrete retention/deletion schedule. Have the responsible owner obtain appropriate ethics/legal guidance for research involving minors. Do not solicit names, email, school or score reports through anonymous product feedback. Any consent/contact linkage belongs in a separately approved private system, not the public repository or evaluation CSV.

Data collection is not implemented here. For an approved protocol, add only metadata with a specific quality purpose: prospective prediction/follow-up timestamps, nonidentifying test-form token to detect reuse, and comparable-condition attestations without disability details. Specify these in a versioned schema before implementation. Do not collect demographics merely because a published study used them; fairness evaluation requiring such attributes needs a separate consent/privacy rationale.

Quality review must distinguish invalid records, valid-but-ineligible records and missing follow-up. Audit source/conditions, repeated forms, date inconsistencies, transcription errors, impossible increments and duplicates. Retain an exclusion ledger and recruitment/follow-up counts privately. Do not discard score decreases or difficult cases to improve metrics. Do not impute missing outcomes as zero growth. Current reports count provided records only; they cannot quantify attrition without recruitment data.

**Sample adequacy:** the existing 30-training-participant mean-growth guard and 10-participant group display guard are software rules, not validation thresholds. Use pilot training data to estimate variability and plan the required precision for paired model differences, coverage and key groups. Account for clustering, attrition and temporal evaluation; predeclare the resulting sample target. A 5–10-person usability beta cannot establish predictive accuracy.

## 3. Preserve partitions and freeze the benchmark

Keep the existing stable participant-level SHA-256 split: approximately 60% train / 20% evaluation / 20% test, with seed `laplora-v01-validation-1`. Never change participant IDs or the seed to improve results. One earliest eligible interval per participant currently avoids unequal weighting; future repeated-measure models must keep all intervals from a participant in one partition and account for dependence.

Freeze V0.1 source/parameters, input schema, exclusion policy, code commit, data digest, seed, protocol date and metric definitions before fitting anything. Store the run manifest privately with raw predictions and audit records. Compare candidates on exactly the same eligible records; record unavailable predictions rather than silently changing denominators.

Training-only cross-validation may select features, hyperparameters and preprocessing. Fit normalization, missing-feature treatment and any learned interval method only within the appropriate training folds. Keep evaluation and test outcomes out of fitting. Evaluation is a predeclared audit, not an iterative tuning loop. If results inspire revisions, declare that set used and obtain a new untouched assessment cohort for the revised claim. Reserve the independent test for the frozen final candidate; record access and failed candidate results. The CLI unlock flag alone does not enforce this governance.

A later temporal cohort or independently recruited cohort is also needed to assess transportability beyond one random split. Preserve participant separation even across cohorts.

## 4. Evaluate predictive usefulness before adding complexity

| Measure | Required interpretation |
| --- | --- |
| MAE for Math, RW and total | Primary descriptive accuracy; predeclare which outcome is primary for a decision |
| Bias (prediction − observation) | Positive means overprediction; report magnitude and uncertainty, not only sign |
| RMSE and median absolute error | Show large-error sensitivity and typical absolute error together |
| Within 50 / 100 points | Inclusive thresholds; descriptive proportions, not guarantees |
| Observed versus modeled average gain | Separate mean changes from individual error; good means can hide poor individual forecasts |
| Paired MAE difference versus V0.1 and baselines | Same participants; positive baseline-MAE minus candidate-MAE means candidate improvement |
| Slower–faster coverage | Existing descriptive sensitivity-band coverage only; no nominal probability |
| Subgroups and residual plots | Starting score, duration, planned hours, section imbalance; proposed source/condition strata need adequate data |

Keep no-change and training-only average-growth comparators. A future duration-aware simple comparator can be considered, but must be trained without held-out outcomes and justified before testing. Published cohort growth cannot be added indiscriminately as another baseline when grade/season pathways are missing.

Proposed statistical additions, not implemented: paired participant-level resampling for error-difference uncertainty; suitable uncertainty intervals for coverage/proportions; residual checks for heteroscedasticity and systematic under/overprediction; and calibration plots for predicted versus observed scores. Any resampling must preserve clusters when relevant. A confidence interval for a performance statistic is different from an individual prediction interval. Predeclare multiplicity handling and treat exploratory groups as exploratory. Small-group suppression is not evidence that the remaining groups are adequately powered.

**Decision:** do not declare predictive usefulness because unit tests pass, synthetic graphs look plausible, scores are bounded, or a point estimate beats no-change. Require a practically useful, uncertainty-supported improvement against credible baselines, no unacceptable section/group failures, and reproducibility on independent data. Exact tolerances must be set prospectively with the owner and adviser, not invented here.

## 5. Consider calibration only with separate approval

After the protocol and data checks, propose a versioned candidate rather than editing V0.1 in place. A first low-complexity experiment could fit section learning rates while holding H fixed. Simultaneously estimating H, k and a consistency transformation may be weakly identifiable without broad variation in actual exposure and horizon; inspect this before expanding parameters. Estimated associations still do not establish causal effects of study choices.

Train only on consented training data using predeclared objectives, bounds and regularization; retain the original V0.1 as a reproducible baseline. Compare simpler candidates before adding method bonuses, demographic effects, domain knowledge or time-varying plans. Each new input needs evidence and a privacy/product justification. Do not use a target score as a predictor that artificially increases growth.

Candidate changes to forgetting, maturation, observation noise, nonlinear adherence or heterogeneous rates are research hypotheses, not promised improvements. Version coefficients, document units and intended population, add relevant structural/regression tests, then run the frozen comparison protocol. A calibrated prediction model still does not establish that changing an input causes the modeled improvement.

**Owner approval required before any coefficient/equation change or rollout. No fit or change is performed in Phase 4.**

## 6. Improve uncertainty without relabeling existing curves

Separate (a) baseline measurement uncertainty, (b) individual future-outcome variability, (c) estimated-parameter uncertainty and (d) uncertainty in evaluation metrics. R3's SEM is about measurement; R2's pathway ranges concern particular cohorts; neither is a drop-in Laplora interval.

After adequate data, consider out-of-fold residual-based intervals, quantile models or a separately calibrated conformal approach. State their assumptions, calibration-data needs, score-boundary behavior and coverage target in advance. For split conformal methods, reserve calibration participants inside training/development data; do not reuse the final test for calibration. Marginal coverage does not guarantee coverage for every score/horizon/group, and temporal shift can invalidate assumptions.

Assess observed coverage **and interval width**, section/total dependence, boundary effects and subgroup coverage on untouched outcomes. Intervals must allow actual declines where supported; do not clip their lower edge at the starting score merely because V0.1 is monotone. Combining section intervals into a total interval requires a joint justification, not naive addition of nominal probabilities.

Until that work succeeds, retain “slower/central/faster assumptions” and the explicit non-confidence-interval disclosure. Do not show target-achievement probabilities without a separately evaluated probabilistic model.

## 7. Requirements before a predictive claim or model release

A reviewable evidence package must include:

1. The preregistered/dated protocol, consent/governance record and intended-use population.
2. Data lineage, assessment comparability, attrition/exclusion accounting and participant counts by partition/group.
3. Frozen code/schema/parameters and reproducible private runs for V0.1, the candidate and baselines on identical outcomes.
4. Independent test and temporal/external evaluation, uncertainty around comparisons, failure cases and group limitations.
5. A model card explaining approved uses, unsupported populations/horizons, noncausal interpretation and known risks.
6. Owner approval of revised wording and versioned release, with monitoring and rollback to the preserved V0.1 implementation.

Use scope-specific statements such as observed errors in a defined cohort, with sample size and dates. Avoid “scientifically proven,” guaranteed score increases, universal accuracy percentages, or claiming validation from synthetic data. If evidence is inadequate or a candidate fails, retain the educational simulator label and report that outcome honestly.

## Work sequence and approval boundaries

| Milestone | Deliverable | State |
| --- | --- | --- |
| Phase 4 evidence review and roadmap | This document and source-linked research review | Completed documentation; no calibration |
| Owner review of research choices | Target outcome/population, prospective protocol and data governance | Proposed; decisions still required before research collection |
| Approved pilot and precision planning | Quality/attrition assessment and sample-size justification | Not started; no real data available |
| Approved candidate experiments | Training-only fits, frozen comparisons and uncertainty evaluation | Not started; coefficient approval required |
| Independent validation and claim review | Auditable evidence package and limited intended-use statement | Not started |
| Phase 5 project verification/privacy/deployment | Remaining 16-part goal items 13–16 | Separate next implementation phase; not started by this roadmap |

Learning checkpoint: a model may be mathematically consistent, predict well in one sample, and still fail on a later cohort. Even a useful predictor does not prove its input variables cause score growth. These are three distinct questions, requiring different evidence.
