# Contributing to Laplora

Start with [the development plan](DEVELOPMENT_PLAN.md), [project progress](PROGRESS.md), [product specification](docs/PRODUCT_SPECIFICATION.md), and [architecture](ARCHITECTURE.md).

## Project decisions

- Santiago Harbison owns the project and reviews major product, architecture, and mathematical decisions. Explain substantive changes clearly and include the reasoning needed to understand them.
- The client-side React/TypeScript architecture and V0.1 input/model/scenario rules were approved on October 14, 2026. Existing decisions do not need repeated approval; substantive model or scope changes do.
- V0.1 uses section saturation 4, rates 0.006/0.012/0.018, documented PSAT below-floor handling, descriptive-only preparation context, and the limits in the input specification.
- The current visual direction uses vibrant orange, amber glass, and orbital motion. The header uses Santiago’s supplied gradient logo; Disket Mono supplies headings, action buttons, and score highlights; Manrope supplies body, form, and chart text. Preserve the supplied font licenses and provenance.
- Keep the capital L in Laplora's source text and the small shared footer credit “Made by Santiago Harbison”. The manual footer motion button was removed by design; preserve system reduced-motion support.

- The pricing view is authorized as a presentation of planned monetization: Free $0, Pro $4.99/month, and a potential $9.99 one-time 90-day pass. Keep paid options Coming Soon and existing free comparisons available. Actual accounts, entitlements, billing, persistence, and premium features require subsequent implementation scope.

- Santiago approved Phase 1 and authorized Phase 2 on October 16, 2026. Phase 2 is limited to local validation tooling on `feat/model-validation-phase-two`. Preserve the production model and website. Santiago subsequently authorized Phase 3: private local dashboards and Markdown reports on `feat/validation-reports-phase-three`. Santiago authorized Phase 4 research review and the model-validation roadmap on October 16, 2026, on `docs/model-validation-phase-four`. Santiago subsequently authorized Phase 5 verification, privacy, documentation and deployment checks on `feat/beta-release-phase-five`. Real-data collection and coefficient changes still require separate approval.

## Implementation standards

- Preserve DEVELOPMENT_PLAN.md as the original source. Record subsequent decisions separately.
- Keep the simulation engine pure and separate from React. Inject dates and parameters; preserve section-total consistency and valid score limits.
- Distinguish official scoring facts, empirical findings, and experimental assumptions. Cite sources and never claim unverified accuracy, calibration, or guarantees.
- Keep student inputs in tab memory. Accounts, databases, identifying fields, telemetry, and frontend secrets require an agreed product and privacy need.
- Use shared design tokens, semantic controls, visible focus, readable contrast, chart alternatives, and reduced-motion support.
- Run relevant behavioral checks and record their actual outcomes. Tests should verify meaningful behavior rather than duplicate implementation.
- Update PROGRESS.md with decisions, lessons, evidence, failures, tests, and next steps at meaningful checkpoints.

## Local development

Use Node 24.19.0, npm 11.9.0, and the committed lockfile. Run `npm ci`, then `npm run dev`. The development server listens on port 5173; browser tests use a separate production preview on port 4173. Keep a requested live preview running, and restart it after a new environment session when necessary.

Run `npm run verify` for type checking, unit tests, build, and browser tests. In the prepared cloud environment, use `npm ci --cache /tmp/laplora-npm-cache` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify`. See README.md for additional browsers and their environment requirements.

Regenerate the downloadable interactive preview after application changes with `npm run build:preview`. It embeds the compiled app, styles, fonts, favicon, and font notices.

## Git and dependencies

Use the existing checkout; create an additional worktree only when requested. Make focused commits with accurate attribution and timestamps. Preserve existing history and unrelated changes. Push authorized work without force-pushing; deployment and releases need a separate decision.

Add dependencies when an implementation milestone needs them. Use `npm ci` for reproducible setup, and make intentional package changes through the manifest and lockfile together.
