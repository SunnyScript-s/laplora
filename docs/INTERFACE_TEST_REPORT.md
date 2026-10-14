# Interface implementation and verification

October 14, 2026 · Founder-approved layouts and typography · Model 0.1.0-experimental

Later checkpoint: the founder requested a vibrant orange DORfic-inspired theme and rotating background. See [ORANGE_THEME_REVIEW.md](ORANGE_THEME_REVIEW.md) for the new previews, accessibility repairs, and actual 50-run cross-browser result. The evidence below records the earlier interface checkpoint.

## Working experience

The React interface now connects to the approved engine: landing → baseline → goal → study plan → review → results. Students can edit prior steps without losing answers, explore Total/Math/Reading & Writing curves, inspect rounded weekly data and the exact endpoint, apply Increased Practice or a custom scenario, reset comparisons, and read How It Works without submitting data.

The interface retains Outfit/Manrope, capital-L branding, atmospheric sky/aqua/green backgrounds, rounded readable panels, explicit assumptions, and no artificial simulation wait. CSS handles entrance/line/hover motion and finite ambient drift. Pause motion and the system reduced-motion preference disable motion while preserving immediate scores, charts, and controls. Decorative diagonal arrows use SVG so unsupported font glyphs cannot become missing-character boxes.

Native SVG supports these bounded curves without another chart dependency. A ResizeObserver keeps axis labels sized for their actual container. Pointer/touch exploration and a labeled native range control offer multiple ways to explore dates; a semantic table and text summaries provide alternatives to the visual chart. Zoomed axes and rounding are disclosed. Current-plan shading is explicitly distinguished from the dashed comparison curve.

Inputs stay in React memory. They are not persisted, added to URLs, or sent to a server. How It Works documents navigation: in-app Back/Next/Edit controls move through setup; browser Back does not navigate its steps. Visiting How It Works preserves the active step or comparison. Start over asks before discarding an entered plan; refresh clears it.

## Checks performed

- TypeScript checking and production build passed.
- All **123 unit tests** passed; the **2,160-profile** stress grid remains one test, not 2,160 additional tests. Model code and approved coefficients are unchanged.
- All **16 browser runs** passed: eight behavioral tests on desktop Chromium and a Pixel 7 mobile viewport, with no failures or skips. Final full rerun passed after the icon/contrast/error-language polish. A subsequent focus fix opens a collapsed allocation control before focusing its error; the affected flow passed both additional desktop/mobile runs.
- Browser flows cover known 1200 → 1240 results, 1220–1260 illustrative range, section/total consistency, exact endpoint data, keyboard date exploration, 1280 Increased Practice, invalid custom hours, flat zero-effort curves, descriptive-only changes, reset, edit retention, missing inputs, score increments, invalid dates, required study context, PSAT revalidation/below-floor handling, the 40-hour preset limit, local fonts, navigation, and motion preferences.
- Checked actual development-server rendering of the landing and guided baseline view, with no runtime errors. Production preview was also exercised independently of automated tests.
- Inspected all seven views (landing, baseline, goal, study, review, results, How It Works) at **1440px, 390px, and 320px**: 21 view/viewport checks showed no horizontal page overflow or clipped interactive controls. The table intentionally permits contained horizontal scrolling, with a keyboard-focusable labeled region.
- Checked browser request/runtime errors during the flows. The observed post-landing simulation requests stayed local, and local/session storage remained empty. This is observed behavior plus source inspection, not a network security audit.
- Reviewed final desktop/mobile screenshots. Strengthened numeric/select borders to #6f8997 (3.68:1 against white, 3.36:1 against #edf6f8), added a dark selected-tab indicator, and retained visible focus. Primary/secondary text and button colors were checked against declared light surfaces; this is a basic contrast review, not a full rendered accessibility audit.
- Both local variable fonts load in Chromium. Their combined payload is **57,128 bytes**. Licenses and provenance are copied byte-for-byte into dist/font-licenses by Vite.
- Production application assets report approximately **107.69 kB gzip JavaScript** and **4.34 kB gzip CSS**, plus fonts. This is build output size, not a measured slow-network performance score. Optional navigation timing was unavailable in the clock-controlled capture; no timing score is claimed.

An initial browser run was prevented by an owned preview process remaining on port 4173 after its parent stopped. The full owned process tree was stopped; subsequent runs used Playwright's lifecycle-managed preview and completed. Manual review now opens and closes Vite's server in the same script to avoid orphan processes.

## Review images

- [Desktop landing](design/interface-landing-desktop.png) and [mobile landing](design/interface-landing-mobile.png)
- [Baseline setup](design/interface-setup-desktop.png)
- [Desktop results](design/interface-results-desktop.png) and [mobile results](design/interface-results-mobile.png)
- [Mobile chart detail](design/interface-chart-mobile.png)

Images use the documented synthetic profile and an explicitly fixed October 14 start for reproducibility. They contain no real student data. Capture uses reduced motion; the application also supports the animated presentation.

## Mentoring notes

The form stores strings because a blank field is different from zero. The adapter deliberately parses numeric text, then the shared input engine validates it. Each setup step checks its own fields; only the complete reviewed draft reaches simulate. The mathematical engine does not read React state, browser storage, clocks, or networks.

The chart plots raw engine points, while the table and summaries round each section to tens before adding totals. A goal is a visual reference and never a parameter that produces extra growth. Scenario comparison passes only approved study-plan changes to the same engine, keeping observation, dates, target, and coefficients fixed.

Small exercises: trace a weekly-hours edit from Setup through candidate/validateInput/simulate to ScoreChart; explain why a method-only scenario preserves the curve; compare a raw point with displayScores and its displayed total. These connect TypeScript state, validation, numerical modeling, and visual communication.

## Remaining work and evidence limits

This is a functional local interface checkpoint, not a public release. Chromium desktop/mobile checks do not establish Safari/Firefox compatibility, screen-reader usability, complete accessibility compliance, or performance on lower-powered devices. Real-student private beta feedback, broader accessibility and cross-browser review, and representative slow-network/device measurements remain next milestones.

The chosen learning rates remain experimental. Passing arithmetic/behavior tests does not establish calibrated growth, realistic individual outcomes, range coverage, or prediction accuracy. No new scientific model claim, coefficient change, account/database, feedback storage, release, push, or deployment was introduced.

The environment's start_skill draft was updated to describe the working simulator and actual verification commands. Saving that draft does not apply or publish it; review/save and publication remain environment-settings actions. No fresh-task restoration or remote GitHub Actions run is claimed.
