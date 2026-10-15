# Laplora wireframes V0.1

Week 9 review artifact · October 14, 2026 · Static planning views, not the implemented application.

Later owner direction replaces the original aqua/green colors with an orange DORfic-inspired theme and orbital motion. The approved layouts remain; see [the current orange review](ORANGE_THEME_REVIEW.md) for latest application previews and cross-browser evidence. Original planning images below are retained for layout history.

References: [visual system](DESIGN_SYSTEM.md), [guided flow](USER_FLOW.md), [approved input rules](INPUT_SPECIFICATION.md), and [model limits](MODEL_SPECIFICATION.md).

The accompanying planning HTML and captured images show three representative screens. Synthetic scores use the already documented 1200 baseline, 12-week, 3-hours/70% example; none are research findings or real student data.

## Views for review

- [Landing](design/landing.png): one purpose-led headline, clear entry point, experimental wording, and a preview of the model's purpose.
- [Baseline setup](design/setup.png): short step flow, assessment/date/section inputs, derived total, and explicit scale guidance.
- [Results and comparison](design/results.png): central total and illustrative range, Total/Math/RW chart controls, changed study inputs, a data-table alternative, and nearby caveats.
- [Mobile results](design/mobile-results.png): the same content in one column; chart and scenario controls do not require horizontal page scrolling.
- [Static planning source](design/wireframes.html): source for the captured review artifact. Controls are inert; this is a visual proposal rather than functional UI.
- [Typeface comparison](design/typography-comparison.png): Outfit + Manrope, Space Grotesk + Manrope, and Plus Jakarta Sans, using the same copy and values.
- [Website and font research](DESIGN_REFERENCES.md): inspected sources, scope, licenses, and the recommended typography direction.

The founder selected Option A, Outfit + Manrope, and approved the proposed landing/setup/results layouts on October 14, 2026, with a capital L in Laplora. The original planning artifacts remain for reference; the React interface is now functional. See the [implemented landing](design/interface-landing-desktop.png), [results](design/interface-results-desktop.png), and [mobile chart](design/interface-chart-mobile.png).

## Remaining states covered by the user-flow specification

Goal and study-plan steps reuse the setup shell and validated field contracts. Review permits editing each step without losing other answers. Error summaries focus the first invalid field. PSAT below-floor observations receive the approved explanatory outcome before the rest of setup. Old scores and long horizons surface understandable warnings.

How It Works will explain the observed baseline, shared PSAT scale, section modeling, experimental coefficients, sensitivity range, limitations, and actual in-memory privacy behavior. It should be reachable without submitting student data.

## Design review gate

The landing, setup, and results wireframes were approved on October 14, 2026 and informed the implemented interface. See ARCHITECTURE.md for the current system.

Recommended direction: use this restrained Aero layout, preserve the documented guided flow, and implement results with one primary graph plus section-view controls and a clearly labeled comparison panel.
