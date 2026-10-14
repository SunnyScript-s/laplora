# Laplora progress

## October 14, 2026 — font exploration and capital-L branding

- Applied the founder's requested capital L to the application and static-preview wordmarks: Laplora. Adjusted wordmark tracking for the capitalized spelling.
- Retrieved Stripe, Framer, and Linear public pages and inspected their styles. Reviewed Stripe/Framer landing captures; Linear's navigation and heading CSS were inspectable but its hero remained hidden in the capture. Recorded those limits in docs/DESIGN_REFERENCES.md.
- Initial direct browser TLS trust failed. Used the configured proxy and a certificate-verifying HTTPS request context for reference resources; did not disable verification. No form submissions or account interactions.
- Compared Outfit + Manrope, Space Grotesk + Manrope, and Plus Jakarta Sans in a visual specimen board. Recommended Outfit + Manrope for geometric, optimistic headings with readable UI text.
- Downloaded exact OFL-licensed variable-font packages, verified registry integrity, and retained four local Latin WOFF2 files/licenses for review. No runtime dependency or external font service was added to the application.
- Refreshed the landing, setup, desktop results, and mobile results review images with the proposed pairing and capital-L wordmark.
- Checked all comparison fonts loaded, no local capture errors, and no horizontal overflow at 390px/320px. Type checking, build, and 2 foundation browser runs passed. No engine changes; no unnecessary engine test rerun.
- Updated design/reference documents and README. Original development plan and approved mathematical coefficients are unchanged.
- Local checkpoint: `style: explore Laplora typography and capitalize branding`. No push/deployment.

Current review choice: Option A (Outfit + Manrope) is recommended; B is more technical, C is a cohesive single-family alternative. Full interface implementation still awaits the existing wireframe/design review; this request authorized exploration and capitalization, not an unrelated model/scope change.

## October 14, 2026 — design review checkpoint

- Prepared docs/DESIGN_SYSTEM.md and docs/WIREFRAMES.md for Week 9 review: shared palette/spacing/typography, guided setup, readable glass surfaces, graph semantics, accessibility expectations, and reduced-motion rules.
- Created static landing, baseline setup, desktop results/comparison, and mobile results images in docs/design. Source HTML is a planning artifact with inert controls, not application UI.
- Generated preview paths from the actual approved engine using the documented synthetic 1200 baseline/12-week case. Current and Increased Practice totals display 1240 and 1280; no real student data or research outcome was invented.
- Reviewed all four captured views. Corrected tiny mobile chart labels by giving the static mobile chart its own layout. The captured mobile planning page has no horizontal overflow; this does not establish full application accessibility.
- Browser file navigation was disallowed, so screenshots were rendered through a temporary local HTTP server, which was closed afterward. A prior /tmp setup helper was absent after snapshot restoration; reconstructed it from the saved configuration rather than assuming temporary files persisted.
- Exercised the revised frozen-lockfile setup: npm ci, type checking, all 123 unit tests, and build passed. Earlier full verification also passed the 2 foundation browser tests. No repeated browser run was needed for static planning-document changes.
- Saved updated install_script/start_skill, preserving unrelated configuration. The instructions now include unit verification and the existing V0.1 approval. Publication has not been performed by the agent.
- Local engine commit: 6f7e732; input commit: 6304cc9. Design checkpoint: `docs: prepare Aero wireframes for interface review`. No push or deployment.

### Pending decision

The approved architecture explicitly says “Approve wireframes before visual implementation” (ARCHITECTURE_PROPOSAL.md). The concrete wireframe/design artifacts are ready for that review. After approval or revisions, proceed with the guided interface, engine integration, charting, motion, comparisons, and How It Works. Existing V0.1 model approval remains valid and does not need to be requested again.

## October 14, 2026 — simulation engine and stress testing

- Implemented the approved model in src/model: immutable versioned parameters, stable exponential section math, exact calendar timelines, raw/rounded section-total results, goal markers, and disclosed assumptions.
- Implemented increased-practice and custom scenario helpers, explicit changed fields, descriptive-only explanations, preserved baseline/model/date, and reset through an empty patch.
- Preserved valid below-floor PSAT observations and returned the approved needs-sat-baseline outcome without fabricating scores.
- Full verification passed: TypeScript, 123 unit tests, build, and 2 existing foundation browser runs. The stress grid covers 2,160 profiles inside one test; these are not 2,160 separately counted tests.
- Reviewed zero-time numerical behavior, non-record scenario patches, and warning wording; fixed those issues without changing approved coefficients.
- Wrote docs/MODEL_TEST_REPORT.md. No empirical calibration or prediction accuracy is claimed. Retain model version 0.1.0-experimental; a parameter bump to V0.2 is not justified by structural tests alone.
- Week 6 input and Week 7 engine work are complete. Week 8 structural stress testing is complete, with the version decision recorded. The student interface and comprehensive accessibility checks remain unimplemented/unverified.
- Input commit: 6304cc9. Engine checkpoint: `feat: implement experimental SAT trajectories and scenarios`; see git log for the resulting ID. No push or deployment.

Learning focus: the engine is a pure function of explicit inputs and dates, so identical inputs produce identical results. Numerical consistency and scientific calibration are different forms of evidence.

Next: prepare a concrete Week 9 design/wireframe review; the approved architecture requires wireframe approval before the full interface is implemented.

## October 14, 2026 — approved input engine

- Founder approved the V0.1 input/model/scenario choices, including experimental coefficients, PSAT edge-case coverage, descriptive-only context fields, and study/horizon limits.
- Implemented strict Zod validation, explicit numeric form parsing, assessment-specific score ranges/increments, real calendar dates, injected current dates, and contextual warnings.
- Kept date-only arithmetic independent of timezone offsets and covered leap-day, daylight-saving, and pre-100-year calendar behavior.
- The input-only verification passed 81 tests and TypeScript checking. A later full-suite run also verified the model work described in the next checkpoint.
- Source: src/domain/inputs.ts and src/domain/dates.ts. Tests: tests/unit/inputs.test.ts.
- Added pinned Zod and Vitest dependencies with a lockfile update. npm test now runs unit tests before the production-build/browser checks.
- Local input checkpoint: `feat: add SAT input and calendar validation`. No push or deployment.

Learning focus: a typed number is not automatically a valid score; runtime validation enforces the assessment rules. A calendar date is a day label, not a timestamp that should shift when the timezone changes.

## October 14, 2026 — input/research/model approval checkpoint

### Completed work

- Continued at the founder's request without treating continuation as approval of the mathematical model.
- Prepared Week 2 written deliverables: docs/INPUT_SPECIFICATION.md and docs/USER_FLOW.md, including field roles, assessment-specific validation, dates, historical baselines, study-time budgeting, error recovery, and accessibility.
- Reviewed official common-scale guidance in Fall 2026 SAT/PSAT score guides and score intervals/vertical scale in relevant sections of the digital technical manual.
- Reviewed the May 2025 digital SAT practice report's methods, results, limitations, and appendix, plus the March 2026 student-growth report's relevant methods and limitations. Recorded focused Week 3 evidence and unresolved research questions in docs/GROWTH_RESEARCH.md.
- Prepared Week 4/5 written proposals: docs/MODEL_SPECIFICATION.md and docs/SIMULATION_RULES.md, with explicit parameters, units, illustrative sensitivity ranges, scenario semantics, rounding, and future acceptance tests.
- Calculated synthetic worked examples from the written closed form in a scratch command. Document numbers were checked; this did not implement a production score engine or validate prediction accuracy.
- Linked the new documents from README and updated the architecture checkpoint. The original development plan remains unchanged.

### Lessons and evidence

- SAT and PSAT use a common score scale, with different score floors/ceilings. Scaling PSAT scores by 800/760 is not justified.
- The digital-practice study explicitly reports noncausal estimates. Its associations cannot be awarded as personal points-per-test bonuses.
- Cohort growth ranges, score measurement ranges, and experimental parameter sensitivity answer different questions. Do not label the proposed range as a probability or confidence interval.
- A curve can respect limits and still produce unrealistic long-term results; synthetic arithmetic is not empirical calibration.

### Proposed decisions awaiting founder approval

1. Experimental section-growth model: saturation scale 4 hours/section/week, central rate 0.012 per effective hour, slower/faster cases 0.006/0.018, disclosed equal section allocation with an optional control, and sensitivity-only range wording.
2. Accept/preserve PSAT section scores below 200, but request a scored SAT baseline rather than fabricate an SAT trajectory for them. This explicitly limits simulation coverage and needs an owner decision.
3. Keep prep history/methods/test frequency as transparent context and budget guidance in V0.1, without unvalidated numerical bonuses. Method-only edits leave curves unchanged and must be explained.
4. Proposed input policies include a 40-hour weekly cap, 104-week maximum horizon, baseline-age warnings, and long-horizon warnings. These are product policies, not scientifically validated cutoffs.

### Verification and Git

- Reviewed the written rules against the supplied plan and source excerpts; checked arithmetic examples and internal date/section-total consistency.
- New model/input documents do not mean those milestones are signed off. Input policy and model/scenario approval gates remain pending.
- No application code or dependencies changed in this checkpoint. The previous foundation verification remains 2 passing browser runs, successful type check/build, and an unrun remote CI workflow. No new engine tests are claimed.
- Earlier local commits: b379321 (Week 1 documents) and 5e26b35 (React/TypeScript foundation).
- This checkpoint is recorded with `docs: propose Laplora inputs and mathematical model rules`; use git log for its commit ID. No push or deployment was performed.

### Next step / current blocker

Founder approval is required before production engine implementation under the supplied development instructions. Once the input/model proposal is approved or revised, continue with Week 6 input validation and meaningful automated boundary/date tests, then Week 7 engine implementation. Keep design/launch milestones in sequence and do not imply the public beta exists yet.

## October 14, 2026 — Week 1 product and research

### Approvals and completed work

- Founder approved implementation-with-mentoring and the proposed React/TypeScript architecture. Treat TypeScript as the production language; no Python backend is required by the approved architecture.
- Read official College Board scoring, SAT structure, domain, Bluebook, and My Practice pages. Recorded reviewed sources and facts in docs/SAT_RESEARCH.md.
- Verified SAT section range 200–800 and total range 400–1600; PSAT/NMSQT and PSAT 10 section range 160–760 and total range 320–1520.
- Wrote docs/PRODUCT_SPECIFICATION.md: problem statement, audience, accepted baselines, planned inputs/outputs, exclusions, privacy, credibility, and acceptance criteria.
- Created docs/FUTURE_IDEAS.md from the roadmap, README.md, and AGENTS.md.
- Updated the architecture approval record without changing the original development plan.
- Week 1 product-definition and descriptive scoring-research tasks are complete. Growth-factor studies belong to Week 3 and remain unreviewed.

### What we learned

- College Board's score range describes variation under identical testing conditions; it is not a future-growth confidence interval.
- Bluebook's preview is unscored; full-length practice produces scores and review information.
- Test-specific scale validation is separate from approving a PSAT-to-SAT modeling policy.

### Diagnosis and verification

- Official source retrieval now succeeds with a browser-style User-Agent. Requests with Python's default User-Agent returned 403; no trust or authentication checks were bypassed.
- npm's default home cache is not writable in this cloud sandbox; use a writable cache when installing dependencies.
- Reviewed the product and research documents against the exported plan. The original export remains unchanged.
- No growth coefficients, prediction accuracy, or probabilistic claims have been validated.

### Current work and next steps

- Approved development foundation initialized with React, TypeScript, Vite, pinned dependency versions, a lockfile, a small development page, browser smoke tests, and a CI workflow.
- Added shared color/surface tokens and semantic page structure as a foundation. The full design system and guided interface remain future milestones.
- Type checking and production build passed. Both browser smoke runs passed: desktop Chromium and a mobile Chromium viewport, including keyboard skip-link navigation and horizontal-overflow checks.
- Started the development server and verified actual rendering on desktop and mobile with no JavaScript runtime errors. Reviewed screenshots; replaced an unavailable arrow font glyph with a decorative SVG.
- Exercised the reusable frozen-lockfile installation script: npm ci, type check, and build all passed. Original DEVELOPMENT_PLAN.md remains byte-for-byte unchanged.
- Saved the tested install_script and start_skill in the environment configuration draft. Saving does not publish a snapshot; review/save and publication remain user actions in environment settings.
- Final verification after the icon fix passed: type checking, production build, and 2 browser tests, with no failures or skips.
- Browser checks use the cloud image's system Chromium. Managed-browser installation and the GitHub Actions workflow have not been run here. Full model, results, accessibility, and cross-browser testing remain future work.
- Next product milestone: Week 2 input specification and user flow, including baseline age and PSAT interpretation.
- Final model approval remains required in Weeks 4–5 before engine implementation.
- No push or deployment is authorized.

### Git checkpoint

- `b379321` — `docs: define Laplora V1 product and scoring research`.
- Foundation checkpoint: `chore: initialize Laplora React TypeScript foundation`; use git log for the resulting commit ID.
- Commits use an explicit local Codex identity rather than attributing assistant-written changes to the founder. Existing Git identity configuration was left unchanged.
- The exported plan contains two trailing-space lines; these are preserved intentionally. Whitespace checks for new authored files pass.

## October 14, 2026 — planning checkpoint

### Completed

- Inspected the empty `/workspace/laplora` checkout and verified authenticated Git read access during onboarding. The remote advertised no commits or branches.
- Attempted the original Notion URL; network access returned 403.
- Read the entire supplied development instruction text and the exported Notion plan. The archive contains one Markdown document, with no exported subpages.
- Saved the 20,417-byte exported plan unchanged as DEVELOPMENT_PLAN.md and verified exact byte equality.
- Prepared ARCHITECTURE_PROPOSAL.md with technology tradeoffs, architecture, research approach, tentative equations, approval gates, all 16 milestones, and Git/testing practices.
- Identified the conflict between the plan's anti-outsourcing rule and the request for substantial assistant implementation.
- Saved an environment network draft adding satsuite.collegeboard.org and research.collegeboard.org while preserving the package-manager presets.

### Lessons and decisions

- A bounded section-growth equation can enforce ceilings and diminishing returns, but those properties do not validate its coefficients or predictive accuracy.
- Mathematical correctness, scientific calibration, and usability testing are separate forms of evidence.
- Client-side computation is proposed to avoid storing student scores on a server. Architecture is not approved yet.

### Research and blockers

- All five attempted official College Board pages returned proxy 403 errors. No new external research findings were verified.
- Saved network configuration is a draft only; access needs to be retried after settings are applied. Review/save and publication are handled in environment settings.
- Founder must resolve implementation versus mentor-led workflow and approve architecture before application initialization.
- Python learning versus Python production-engine requirements needs clarification.
- Mathematical coefficients, PSAT handling, baseline-age policy, and uncertainty communication remain open for Weeks 2–5.

### Verification

- Export preservation: byte-for-byte verified.
- Documentation review: checked against the supplied plan and full user request.
- Application tests: unrun; no application exists yet.
- Browser behavior, responsiveness, accessibility, and model accuracy: unverified.

### Git checkpoint

- Planning files are uncommitted in the existing checkout.
- No commits, pushes, branches, releases, or application scaffolding were created in this session.

### Next steps

1. Obtain founder direction on the identified conflict and proposed architecture.
2. Retry official sources after network settings are applied, or read source documents supplied by the founder.
3. Complete Week 1 product specification and source-backed scoring research.
4. Follow the plan's input, research, and written-model gates before engine implementation.
