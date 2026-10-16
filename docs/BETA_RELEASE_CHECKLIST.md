# Beta operations, privacy and release guide

October 16, 2026 · Phase 5. The simulator remains experimental and independent of College Board. No evaluation on real student data or model calibration has been completed. This guide covers the existing free website and local validation tools, not accounts, paid tiers or research recruitment.

## What is implemented

| Area | Delivered behavior | Remaining boundary |
| --- | --- | --- |
| Public beta | Beta label, explanation/privacy view, existing simulator and pricing presentation | No guarantees, paid checkout, accounts or score tracking |
| Feedback | Anonymous-by-default form, optional usefulness/device fields, Formspree submission, retry/error/accessibility behavior | Provider receipt/settings need owner review; client spam controls are bypassable |
| Local evaluation | Documented CSV, quality checks, unchanged model, metrics/baselines/groups, participant partitions | No real dataset, causal estimates, calibrated confidence intervals or empirical accuracy claim |
| Local reporting | Private HTML dashboard and Markdown report generated with JSON | Reports remain sensitive; no public hosting or automatic sharing |
| Research | Source-linked review and future validation roadmap | Collection, fitting and predictive claims require the separate research gates |

## Receive and review feedback

The existing endpoint is `https://formspree.io/f/mdeaydqy`, configured in `src/app/feedbackValidation.ts`. This public form URL is not a secret. Open [Formspree](https://formspree.io/) using the owner's account, select the form associated with that endpoint, and review its submissions. No new service or paid upgrade is required by the code.

The website posts only category/message and optional user-entered rating/device. It does not attach simulation scores, plans, page URL, screenshots or automatic device diagnostics. Fetch omits credentials and referrer. Free text can still contain information users voluntarily enter. Formspree and Vercel may process network metadata; anonymous fields do not make requests untraceable.

Before inviting testers, the owner should:

1. Send one non-sensitive message from the live form and confirm it appears in the correct Formspree dashboard. Automated tests mock the provider; they cannot establish inbox receipt or notification-email delivery. No live test message was sent during Phase 5.
2. Review permitted origins/domains, spam controls, quotas and any provider CAPTCHA requirements. Client validation, hidden trap and cooldown supplement service controls; they do not enforce server-side limits.
3. Choose and record a feedback deletion schedule and who can access submissions. Remove accidentally supplied personal information promptly. A 90-day window is an option, not an enabled retention policy. Check provider backups/log retention separately.
4. Reproduce issues with invented inputs. Record minimal steps and browser information in issue tracking, without copying private submissions, score records or identifiers into public GitHub issues.

The UI treats only an acknowledged successful response as success. An error or timeout keeps the draft and says delivery could not be confirmed; it does not prove the provider never received the message. Avoid repeatedly resending the same feedback while checking inbox delivery.

## Data handling inventory

| Data | Location and lifecycle | Owner action |
| --- | --- | --- |
| Simulator inputs/results | React/tab memory; cleared on refresh; no app storage or score API | Keep future persistence changes subject to explicit privacy review |
| Feedback drafts | Tab memory until submission/refresh | No automatic export or attachment |
| Submitted feedback | Formspree, plus possible provider logs/notifications | Access/deletion/spam/retention settings in owner's account |
| Website connections | Vercel service/security logs under provider policy | Review account access and provider retention; do not promise zero logs |
| Consented research CSV and generated JSON/HTML/Markdown | Private local path outside Git; new report files use restricted permissions where supported | Obtain research consent and retention decisions before collection; delete copies/exports according to agreed schedule |

Do not use feedback as a research score-collection channel. No names, email, school, account registration or scores are required for beta feedback. No analytics SDK, score telemetry, public leaderboard or database is introduced. A future study involving minors needs appropriate consent/assent/guardian handling, purpose, withdrawal and deletion procedures before collection. Follow [the roadmap](MODEL_VALIDATION_ROADMAP.md); this code does not implement consent or enforce retention.

Only `validation/fixtures/synthetic.csv` is a committed dataset, and it is explicitly fictional. `validation/data/`, `validation/output/` and `validation/.build/` are ignored by Git. All `validation/` content is excluded from Vercel CLI uploads; the production frontend never imports it. Never put private data in `public/`, force-add ignored records or attach real data/reports to a public PR. Ignore files are not access control and cannot protect arbitrary files placed elsewhere.

HTML reports omit participant IDs but contain individual score coordinates. Markdown aggregates can also identify people in small samples. Both remain private by default. The report generator loads no remote assets and makes no network requests.

## Run evaluation and reports

Install with the pinned Node/npm versions and `npm ci`. For the fictional demo:

```sh
mkdir -p validation/output
npm run validate:model -- --input validation/fixtures/synthetic.csv --as-of 2026-10-16 --data-kind synthetic --out validation/output/beta-review.json --report-dir validation/output/beta-review
```

Use new paths for each run; existing outputs are refused. Open `dashboard.html` or `report.md` in the report directory locally. Real consented data belongs outside the repository; substitute its private CSV/output paths and `--data-kind real`. Read the full [CSV schema and methodology](../validation/README.md). The default evaluates only the evaluation partition; do not unlock test results until the frozen final comparison. Invalid records block metrics; structural import failures exit without results. Synthetic output cannot establish predictive accuracy.

## Verification and release workflow

Run `npm run verify` for type checking, unit/integration tests, build and desktop/mobile Chromium checks. For the full matrix:

```sh
npx playwright install --with-deps chromium firefox webkit
LAPLORA_CROSS_BROWSER=1 npm run verify
```

The prepared cloud environment has verified selectors in `/workspace/.cache/laplora-browser-env.sh`; source that helper and use `CI=1 npm run verify` for one browser worker. Local report browser tests render the generated HTML directly because managed browsers may block file navigation. They do not require serving or publishing report data. All feedback requests in tests are intercepted.

The suite covers malformed/empty inputs, model arithmetic, CSV import failures, synthetic cases, metrics, train/test boundaries, private CLI outputs, report rendering, feedback success/failure, pricing, desktop/mobile reflow, keyboard use and reduced motion. Automated accessibility checks are useful but do not replace screen-reader or physical-device review. See [Phase 5 verification](PHASE_FIVE_VERIFICATION.md) for actual results and limitations.

Vercel project `laplora` is connected to `SunnyScript-s/laplora` with production branch `main`. The project uses the Vite preset, whose default build is `npm run build` and output is `dist`; no custom command/output override is set. Git-connected branches/PRs create previews; merging to main triggers production deployment. Deployment status and URLs must be verified rather than assumed from a successful push. The earlier README “not connected” statement was stale and has been corrected.

The Phase 2–5 review branches are stacked. Review and merge them in order (#2, #3, #4, then Phase 5), retargeting later PR bases to main as needed. Branch creation/testing does not itself merge or publish those changes to production. Production application files have not changed in these phases, so their public JS bundle should remain identical. A preview proves the Vercel build/deployment path, not empirical model validity or provider inbox delivery.

If release access later fails: confirm the Vercel project's Git connection and production branch in Settings → Git, and the GitHub app's repository access. For a manual deployment use an authorized Vercel login and linked checkout; credentials must stay outside frontend/Git. Do not request or paste tokens in chat. No new credentials are needed for the currently verified connection.

## Before inviting a small usability beta

- Confirm actual feedback receipt and service-side spam/retention settings.
- Review the live site on a physical phone and with keyboard/screen reader; automation used emulated viewports.
- Ask whether users understand that trajectories are hypothetical and the slower–faster range is not a confidence interval.
- Provide the site's feedback button as the issue-reporting path; do not ask for identifying information or actual scores.
- Keep usability findings separate from the consented research protocol. Do not advertise scientific validation, personal prediction accuracy or guaranteed improvement.

No paid service, coefficient change or collection of real student records is required to finish this engineering phase. Empirical validation remains future research.
