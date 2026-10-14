# Laplora

Laplora is an experimental SAT score-growth simulation project. It will help students explore how different preparation plans change modeled Math and Reading & Writing trajectories under explicit assumptions. It is independent of College Board and does not guarantee SAT results.

## Project status

The founder approved the React/TypeScript client-side architecture and implementation-with-mentoring workflow on October 14, 2026. Week 1 product-definition and official scoring research are documented. The mathematical engine is not yet approved or implemented.

The React/Vite development foundation runs a small development page. It does not yet provide a working score simulator. Charting, model validation, and animation libraries will be introduced when their milestones need them.

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

`npm test` builds the application and runs the foundation browser smoke test on desktop and mobile Chromium viewports. `npm run verify` combines type checking and those tests. For the cloud machine's existing browser, use:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify
```

The tests check startup, keyboard navigation, and viewport fit. They do not validate a simulation engine, which is not implemented yet. GitHub Actions contains the same verification flow; its remote run has not been exercised yet.

## Project references

- [Original 16-week development plan](DEVELOPMENT_PLAN.md)
- [Architecture and approval record](ARCHITECTURE_PROPOSAL.md)
- [Product specification](docs/PRODUCT_SPECIFICATION.md)
- [Official SAT scoring research](docs/SAT_RESEARCH.md)
- [Proposed input rules](docs/INPUT_SPECIFICATION.md) and [guided user flow](docs/USER_FLOW.md)
- [Preparation-growth research](docs/GROWTH_RESEARCH.md)
- [Model V0.1 proposal](docs/MODEL_SPECIFICATION.md) and [simulation rules](docs/SIMULATION_RULES.md)
- [Future ideas](docs/FUTURE_IDEAS.md)
- [Progress and next steps](PROGRESS.md)
- [Contributor guidance](AGENTS.md)

The public beta target in the plan is February 2, 2027. Read PROGRESS.md for actual completion status.

The written input/model proposals are ready for founder review. They contain explicitly experimental coefficients and two important policy choices: below-SAT-floor PSAT handling, and descriptive rather than numerical treatment of preparation history/methods/test frequency. The score engine remains unimplemented pending that approval.
