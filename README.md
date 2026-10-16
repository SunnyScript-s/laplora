# Laplora

Laplora is an experimental SAT score-growth simulation project. It will help students explore how different preparation plans change modeled Math and Reading & Writing trajectories under explicit assumptions. It is independent of College Board and does not guarantee SAT results.

## Live website

Production: **https://laplora.vercel.app** (Vercel project `laplora`). The initial production deployment uses the existing Vite build and `dist` output.

Automatic GitHub deployments are not connected yet: Vercel requires the owner to add a GitHub login connection, then connect `SunnyScript-s/laplora` with production branch `main`. Until connected, publish updates explicitly with `vercel deploy --prod` from an authenticated, linked checkout.

## Project status

Laplora uses React and TypeScript with a pure, versioned simulation engine. Product and research documentation, input validation, and the experimental V0.1 score model are implemented.

The React/Vite app uses a vibrant orange DORfic-inspired design and includes guided baseline/goal/study setup, review, total and section trajectories, keyboard/touch timeline exploration, a score table, Increased Practice and custom comparisons, and How It Works. Warm ivory/orange backgrounds, a glossy rotating orbit, chart/step entrances, hover feedback and system reduced-motion support provide the visual polish. Native SVG and CSS support these features without new runtime libraries.

The display typeface is **Disket Mono**. Its Regular/Bold webfonts serve branding, headings, action buttons, and score highlights; Manrope keeps paragraphs, forms, and chart labels readable. Fonts are bundled locally with system fallbacks and no external font service. The included EULA permits commercial and generated webfont use; see [the typography checkpoint](docs/DISKET_TYPOGRAPHY_REVIEW.md).

## Anonymous feedback

The footer’s **Send Feedback** button opens an in-page form with only a feedback type and message. It sends those two fields directly to the owner-selected Formspree endpoint `https://formspree.io/f/mdeaydqy` after an explicit submission. No email, name, scores, study plans, page URL, cookies, or diagnostic attachments are added. Visitors are asked not to include personal information or actual scores in their message. Formspree and hosting infrastructure may process IP addresses and other connection metadata.

Review submissions privately in the Formspree dashboard. Manage retention, deletion, spam settings, and quotas there. The form retains failed drafts in tab memory and confirms success only after Formspree acknowledges receipt. Live provider delivery and inbox receipt are separate from the browser tests, which mock provider responses. The standalone preview also needs an internet connection to send feedback.

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

Unit tests verify engine contracts and structural behavior, including a 2,160-profile stress grid. Browser tests cover setup/results/comparison flows, validation, keyboard chart exploration, data consistency, in-memory privacy, reduced motion, automated accessibility scans, and 320px/200% text reflow. The default suite runs 30 desktop/mobile Chromium cases. Optional cross-browser projects add Firefox desktop and WebKit desktop/mobile (75 total runs). These checks do not establish prediction accuracy or full accessibility compliance. GitHub Actions is configured for all three engines and runs one browser worker at a time to avoid resource contention on shared runners. Local runs default to two workers. See [workflow runs](https://github.com/SunnyScript-s/laplora/actions) for current remote verification status.

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

The approved model uses explicitly experimental coefficients, conservative below-SAT-floor PSAT handling, and descriptive rather than numerical treatment of preparation history/methods/test frequency. Inputs remain in this tab’s memory and clear on refresh; no account, score telemetry, or server-side score storage is used. Optional feedback messages are sent separately to Formspree. The site is deployed on Vercel; private student beta and broader accessibility/cross-browser review remain future work.
