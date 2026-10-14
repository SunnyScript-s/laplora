# Laplora visual system V0.1

Week 9 design deliverable · October 14, 2026 · Typography and landing/setup/results layouts approved; implemented in the React interface.

## Direction

Professional Frutiger Aero with a restrained glass surface treatment: bright atmospheric backgrounds, aqua and sky tones, soft green accents, rounded shapes, readable dark text, and consistent typography. The interface should feel optimistic and credible to students, families, and teachers.

## Shared tokens

| Token | Value | Purpose |
| --- | --- | --- |
| Ink | #173e50 | Primary text |
| Muted ink | #426171 | Secondary text on light surfaces |
| Aqua | #126279 | Primary buttons, links, focus rings, current-plan curve |
| Soft sky | #e7f5fa | Page background |
| Pale green | #d7eee3 | Restrained atmospheric accent |
| Green ink | #316c57 | Secondary scenario curve/accents with text labels |
| Glass surface | White at roughly 80–92% opacity | Main panels; preserve contrast against the actual background |
| Panel radius | 24px | Main cards; controls use smaller 10–12px corners |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64px | Consistent rhythm |
| Display typography — approved A | Outfit, locally bundled | Rounded geometric wordmark/headlines, with a system fallback |
| Body typography — approved A | Manrope, locally bundled | Readable labels, paragraphs, and numerical summaries |

Use one calm background, one primary accent, and one scenario accent. Avoid stacked decorative gradients, unsolicited gauges, fake precision, unnecessary counters, and decorative animation. Model-version disclosure belongs in an explanation, not as an intimidating technical label on every control.

The founder selected Option A, Outfit + Manrope, and approved the full proposed layouts on October 14, 2026, with a capital **L** in **Laplora**. See [DESIGN_REFERENCES.md](DESIGN_REFERENCES.md) for actual website observations, three font pairings, provenance, and delivery tradeoffs.

## Layout and components

- Content width: approximately 1100px, with generous desktop margins and a single-column mobile flow.
- Landing: editorial headline, purpose, visible experimental wording, a primary Start simulation action, and a restrained preview using a clearly labeled synthetic example.
- Guided setup: three steps and a review state; one primary panel with explicit labels, sensible groups, a clear Back/Next action, and preserved answers.
- Results: baseline/central/range summary, one primary graph with Total/Math/RW view controls, nearby caveats, and a scenario panel. Keep changed inputs obvious.
- How It Works: understandable model overview, equations in an expandable explanation, sources, experimental assumptions, and privacy/independence text.

Native labeled numeric/date/select controls should lead. A slider always has an equivalent numeric input. Error states use text and icons rather than color alone. Native details/table elements can provide additional assumptions and chart data.

## Charts

The current plan uses aqua, comparisons use green plus different line styling, and the illustrative range uses a light shaded area. Explain which plan a band belongs to. Keep the goal visibly identified if within the plotted range; disclose any zoomed axis or off-scale target. Do not visually imply a probability of success.

Show totals derived from rounded section values in summaries/tooltips, while retaining raw values internally. Provide a date/Math/RW/total table. Keyboard and touch exploration must be tested before claiming the graph accessible.

## Motion contract

Use short 150–250ms feedback and restrained step/result transitions. No artificial simulation delay. Optional graph drawing and counters must preserve an immediately available semantic final value. Reduced motion removes travel/drawing/count-up effects while preserving content and interaction.

Implemented motion: 180ms hover feedback, 380ms page/step entrances, 900ms central-curve drawing, and two 18-second cycles of ambient background drift. Scores render immediately with no count-up delay. A visible Pause motion control removes animations/transitions, and the system reduced-motion preference disables them independently. Ambient shapes use transform motion behind content; they never intercept input.

## Review versus validation

Static wireframes illustrate layout and hierarchy; they do not prove accessibility or performance. Actual implementation must check contrast against rendered backgrounds, visible focus, mobile fit, keyboard navigation, reduced motion, chart alternatives, error states, and understandable model language.
