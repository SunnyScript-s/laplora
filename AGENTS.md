# Working on Laplora

- Read DEVELOPMENT_PLAN.md, PROGRESS.md, and docs/PRODUCT_SPECIFICATION.md before changing the project.
- The founder approved implementation-with-mentoring and the React/TypeScript client-side architecture on October 14, 2026. Explain substantive changes and concepts in student-friendly language.
- The founder approved the V0.1 input/model/scenario choices on October 14, 2026: section saturation 4, rates 0.006/0.012/0.018, PSAT below-floor handling, descriptive-only context fields, and input limits. Do not ask for those approvals again; future substantive model changes still need approval.
- The founder selected typography option A and approved the proposed landing/setup/results layouts on October 14, 2026. Use Outfit headings/wordmark and Manrope body/controls with a capital L in Laplora. The guided interface, results, comparisons, background polish, and reduced-motion-aware animations are authorized; do not request these approvals again.
- The founder subsequently requested a vibrant orange DORfic-inspired theme and spinning background motion. This supersedes the earlier aqua/green color direction while preserving the approved layouts, typography, and model. Keep motion pausable and respect reduced motion. Accessibility and cross-browser review are authorized.
- Follow the plan's milestones. Complete written input/model rules before coding the engine. Obtain founder approval for final mathematical equations/parameters, major architecture changes, and scope expansion. Existing architecture approval does not approve the model.
- Preserve DEVELOPMENT_PLAN.md as the supplied source; record decisions and deviations in separate documents.
- Use the existing isolated checkout. Do not create a Git worktree unless the user asks.
- Keep the mathematical engine pure and separate from React. Inject dates/parameters; preserve section-total consistency and valid limits.
- Keep official facts, empirical findings, and experimental assumptions distinct. Cite reviewed sources. Never invent calibration, accuracy, or guarantees.
- Minimize student data. No account/database, identifying fields, score telemetry, or frontend secrets without an approved requirement.
- Maintain shared design tokens, semantic controls, visible focus, chart alternatives, readable contrast, and reduced-motion behavior.
- Run relevant behavioral tests and report actual outcomes. Do not claim unrun browser or model tests passed. Avoid tests that merely copy implementation.
- Update PROGRESS.md with decisions, lessons, evidence, tests, blockers, commits, and next steps at meaningful checkpoints.
- Commit genuine progress with accurate attribution and timestamps. Push only when authorized; never force-push or rewrite history without approval.
- Add dependencies when the current milestone needs them. Preserve the lockfile during setup with npm ci.
- Use Node 24.19.0 and npm 11.9.0. In this cloud sandbox, install with `npm ci --cache /tmp/laplora-npm-cache`; verify with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify`.
- `npm run dev` binds to loopback port 5173; browser tests build and use production preview on port 4173. Do not assume live processes survive an environment snapshot.
