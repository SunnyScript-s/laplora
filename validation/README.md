# Local model validation — Phases 2–3

This command-line system evaluates the unchanged experimental V0.1 engine. It does not run in the website, send requests, tune coefficients, or establish predictive accuracy. The CSV in `fixtures/synthetic.csv` contains **120 entirely fictional participants** and deliberately simple invented outcomes; it is only a software fixture.

## Run

Use the repository's Node 24 installation and `npm ci`. No new dependencies or services are required.

```sh
npm run validate:model -- --input validation/fixtures/synthetic.csv --as-of 2026-10-16 --data-kind synthetic --out validation/output/demo.json
```

Output paths must be new (existing files are never overwritten). JSON contains data-quality issues, model version/parameters, dataset SHA-256, split seed, counts, exclusions, section/total metrics, baseline comparisons, group summaries, and individual errors for the selected partition. Add `--report-dir` to generate the Phase 3 offline dashboard and Markdown report described below.

For consented real data, place the CSV **outside this repository**, then use `--input /private/path/students.csv --data-kind real --out /private/path/results-new.json --as-of YYYY-MM-DD`. Treat the output as sensitive too. Local `validation/data/`, `validation/output/` and `.build/` are Git-ignored; all `validation/` content is excluded from Vercel CLI uploads and is absent from the frontend import graph. Ignore rules are not access control: never force-add private files or put datasets in `public/`. Do not attach real data to GitHub, feedback, analytics, or chat. Store any participant lookup separately with restricted access. Agree on consent, guardian requirements where applicable, purpose, access and deletion dates before collecting data; these tools do not establish consent or enforce retention.

## CSV schema

Exactly these 25 named columns are required, in any order. All values are required except `actual_weekly_hours`. UTF-8 CSV supports a BOM, CRLF, quoted commas/newlines and doubled quotes. Files are limited to 5 MiB and 10,000 records. Unknown/duplicate headers, malformed rows and any invalid record stop evaluation. Row/field issues are saved without raw submitted values. Structural/file/argument failures exit nonzero without a result. Correct issues before rerunning with a fresh output path.

| Column(s) | Rules and purpose |
| --- | --- |
| participant_id | `p_` plus 16 random lowercase hexadecimal digits, stable per participant; never derive from personal information. Generate with `node -e "console.log('p_'+require('crypto').randomBytes(8).toString('hex'))"`. A pseudonym is not proof of anonymization. |
| baseline_assessment, followup_assessment | `sat`, `psat-nmsqt`, `psat-10`; PSAT records are retained but excluded from prediction metrics. |
| baseline_date, followup_date | Real YYYY-MM-DD dates; follow-up strictly after baseline, within 728 days, no later than explicit `--as-of`. |
| baseline_math, baseline_rw, followup_math, followup_rw | Integers in tens; SAT 200–800, PSAT 160–760 per section. Totals derived, never independently entered. |
| baseline_source, followup_source | `official` = administered official test; `official-practice` = official full-length practice test; `unofficial` retained but ineligible. Do not mark partial or third-party tests official-practice. |
| baseline_format, followup_format | `digital`, `paper`, `unknown`; only digital comparisons currently eligible. |
| baseline_conditions, followup_conditions | `standard`, `accommodated`, `nonstandard`, `unknown`; only matching standard or accommodated conditions eligible. Do not record disability details. |
| baseline_first_attempt, followup_first_attempt | `yes`, `no`, `unknown`: first attempt at that specific test form. Reused/unknown attempts excluded. |
| plan_recorded_date | Date study-plan fields were recorded; must be on/before baseline. Do not retrospectively rewrite the plan using observed progress. |
| planned_weekly_hours | Baseline plan, 0–40 in quarter-hour increments; includes tests/review. |
| actual_weekly_hours | Optional retrospective average, 0–40; blank means unavailable, not zero. Audit-only; never a prediction feature. |
| consistency_percent | Baseline estimate of planned study consistency, integer 0–100. A later realized estimate must not replace it. |
| math_allocation_percent | Baseline planned share, 0–100; remaining hours assigned to RW. |
| study_methods | Semicolon-separated unique values: `targeted-practice`, `full-length-tests`, `mistake-review`, `tutoring-class`, `unsure` (unsure alone). |
| practice_test_frequency | `none`, `every-four-weeks`, `every-two-weeks`, `weekly`, as planned at baseline. |
| prep_history | `just-starting`, `some-preparation`, `consistent-preparation`, as known at baseline. |

Dates and plan metadata are contributor attestations; software cannot prove contemporaneous collection or honest anonymization. Missing required metadata is not imputed. Duplicate participant/date intervals are errors. Additional eligible intervals for one participant are excluded after selecting the earliest baseline, then earliest follow-up, without looking at outcomes.

## Methodology and leakage controls

Primary eligibility requires digital SAT → SAT, matching official source and comparable conditions, and first attempts. No PSAT conversion or historical-paper extrapolation is performed. Source and condition restrictions reduce comparability problems but do not eliminate measurement noise or population differences.

The production `simulate` function receives the baseline date as its injected start date and the observed follow-up date as horizon. Target score is fixed at 1600 solely as a display marker; it does not affect growth. Predictors use only the baseline plan. This is a retrospective evaluation conditional on follow-up timing, not proof of prospective forecasting performance. Evaluation uses **unrounded** endpoints; UI rounding is not applied.

SHA-256 of `laplora-v01-validation-1:<participant_id>` yields a fixed uniform bucket (first unsigned 32 bits divided by 2^32): below 0.6 train; below 0.8 evaluation; otherwise test. These are approximate 60/20/20 proportions, not stratified or exact counts. Participant IDs must remain stable across datasets. Do not rename participants, change the seed, or choose subsets based on results. Only one interval per participant contributes, preventing frequent testers from dominating metrics.

The default evaluates only the evaluation partition. Test outcomes are not printed in its result. `--partition test --unlock-test` explicitly opens the independent test partition; reserve this for a predeclared final comparison after freezing any future model. The importer still validates all rows for data quality. The CLI guard is a workflow aid, not a security barrier or durable record of prior test access. Keep a private dataset/version and access log. No calibration is implemented, and no tuning on evaluation or test results is permitted.

No-change always predicts the baseline. Average-growth is available only with at least 30 eligible independent training participants, using training-only mean section gains, adding to baseline and clamping each section to 200–800. It deliberately ignores duration/hours and is a weak comparator. Thirty is a conservative engineering guard, not a statistical power calculation. Insufficient training yields null, never an invented estimate.

For Math, RW and total, errors are prediction minus observation. Positive bias means overprediction. MAE averages absolute errors; RMSE is the square root of mean squared errors; median absolute error uses the middle value/pair; within-50/100 percentages include boundary values. Empty samples produce null. `maeImprovementOverBaselines` is baseline MAE minus Laplora MAE: positive means lower descriptive error for Laplora on this sample, not established usefulness or significance.

Coverage is the inclusive percentage of observed scores between raw slower/faster endpoints. **This is not a statistical confidence interval**, probability, or calibrated uncertainty claim.

Groups cover baseline totals, preparation duration, planned hours and section imbalance. Each shows independent participant count; metrics below 10 participants are suppressed. Ten is an engineering presentation rule, not sufficient evidence for population conclusions. Overall metrics remain descriptive even at small n. Only observed groups appear; empty partitions are explicit in counts. Research-quality claims need real, representative, independent data and further uncertainty/subgroup analysis. Predictive accuracy remains unverified.

## Verify

`npm run check` includes validation TypeScript. `npm run test:unit` includes importer, hand-calculated metrics, production-engine reuse, exclusions, null data, duplicate intervals, partition guards, and held-out outcome isolation. `npm run verify` also checks the unchanged public website. CLI smoke checks should use synthetic files only, including a malformed row and a new result path. This work adds no public collection form or automatic student-data capture.

## Phase 3: private dashboard and Markdown report

```sh
npm run validate:model -- --input validation/fixtures/synthetic.csv --as-of 2026-10-16 --data-kind synthetic --out validation/output/review.json --report-dir validation/output/review
```

Choose a new JSON path and new report directory for every run. The report directory's parent must exist (for the example, run `mkdir -p validation/output` first). Outputs are `dashboard.html` and `report.md`; open the HTML in your own browser and Markdown in a text editor. No server, external assets, JavaScript, network requests or paid services are required. Reports are generated directly from the same evaluation as JSON, rather than accepting unvalidated external report JSON.

The dashboard shows valid/eligible/evaluated counts, observed and predicted average gains, section/total metrics, baseline comparisons, a predicted-versus-observed total-score scatterplot, total-error histogram, group MAE charts with exact tables, and descriptive coverage. Group charts omit suppressed groups but tables retain their counts and reasons. Markdown uses the same aggregate tables and includes dataset provenance, methodology, exclusions, limits and next steps. Missing results display Unavailable; no-data charts are explicitly unavailable. Invalid rows produce a quality-only report and exit code 1; structural CSV errors still fail before report creation.

Both formats visibly distinguish fictional versus real input and preserve the unverified-accuracy warning. Reports include the input digest, as-of date, version, split seed and selected partition. No participant IDs appear in either format, but scatterplot coordinates remain individual score observations: **the HTML is private, not anonymized for publication**. Markdown aggregates can also be sensitive in small samples. Keep all outputs local and out of public Git/Vercel. Nothing is automatically deployed or shared. Test-partition reports require the same explicit `--partition test --unlock-test` workflow as JSON.

New files use mode 0600 and report directories 0700 where supported. Existing files/directories are refused. A later write failure can leave partial outputs; inspect the error and use new paths for the retry. Do not treat a partial directory as a successful report. For read-only browser inspection in managed cloud sessions that block `file:` URLs, load the generated HTML content in the test browser; do not publish private results to work around the restriction.
