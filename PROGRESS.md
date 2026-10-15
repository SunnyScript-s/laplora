# Laplora progress

## October 15, 2026 — supplied header logo

- Replaced the shared header text with Santiago’s supplied orange-to-yellow PNG logo. Preserved the original image bytes and transparency; an SVG viewport frames the artwork within its padded canvas. The logo remains a keyboard-accessible home button, with responsive 180–220px sizing.
- Embedded the local logo in the application bundle so the regenerated downloadable preview remains self-contained. Reviewed desktop/mobile captures in docs/design/logo-home-*.png.
- Verification passed: TypeScript, production/standalone builds, and all six existing Chromium desktop/mobile foundation and accessibility cases, including 320px reflow with enlarged text. Independently confirmed the embedded image decodes at its original dimensions, layouts fit, and keyboard home navigation works on both screen sizes with zero external asset requests. No model or billing behavior changed; the full unit/cross-browser suites were not rerun for this asset/layout change.

## October 15, 2026 — complete Pro verification and CI concurrency

- Confirmed the full monetization presentation is already on GitHub main in d3772cd. The original hosted verification run completed with 123 passing unit tests and 57 passing browser cases; eight longer WebKit desktop/mobile flows exceeded the existing 30-second test timeout while two workers ran together. The failures included pricing-state retention and existing simulator flows.
- Configured Playwright to use one browser worker when CI is set, retaining two workers for ordinary local runs. No retries, assertions, timeouts, application animations, paid availability, or product behavior were changed.
- Ran the complete configured suite locally with CI=1 and the prepared cross-browser environment: TypeScript, production build, all 123 unit tests, and all 65 browser cases passed. The browser suite completed in 5.3 minutes with no failures or skips. This supersedes the earlier partial 35-case verification checkpoint.
- Restarted the live development preview after the environment transition and verified the homepage message, Pro pricing, Coming Soon label, and Free entry in an actual browser. The server remains running. The downloadable preview already contains the unchanged application code.
- Updated README with CI worker behavior and the monetization verification record. Checkpoint: `ci: serialize browser checks on shared runners`. Hosted results remain inspectable in the repository's GitHub Actions workflow runs.

## October 15, 2026 — Laplora Pro and planned pricing

- Added a pricing view with Laplora Free ($0), planned Laplora Pro ($4.99/month), and a potential one-time 90-day SAT Prep Pass ($9.99). Both paid options explicitly say Coming Soon and have no purchase controls. The six requested Pro features are presented as planned, not implemented.
- Added a subordinate Explore Laplora Pro homepage button and a shared navigation entry while preserving “Start from an existing score. No quiz. No account.” Existing Free simulation, graphs, section estimates, and current-plan-versus-one-alternative comparison remain available. Planned Pro comparison means several saved strategies together.
- Reused shared glass panels, controls, type, color tokens, background artwork, and entrance/reduced-motion behavior. Added only local pricing layouts for the two cards, potential pass, and accessible feature table. No global theme, model, input, runtime dependency, or license changes.
- Separated product definitions into src/product/plans.ts with stable feature/tier/offer IDs, availability, USD prices in cents, and billing/duration metadata. This is catalog data, not account state or an entitlement mechanism. Actual accounts, storage, billing, analytics, adjustments, and exports remain future implementation work.
- Generalized informational navigation to keep setup/results mounted while pricing or How It Works is displayed. Verified form step/values and free comparison/chart state survive navigation between these views and back. The Free card starts or resumes the simulator.
- Verification passed: TypeScript, production build, all 123 unit tests, all 26 Chromium desktop/mobile browser cases (49.8 seconds), and nine additional pricing cases across Firefox desktop and WebKit desktop/mobile (47.9 seconds). All 35 browser cases passed with no skips. The configured complete cross-browser suite now contains 65 cases; this checkpoint does not claim all 65 were rerun.
- New behavioral checks cover prices/status, unavailable paid purchase actions, anonymous Free entry, no external requests or storage, retained setup/comparison state, keyboard focus, axe checks, reduced motion, and 320px/200% text reflow. Reviewed desktop/mobile homepage and pricing captures in docs/design/pro-*.png. Physical-device/screen-reader review remains separate.
- Regenerated docs/design/interactive-preview.html. Independently verified its pricing view and Free entry while allowing only the initial HTML request: no dependent requests or runtime errors. Restarted the requested live development server and confirmed actual desktop/mobile rendering; it remains running.
- Updated README, contributor/product/design/architecture records, and docs/MONETIZATION.md with the exact boundary and future service integration steps. All 45 local links checked in the affected core documents resolve. Original DEVELOPMENT_PLAN.md retains SHA-256 f3890fc7a12a57ce7accb2ccff081a3a98b4caad7434741afdea440fae061af7.
- Saved current environment startup guidance and suite counts, preserving unrelated configuration. Saving is not configuration publication or fresh-task restoration. Checkpoint: `feat: add Laplora Pro pricing and planned tier catalog`; publish source changes to GitHub main under the existing authorization. No site deployment or payment activation.
- Learning: product tiers describe intended features, while future server-side ownership and entitlement checks must enforce paid access. Keeping the catalog separate from React and the pure score engine allows those services to be added without mixing billing into simulation logic.

## October 15, 2026 — repository documentation cleanup

- Standardized contributor guidance as CONTRIBUTING.md and architecture documentation as ARCHITECTURE.md. The architecture now describes the implemented React/TypeScript, native SVG, CSS, and Zod system instead of earlier optional dependencies.
- Simplified README and process wording, retained learning exercises as project documentation, and updated references to the renamed files. Development history remains a record of actual decisions and verification outcomes.
- Checked all 65 local links in the affected documents and new guidance files; all resolved. Whitespace checks passed. This checkpoint changes documentation only, so application tests and preview generation were not repeated.
- Preserved Git authorship/history, research citations, font license files, and the byte-exact original development plan. Updated the saved environment startup guidance to read the new contributor filename; configuration publication remains separate.
- The preceding 14 development commits were uploaded to GitHub main at 8911a3c. This cleanup is recorded as `docs: standardize project documentation`. Beta preparation, physical-device/screen-reader review, and performance measurements remain the next product milestones.

## October 15, 2026 — founder credit and footer cleanup

- Removed the footer Pause/Resume motion button and its unused React state/CSS at the founder's explicit request. System reduced-motion handling remains active. Updated the existing motion test to exercise the supported system preference and complete interactive results.
- Added the small shared footer credit “Made by Santiago Harbison”, visible throughout the site. Updated current contributor/design/product records and regenerated the standalone interactive preview.
- TypeScript, production/standalone build, and all four targeted Chromium desktop/mobile reduced-motion and 320px/200% text reflow checks passed. Verified credit text, absent motion button, and footer fit at 1440/390/320px; reviewed docs/design/footer-credit-desktop.png. No model or full-suite rerun was needed for this footer change.
- The initial live-preview check found port 5173 unavailable after the session transition. Restarted npm run dev and verified the actual browser-rendered footer at all three widths; left the requested preview running.
- Saved updated environment startup guidance while preserving unrelated configuration; the saved draft still requires publication in environment settings. Local checkpoint: `style: add founder credit and simplify footer`. No push/deployment.

## October 15, 2026 — Disket Mono typography

- Founder replaced the Homizio Nova request with the uploaded Disket Rostype.zip. Inspected its two font binaries and full PDF EULA. The Mariano Diez Free Font EULA (September 30, 2019), clauses a/c, explicitly permits commercial use and generated webfonts on websites; no separate webfont prerequisite remains for this choice.
- Converted the complete Regular/Bold fonts to WOFF2 with system Python fontTools/Brotli, preserving glyphs/outlines. Retained the full EULA and source/output SHA-256 provenance in runtime font notices. Original desktop binaries/archive are not added to the repository; historical font-comparison assets remain intact.
- Installed Disket Mono for branding, headings, primary/secondary actions, and score highlights; retained Manrope for explanations, form text, text links, and chart annotations. Used real 400/700 weights, adjusted heading scale/spacing, and kept semantic mixed-case Laplora text. Disket's glyph design appears uppercase without a CSS uppercase transform.
- TypeScript and production/standalone builds passed. Updated the existing font-loading browser check to verify both supplied faces load and the heading actually uses Disket Mono.
- Initial full five-project browser run: 43 passed, 7 failed. Five failures exposed the wider wordmark clipping at 320px with 200% text; fixed the narrow wordmark sizing/wrapping. Two WebKit desktop flow tests reached the 30-second timeout with concurrent workers. Process inspection found the leftover WebKit entries were already-exited zombies, so there was no live orphan cleanup to perform. All seven affected cases passed on a single-worker rerun (54.9 seconds), with original assertions and timeouts intact; no tests skipped. This is 50 cases covered through the initial run plus affected reruns, not a claim of a second clean full-suite run.
- Verified the running development app renders the new fonts at desktop/mobile sizes with HTTP 200 and no runtime errors; left the requested server running. Regenerated the standalone interactive preview and exercised the full synthetic flow while allowing only its initial HTML request: embedded fonts loaded, central result 1240, no dependent requests or runtime errors.
- Reviewed desktop/mobile landing and mobile results captures under docs/design/disket-*.png. Updated current contributor/design/README guidance and docs/DISKET_TYPOGRAPHY_REVIEW.md; marked the earlier Homizio prerequisite superseded. Saved the revised environment start_skill, preserving installation and unrelated settings; saving requires publication in environment settings and does not prove fresh-task restoration.
- Original DEVELOPMENT_PLAN.md hash remains f3890fc7a12a57ce7accb2ccff081a3a98b4caad7434741afdea440fae061af7. No model/input changes or unnecessary engine test rerun. Local checkpoint: `style: apply Disket Mono typography and responsive sizing`. No push/deployment.
- Learning: display fonts have different width/weight characteristics; pairing a distinctive heading face with readable body text needs actual font-loading and enlarged-text checks, beyond swapping a font-family name. Next: private-beta preparation, physical-device/screen-reader review, and performance work already identified in the plan.

## October 14, 2026 — glass reference and working preview

- Founder supplied a specific Pinterest image and requested a closer amber-glass/ribbon theme, a blank-preview repair, and Homizio Nova by Álvaro Thomáz.
- Inspected the image and implemented original local SVG artwork with glossy amber bubbles, yellow/orange curved ribbons, white orbital lines, reflective highlights, and slow bubble motion alongside the pausable rotating ring. No Pinterest image is copied into the app or loaded by students' browsers.
- Found no running development server. Restarted it, changed its dev bind to 0.0.0.0:5173, and verified the landing actually rendered with HTTP 200 and no runtime/request errors. Intentionally kept that live preview running. Browser-panel opening returned queued; desktop-to-cloud routing is not verified and no callable port forwarding is available.
- Added scripts/build-preview.mjs and npm run build:preview to generate docs/design/interactive-preview.html with the actual app, styles, fonts, favicon, and license notices embedded. Independently ran the full synthetic student flow while permitting only the initial HTML request: known 1240 result, no dependent network/asset requests, and no runtime errors. This supplies a downloadable fallback when a web pane cannot reach the server.
- TypeScript and production/standalone build passed. Of 15 targeted landing/motion/accessibility runs across five browser projects, 14 passed initially; the WebKit desktop nine-state scan exceeded its 30-second test budget. Added a scoped 60-second limit without skipping assertions; that affected run then passed in 19.1 seconds. Other passing checks were not unnecessarily repeated.
- Reviewed desktop/mobile captures in docs/design/reference-glass-*.png. Original model, input policy, coefficients, font files, and DEVELOPMENT_PLAN.md are unchanged; no engine test rerun or deployment.
- Homizio Nova remains blocked on verified webfont permission. Downloaded the exact desktop archive to a temporary research directory only. The author's DaFont note says free personal/commercial use and directs webfont licensing to atfg.co/font/homizio-nova, which returned proxy 403. The archive contains no license; metadata has copyright but no grant. Alternative/archived sources did not establish this exact family's web permission. Requested a license or working author-permission link asynchronously while completing independent work. No font binary is shipped or silently substituted.
- Updated contributor/design/README records and wrote docs/REFERENCE_PREVIEW_REVIEW.md with the evidence and preview limitations. Saved revised start_skill, preserving other environment fields. Saving is not publication or proof of fresh-task restoration.
- Local checkpoint: `style: refine amber glass artwork and restore reviewable previews`. Live development preview remains running; font installation is pending the missing license. No push/deployment.

## October 14, 2026 — orange orbital theme and accessibility/browser review

- Founder requested a vibrant orange DORfic-inspired palette and spinning background before continuing the approved accessibility/cross-browser milestone. This explicitly supersedes the prior aqua/green direction; original DEVELOPMENT_PLAN.md is preserved unchanged.
- Applied warm charcoal/ivory/orange tokens across the interface, SVG chart/legend, favicon, and browser theme color. Darker orange small-link text retains contrast against stronger orange backdrops; readable warm-white panels sit over the artwork.
- Added a glossy sphere, tilted ring, and satellites with slow 30-second rotation. Verified the ring advances, Pause motion freezes its position, resume continues it, and reduced motion removes animation. Added a real browser motion recording and desktop/mobile screenshots in docs/design/orange-*.
- Added pinned @axe-core/playwright as a dev-only dependency. Scans cover nine core screens/error states per browser, with WCAG 2/2.1/2.2 A/AA tags. Added a 320px/200% root-text check through all seven views.
- Testing caught clipped navigation/actions and chart tabs at enlarged text, plus an undersized Firefox motion-control target. Fixed wrapping and narrow metric layouts; enlarged the control to at least 44px height. Custom-plan fields now expose invalid state and describe their error summary.
- Final full browser suite passed 50/50 runs across Chromium desktop/mobile, Firefox desktop, and WebKit desktop/mobile; no skips or failures. Five additional accessibility runs passed after the final deep-orange text refinement. TypeScript and production build passed. Unit/model tests were not unnecessarily rerun; no engine/coefficients/input policies changed.
- Firefox initially failed writing profile configuration under read-only home and then crashed on /proc namespace writes. Workspace XDG directories and a test-process-only inner-sandbox override resolved actual rendering. WebKit initially lacked native libraries; standard root dependency installation lacked authentication. Retrieved signed/checksummed Debian packages with verification retained and extracted libraries under workspace cache, then used the supported binary/bundle override because the packaged shell wrapper overwrites the library path. No system/home edits, disabled TLS/signature checks, or skipped assertions.
- Added optional cross-browser Playwright projects and expanded CI to all three managed engines. Local WebKit iPhone settings are emulation, not physical iOS/Safari certification; remote CI has not run.
- Wrote docs/ORANGE_THEME_REVIEW.md with design interpretation, evidence, environment diagnosis, and remaining screen-reader/real-device/performance/private-beta limits. Updated current design/product/architecture decisions without altering the original plan.
- Saved updated start_skill, preserving the installation script and unrelated environment configuration. Saved draft is not publication or fresh-task restoration. Temporary review servers closed after capture.
- Local checkpoint: `style: add orange orbital theme and cross-browser accessibility checks`. No push/deployment. Remaining: real screen-reader/device validation and student beta feedback; release and feedback storage remain owner decisions.

## October 14, 2026 — approved layouts and functional interface

- Founder approved the concrete landing/setup/results layouts. Recorded approval in CONTRIBUTING.md, the architecture record, and design documents. Existing V0.1 and Option A approvals remain in effect; no repeat permission gate.
- Implemented guided baseline/goal/study setup and review, preserving edits and focusing errors/step headings. Assessment changes revalidate without erasing scores; below-floor PSAT results stop with the approved baseline guidance.
- Connected the pure engine to responsive results, total/section native SVG curves, a keyboard/touch date control, rounded table alternatives, exact target dates, target context, and explicit experimental assumptions.
- Added Increased Practice and custom scenarios, changed-field explanations, descriptive-only disclosures, invalid-input handling, reset, and retained comparison state while visiting How It Works.
- Polished atmospheric backgrounds and Outfit/Manrope typography; added CSS entrance/graph/hover motion, finite ambient drift, Pause motion, and independent system reduced-motion support. SVG arrows fix unavailable font glyphs. Improved input border/selected-tab visibility.
- Built How It Works with the equations, chosen coefficients, baseline/PSAT policy, sensitivity-range limits, rounding, navigation behavior, sources, and actual tab-memory privacy explanation. No accounts, persistence, score telemetry, or server.
- Final verification passed: TypeScript, production build, 123 unit tests, and 16 actual desktop/mobile browser runs. Two additional targeted runs verified opening a collapsed allocation control before focusing its error. Manually reviewed 21 screen/viewport combinations at 1440/390/320px with no page overflow or clipped controls, and captured final screenshots in docs/design/interface-*.png.
- Exercised actual development startup and production rendering. An initial test launch found an owned preview process occupying port 4173; stopped its complete process tree and reran successfully. Temporary review servers were closed afterward.
- Distributed both font licenses/provenance with the production build, without new npm dependencies. Model code/coefficients and original DEVELOPMENT_PLAN.md are unchanged. Numerical checks are not prediction-accuracy evidence.
- Saved updated start_skill in the environment configuration draft, preserving the installation script and unrelated settings. Saving does not publish/apply settings or establish fresh-task restoration.
- Wrote docs/INTERFACE_TEST_REPORT.md with evidence, limits, and learning exercises. Local feature branch: feat/laplora-interface. Checkpoint: `feat: build guided SAT simulation interface and polished motion`. No push/deployment.

Learning focus: string form state preserves blank-versus-zero intent; the pure engine owns calculations; chart/table summaries share section-first rounding; comparisons change only supported study inputs. Next: private beta preparation and broader accessibility/cross-browser/performance review. Feedback storage and release/deployment remain separate owner decisions.

## October 14, 2026 — approved typography option A

- Founder selected Option A: Outfit headings/wordmark and Manrope body/controls. Recorded the selection in contributor and design documents so this decision does not need to be requested again.
- Applied local variable fonts to the application foundation through shared display/body tokens, retaining licenses and package provenance. Vite bundles only these two families (57,128 font bytes); no new package dependency or external font service.
- Set the main headline to Outfit 550, other headings to 600, and the capital-L wordmark to 650. Body text and inherited control typography use Manrope with system fallbacks and font-display: swap.
- Type checking, production build, and 2 existing desktop/mobile foundation browser tests passed. Verified both font faces loaded from local hashed production assets, correct computed heading/body families, no runtime/request errors, and no overflow at 1440px, 390px, and 320px.
- Visually reviewed captured desktop/mobile application screenshots in docs/design/app-option-a-desktop.png and app-option-a-mobile.png. Closed the temporary preview server after verification.
- Typography selection is complete; the existing full wireframe/layout review remains pending. No model code changed or engine test rerun was needed. Original DEVELOPMENT_PLAN.md is unchanged.
- Local checkpoint: `style: apply approved Outfit and Manrope typography`. No push/deployment.

## October 14, 2026 — compact font example

- Added docs/design/font-quick-example.html and its captured image for a quick side-by-side view of the same wordmark, headline, and body copy in options A/B/C.
- Rendered the local fonts in Chromium and visually reviewed the result. No application/model changes or new tests were needed.
- Font selection and the existing full-interface design review remain pending; positive feedback on the comparison board was not treated as a choice of a particular typeface.

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
- Saved updated install_script/start_skill, preserving unrelated configuration. The instructions now include unit verification and the existing V0.1 approval. Environment configuration publication was not performed.
- Local engine commit: 6f7e732; input commit: 6304cc9. Design checkpoint: `docs: prepare Aero wireframes for interface review`. No push or deployment.

### Pending decision

At this checkpoint, the architecture required wireframe approval before visual implementation. The concrete wireframe/design artifacts are ready for that review. After approval or revisions, proceed with the guided interface, engine integration, charting, motion, comparisons, and How It Works. Existing V0.1 model approval remains valid and does not need to be requested again.

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

- The React/TypeScript architecture and development review process were approved. Treat TypeScript as the production language; no Python backend is required by the approved architecture.
- Read official College Board scoring, SAT structure, domain, Bluebook, and My Practice pages. Recorded reviewed sources and facts in docs/SAT_RESEARCH.md.
- Verified SAT section range 200–800 and total range 400–1600; PSAT/NMSQT and PSAT 10 section range 160–760 and total range 320–1520.
- Wrote docs/PRODUCT_SPECIFICATION.md: problem statement, audience, accepted baselines, planned inputs/outputs, exclusions, privacy, credibility, and acceptance criteria.
- Created docs/FUTURE_IDEAS.md from the roadmap, README.md, and CONTRIBUTING.md.
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
- Git records commit authorship and timestamps; existing identity configuration was left unchanged.
- The exported plan contains two trailing-space lines; these are preserved intentionally. Whitespace checks for new authored files pass.

## October 14, 2026 — planning checkpoint

### Completed

- Inspected the empty `/workspace/laplora` checkout and verified authenticated Git read access during onboarding. The remote advertised no commits or branches.
- Attempted the original Notion URL; network access returned 403.
- Read the entire supplied development instruction text and the exported Notion plan. The archive contains one Markdown document, with no exported subpages.
- Saved the 20,417-byte exported plan unchanged as DEVELOPMENT_PLAN.md and verified exact byte equality.
- Prepared ARCHITECTURE.md with technology tradeoffs, architecture, research approach, tentative equations, approval gates, all 16 milestones, and Git/testing practices.
- Identified the need to clarify implementation responsibilities and learning checkpoints before development.
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
