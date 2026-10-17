# Laplora

Laplora is an experimental SAT score-growth simulation project. It will help students explore how different preparation plans change modeled Math and Reading & Writing trajectories under explicit assumptions. It is independent of College Board and does not guarantee SAT results.

## Live website

Production: **https://laplora.vercel.app** (Vercel project `laplora`). The initial production deployment uses the existing Vite build and `dist` output.

Verified October 16, 2026: Vercel is connected to `SunnyScript-s/laplora`, with `main` as the production branch. Git pushes create previews; merging approved work into main triggers production deployment. The project uses the Vite preset and default `dist` output. See [release operations](docs/BETA_RELEASE_CHECKLIST.md) and [verification evidence](docs/PHASE_FIVE_VERIFICATION.md).

## Project status

Laplora uses React and TypeScript with a pure, versioned simulation engine. Product and research documentation, input validation, and the experimental V0.1 score model are implemented.

The React/Vite app uses a vibrant orange DORfic-inspired design and includes guided baseline/goal/study setup, review, total and section trajectories, keyboard/touch timeline exploration, a score table, Increased Practice and custom comparisons, and How It Works. Warm ivory/orange backgrounds, a glossy rotating orbit, chart/step entrances, hover feedback and system reduced-motion support provide the visual polish. Native SVG and CSS support these features without new runtime libraries.

The display typeface is **Disket Mono**. Its Regular/Bold webfonts serve branding, headings, action buttons, and score highlights; Manrope keeps paragraphs, forms, and chart labels readable. Fonts are bundled locally with system fallbacks and no external font service. The included EULA permits commercial and generated webfont use; see [the typography checkpoint](docs/DISKET_TYPOGRAPHY_REVIEW.md).

## Anonymous feedback

The **Beta** badge beside the logo opens guidance on using Laplora, interpreting experimental results, sharing useful feedback, and privacy. The beta page preserves the current setup/results state when visited through in-app navigation.

The footer’s **Send Feedback** button opens a form with four categories (Bug Report, Feature Suggestion, Confusing Experience, General Feedback), a description, optional 1–5 usefulness rating, and optional manually entered browser/device text. It sends only those selected fields to the owner-provided Formspree endpoint `https://formspree.io/f/mdeaydqy`. No account, name, email, scores, study plan, page URL, cookies, or automatic device diagnostics are attached. Visitors are asked to omit personal information and actual scores. Formspree and Vercel may process connection metadata such as IP addresses.

Review submissions in the private Formspree dashboard. The endpoint is public configuration in `src/app/feedbackValidation.ts`, not an API key. Manage spam settings, allowed domains, retention/deletion, and quotas in Formspree; no new provider account or paid service is required. The UI validates categories, trimmed message length (10–2,000), rating (1–5), and device text (up to 120). A hidden trap, pending-submit lock, and 30-second in-tab cooldown after success discourage basic spam; these client-side measures can be bypassed and do not replace Formspree’s service-side controls.

Failed drafts remain in tab memory; success requires Formspree’s JSON acknowledgment. Provider responses are mocked in automated tests, so the owner should confirm an actual message in the dashboard before inviting testers. The downloadable preview needs internet access to send feedback. See [Phase 1 review and beta checklist](docs/BETA_PHASE_ONE.md). Phases 2–4 add local validation, private reports and a research roadmap; they do not collect real student data.

## Laplora Pro and pricing

Choose **Explore Laplora Pro** on the homepage or **Laplora Pro** in the navigation to open the pricing view. The existing free simulator, current-plan comparison, DORfic design, and animations remain available without signup or a paywall.

| Option | Price | Availability |
| --- | --- | --- |
| Laplora Free | $0 | Available now; unlimited basic simulations, one at a time |
| Laplora Pro | $4.99/month, planned | Coming Soon |
| 90-day SAT Prep Pass | $9.99 one-time, potential alternative | Coming Soon; under consideration |

Planned Pro features include saved simulation history, actual practice-score tracking, multiple saved strategy comparisons, advanced analytics, personalized study-plan adjustments, and exportable reports. These features are not implemented. There is no checkout, subscription activation, paid signup, or payment integration.

Pricing is part of the existing in-app navigation, not a separate URL route. Visiting pricing or How It Works preserves the active setup step and comparison state. Use the in-app Back button or the Free card to return. Refresh still clears inputs.

The product catalog in `src/product/plans.ts` keeps stable tier/feature/offer identifiers and planned prices separate from the UI and score engine. See [monetization design and future integration](docs/MONETIZATION.md).

## Development

Use Node **24.19.0** (pinned in `.node-version`) and npm **11.9.0**. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

The optional Python study planner needs the API running in a second terminal (`npm run dev:api`, Python 3.12). Vite proxies `/api` requests to it. Python uses only the standard library; there is no database or environment configuration.

The development server listens on port 5173 on all interfaces for preview access and fails clearly if that port is occupied. Keep it running while viewing the app; live processes do not survive a cloud snapshot. `npm run preview` serves the production build on loopback port 4173. In this cloud sandbox, use `npm ci --cache /tmp/laplora-npm-cache` because the default home cache is not writable. No application environment variables or credentials are required.

If the browser panel cannot reach the cloud server, [download the interactive preview](docs/design/interactive-preview.html) and open it in a browser. It includes the actual app, styles, fonts, favicon, and font notices in one file. Refreshing clears its inputs just as in the live app. Rebuild it after application changes with:

```sh
npm run build:preview
```

The background combines amber glass shapes, curved ribbons, and orbital motion. Disket Mono is installed in both the live app and downloadable preview. See [the reference and preview checkpoint](docs/REFERENCE_PREVIEW_REVIEW.md) for the earlier preview diagnosis.

## Verification

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

`npm test` runs Vitest input/model/scenario tests, builds the application, and runs the browser suite on desktop and mobile Chromium viewports. `npm run test:unit` and `npm run test:e2e` run those parts separately. `npm run verify` includes type checking. For the cloud machine's existing browser, use:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify
```

Unit tests verify engine contracts and structural behavior, including a 2,160-profile stress grid. Browser tests cover setup/results/comparison flows, planner request privacy, validation, keyboard chart exploration, data consistency, in-memory privacy, reduced motion, automated accessibility scans, and 320px/200% text reflow. The default suite runs 44 desktop/mobile Chromium cases. Optional cross-browser projects add Firefox desktop and WebKit desktop/mobile (110 total runs). These checks do not establish prediction accuracy or full accessibility compliance. GitHub Actions is configured for all three engines and runs one browser worker at a time to avoid resource contention on shared runners. Local runs default to two workers. See [workflow runs](https://github.com/SunnyScript-s/laplora/actions) for current remote verification status.

On a machine with browser dependencies installed:

```sh
npx playwright install --with-deps chromium firefox webkit
LAPLORA_CROSS_BROWSER=1 npm run verify
```

In the prepared cloud environment, the browser binaries and locally extracted WebKit libraries are under /workspace/.cache. To run the full suite with the verified cloud selectors:

```sh
source /workspace/.cache/laplora-browser-env.sh
npm run test:e2e
```

These selectors apply only to test processes; they are not application variables or credentials. See [the orange theme and accessibility report](docs/ORANGE_THEME_REVIEW.md) for environment workarounds and verification limits.

## Project references

- [Original 16-week development plan](DEVELOPMENT_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- [Product specification](docs/PRODUCT_SPECIFICATION.md)
- [Official SAT scoring research](docs/SAT_RESEARCH.md)
- [Input rules](docs/INPUT_SPECIFICATION.md) and [guided user flow](docs/USER_FLOW.md)
- [Preparation-growth research](docs/GROWTH_RESEARCH.md)
- [Model V0.1 specification](docs/MODEL_SPECIFICATION.md) and [simulation rules](docs/SIMULATION_RULES.md)
- [Engine test report](docs/MODEL_TEST_REPORT.md)
- [Interface verification and implementation notes](docs/INTERFACE_TEST_REPORT.md)
- [Design system](docs/DESIGN_SYSTEM.md) and [wireframe review](docs/WIREFRAMES.md)
- [Website/font exploration](docs/DESIGN_REFERENCES.md) and [typeface comparison](docs/design/typography-comparison.png)
- [Future ideas](docs/FUTURE_IDEAS.md)
- [Progress and next steps](PROGRESS.md)
- [Contributor guidance](CONTRIBUTING.md)

The public beta target in the plan is February 2, 2027. Read PROGRESS.md for actual completion status.

The approved model uses explicitly experimental coefficients, conservative below-SAT-floor PSAT handling, and descriptive rather than numerical treatment of preparation history/methods/test frequency. Simulation inputs remain in this tab’s memory and clear on refresh; no account, score telemetry, or server-side score storage is used. The optional Python planner receives only scheduling preferences and returns a transient calendar; it rejects scores and goals and does not persist requests or plans. Optional feedback messages are sent separately to Formspree. The site is deployed on Vercel; physical-device/screen-reader review and actual beta feedback remain separate from automated checks.

## Phase 2: local model validation

See [validation/README.md](validation/README.md) for the CSV schema, privacy requirements, participant splits, metrics and limitations. Run the fictional example with:

```sh
npm run validate:model -- --input validation/fixtures/synthetic.csv --as-of 2026-10-16 --data-kind synthetic --out validation/output/demo.json
```

Use a new output filename for every run. Real datasets and results belong outside the repository. This local tool does not change the website or validate predictive accuracy. Phase 3 adds offline charts and Markdown reports with `--report-dir validation/output/review` (choose a new directory). See the validation guide for private handling and usage.

## Phase 4: evidence and model-validation roadmap

The [research review](docs/VALIDATION_RESEARCH_REVIEW.md) distinguishes digital practice associations, historical retaking evidence, measurement reliability and cohort growth. The [model-validation roadmap](docs/MODEL_VALIDATION_ROADMAP.md) defines proposed data-quality standards, participant separation, baseline comparisons, future calibration/uncertainty research and evidence required before an accuracy claim. This phase changes documentation only; no coefficients were fitted or changed and no real student data was collected.

## Phase 5: verification and beta operations

See the [release/privacy guide](docs/BETA_RELEASE_CHECKLIST.md) for feedback review, safe local data handling, validation/report commands, Git-to-Vercel deployment and beta readiness. [Phase 5 verification](docs/PHASE_FIVE_VERIFICATION.md) records actual test/deployment results and outstanding owner-side checks. Predictive accuracy remains unverified.
