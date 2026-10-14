# Laplora visual system V0.1 — proposed

Week 9 design deliverable · October 14, 2026 · Awaiting wireframe/design review before full interface implementation.

## Direction

Professional Frutiger Aero with a restrained glass surface treatment: bright atmospheric backgrounds, aqua and sky tones, soft green accents, rounded shapes, readable dark text, and consistent typography. The interface should feel optimistic and credible to students, families, and teachers.

## Proposed tokens

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
| Typography | System sans-serif initially | Readable, no external font request or licensing dependency |

Use one calm background, one primary accent, and one scenario accent. Avoid stacked decorative gradients, unsolicited gauges, fake precision, unnecessary counters, and decorative animation. Model-version disclosure belongs in an explanation, not as an intimidating technical label on every control.

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

## Review versus validation

Static wireframes illustrate layout and hierarchy; they do not prove accessibility or performance. Actual implementation must check contrast against rendered backgrounds, visible focus, mobile fit, keyboard navigation, reduced motion, chart alternatives, error states, and understandable model language.
