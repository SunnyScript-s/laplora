# SAT scoring research — Week 1

Reviewed October 14, 2026. Sources are official College Board pages read directly in this session. Web pages may change; recheck at implementation and before launch.

## Source ledger

| ID | Source | Access and evidence type |
| --- | --- | --- |
| S1 | [What Do My SAT Suite Scores Mean?](https://satsuite.collegeboard.org/scores/what-scores-mean) | Read; official scoring/report description |
| S2 | [How the SAT Is Structured](https://satsuite.collegeboard.org/sat/whats-on-the-test/structure) | Read; official assessment structure |
| S3 | [What Are Content Domains?](https://satsuite.collegeboard.org/practice/content-domains) | Read; official domain/report description |
| S4 | [Full-Length Digital Practice Tests on Bluebook](https://satsuite.collegeboard.org/practice/practice-tests/bluebook) | Read; official practice description |
| S5 | [My Practice 101](https://satsuite.collegeboard.org/practice/my-practice-101) | Read; official practice-report walkthrough |
| S6 | [SAT Suite of Assessments and College Readiness](https://research.collegeboard.org/reports/sat-suite) | Read index only; linked studies have not been reviewed |

Earlier score URLs for SAT, PSAT/NMSQT, and PSAT 10 resolved to the shared S1 score overview. They are not three independent sources. Initial requests were blocked; subsequent browser-style User-Agent requests succeeded. A request using Python's default User-Agent still returned 403, so access behavior depends on the request. No authentication or verification was disabled.

## Verified scoring facts

S1 lists these ranges:

| Assessment | Total score | Each section |
| --- | --- | --- |
| SAT | 400–1600 | 200–800 |
| PSAT/NMSQT | 320–1520 | 160–760 |
| PSAT 10 | 320–1520 | 160–760 |
| PSAT 8/9 | 240–1440 | 120–720 |

Laplora's V1 plan excludes PSAT 8/9; its range is recorded to avoid accidentally accepting it as another PSAT type. S1 describes total, Reading and Writing, and Math scores. Essay scores, when present for some in-school testing, are reported separately and are outside Laplora's model.

S1 also describes a **Score Range**: how much scores would likely vary on another administration under identical conditions. This is measurement-related variation. It is not evidence for the uncertainty of a months-long preparation-growth forecast, and must not be reused as such without a justified model.

Scoring increments and cross-assessment comparability require more detailed source review in Week 2. Different test maxima do not justify linear rescaling from PSAT to SAT. These pages do not validate a personal future-score conversion.

Update: the subsequent focused review in [GROWTH_RESEARCH.md](GROWTH_RESEARCH.md) verified 10-point section intervals in the digital technical manual and the common vertical scale in the Fall 2026 score guides. A score on the common scale is not evidence of future growth; the below-SAT-floor input policy still needs approval.

## Structure and content domains

S2 states that the SAT has Reading and Writing and Math sections. Reading and Writing contains 54 questions over 64 minutes; Math contains 44 questions over 70 minutes. Each section has two equal-length modules, and there is a 10-minute break between sections. Performance in the first module affects the difficulty of the second. Laplora uses reported section scores; it is not implementing adaptive testing or reconstructing scores from question counts.

S3 lists four domains in each section:

| Reading and Writing | Math |
| --- | --- |
| Information and Ideas | Algebra |
| Craft and Structure | Advanced Math |
| Expression of Ideas | Problem-Solving and Data Analysis |
| Standard English Conventions | Geometry and Trigonometry |

S3 describes Bluebook practice-report progress bars out of seven for each domain. Their interpretation differs by assessment. For example, SAT bars 1–3 are categorized as easy, 4–5 medium, and 6–7 hard; PSAT/NMSQT and PSAT 10 use 1–2, 3–4, and 5–7 respectively. These are report indicators, not continuous domain scores or enough evidence to derive precise section-growth rates. Detailed domain-aware modeling is a later roadmap item.

## What Bluebook practice provides

S4 distinguishes an **unscored test preview** from **scored full-length practice**. Full-length practice is timed, with the described ability to advance between sections before time expires. After completion, students can view/download scores, review questions, analyze performance, and access targeted practice through My Practice.

S5 confirms that My Practice provides chronological practice-score history, per-question correct and selected answers with explanations, tailored questions, links to review resources, and a downloadable practice score report with question-count and content-domain information. S3 supplies the domain-bar explanation.

Product implication: accept a student's existing scored full-length result, ask which assessment it represents, and provide clear directions to locate it. Do not scrape College Board accounts, ask for credentials, or treat a test preview as a baseline score.

## What the sources do not establish

No preparation-growth study was read in this milestone. S6 links an Official SAT Practice Technical Report and 2026 growth estimates, but the index is not a substitute for reviewing those reports, their cohorts, methods, uncertainty, and applicability to current digital assessments.

Subsequent research: GROWTH_RESEARCH.md records the reviewed May 2025 digital-practice study and the relevant methods/limitations of the March 2026 student-growth report. Neither supplies calibrated Laplora coefficients.

No numerical relationship between hours, consistency, methods, preparation history, or score improvement has been verified here. No coefficient, accuracy claim, probability of reaching a target, or personal score guarantee is supported by these scoring pages.

## Evidence versus assumptions

| Topic | Current classification | Next action |
| --- | --- | --- |
| SAT/PSAT score ranges, sections, domain names | Verified official descriptive facts | Recheck while defining input validation |
| Bluebook report capabilities | Verified official descriptive facts | Use clear baseline-entry instructions |
| PSAT-to-SAT baseline interpretation | Open modeling policy | Read current comparability/vertical-scale guidance in Week 2 |
| Baseline age and elapsed progress | Open modeling policy | Avoid inventing growth since the observation; propose explicit handling |
| Growth equation and diminishing returns | Experimental proposal | Compare candidate behavior and explain limitations before approval |
| Study-method effects and growth coefficients | Unverified | Research in Week 3; distinguish associations from causal claims |
| Future-score uncertainty | Unverified | Approve interpretation in Week 5; do not label illustrative bands as confidence intervals |

## Mentoring exercise

Explain why a Math score of 700 and a Reading and Writing score of 600 imply a total of 1300, and why the same input cannot automatically be judged valid for every test type. Then explain why knowing the score scale does not tell us how many points one hour of practice will add. This distinguishes validation rules from a growth model.
