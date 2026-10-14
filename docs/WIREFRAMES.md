# Laplora wireframes V0.1

Week 9 review artifact · October 14, 2026 · Static planning views, not the implemented application.

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

The founder requested a cooler typography direction and a capital L in Laplora. The refreshed previews show the recommended Outfit + Manrope pairing with that capitalization; the alternative specimens remain available for comparison.

## Remaining states covered by the user-flow specification

Goal and study-plan steps reuse the setup shell and validated field contracts. Review permits editing each step without losing other answers. Error summaries focus the first invalid field. PSAT below-floor observations receive the approved explanatory outcome before the rest of setup. Old scores and long horizons surface understandable warnings.

How It Works will explain the observed baseline, shared PSAT scale, section modeling, experimental coefficients, sensitivity range, limitations, and actual in-memory privacy behavior. It should be reachable without submitting student data.

## Design review gate

The approved ARCHITECTURE_PROPOSAL.md says: “Approve wireframes before visual implementation.” These artifacts make that review concrete. The input and engine work are complete independently; full interface code remains pending this review.

Recommended direction: use this restrained Aero layout, preserve the documented guided flow, and implement results with one primary graph plus section-view controls and a clearly labeled comparison panel.
