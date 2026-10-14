# Laplora

Laplora is an experimental SAT score-growth simulation project. It will help students explore how different preparation plans change modeled Math and Reading & Writing trajectories under explicit assumptions. It is independent of College Board and does not guarantee SAT results.

## Project status

The founder approved the React/TypeScript architecture, implementation-with-mentoring workflow, and V0.1 input/model/scenario choices on October 14, 2026. Product/research documentation, input validation, and the pure experimental score engine are implemented.

The React/Vite page is still a development foundation; the score engine is not connected to a student interface yet. Charting and animation libraries will be introduced with their milestones.

The founder selected Outfit headings/wordmark with Manrope body text and controls (Option A). These licensed variable fonts are bundled locally, with system fallbacks and no external font service.

## Development

Use Node **24.19.0** (pinned in `.node-version`) and npm **11.9.0**. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

The server uses loopback port 5173 and fails clearly if the port is occupied. `npm run preview` serves the production build on port 4173. In this cloud sandbox, use `npm ci --cache /tmp/laplora-npm-cache` because the default home cache is not writable. No application environment variables or credentials are required.

## Verification

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

`npm test` runs Vitest input/model/scenario tests, builds the application, and runs the foundation browser test on desktop and mobile Chromium viewports. `npm run test:unit` and `npm run test:e2e` run those parts separately. `npm run verify` includes type checking. For the cloud machine's existing browser, use:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify
```

Unit tests verify engine contracts and structural behavior, including a 2,160-profile stress grid. Browser tests currently check the foundation's startup, keyboard navigation, and viewport fit. These checks do not establish prediction accuracy. GitHub Actions contains the same verification flow; its remote run has not been exercised yet.

## Project references

- [Original 16-week development plan](DEVELOPMENT_PLAN.md)
- [Architecture and approval record](ARCHITECTURE_PROPOSAL.md)
- [Product specification](docs/PRODUCT_SPECIFICATION.md)
- [Official SAT scoring research](docs/SAT_RESEARCH.md)
- [Proposed input rules](docs/INPUT_SPECIFICATION.md) and [guided user flow](docs/USER_FLOW.md)
- [Preparation-growth research](docs/GROWTH_RESEARCH.md)
- [Model V0.1 proposal](docs/MODEL_SPECIFICATION.md) and [simulation rules](docs/SIMULATION_RULES.md)
- [Engine test report](docs/MODEL_TEST_REPORT.md)
- [Proposed design system](docs/DESIGN_SYSTEM.md) and [wireframe review](docs/WIREFRAMES.md)
- [Website/font exploration](docs/DESIGN_REFERENCES.md) and [typeface comparison](docs/design/typography-comparison.png)
- [Future ideas](docs/FUTURE_IDEAS.md)
- [Progress and next steps](PROGRESS.md)
- [Contributor guidance](AGENTS.md)

The public beta target in the plan is February 2, 2027. Read PROGRESS.md for actual completion status.

The approved model uses explicitly experimental coefficients, conservative below-SAT-floor PSAT handling, and descriptive rather than numerical treatment of preparation history/methods/test frequency. Static desktop/mobile wireframes are ready for the design review required by the approved architecture. They are planning artifacts, not a working student interface.
