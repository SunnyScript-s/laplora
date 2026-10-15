# Laplora visual system V0.1

Week 9 design deliverable · October 14, 2026 · Typography and landing/setup/results layouts approved; implemented in the React interface.

## Direction

The founder requested a vibrant orange “DORfic” direction after approving the layouts. The implemented interpretation combines warm ivory, vivid orange environmental shapes, glossy orbital forms, dark warm text, and readable near-white panels. This explicit request supersedes the earlier aqua/green direction; the supplied development plan stays unchanged as a historical source. Layouts and capital-L source branding remain in use; the founder's latest typography choice is Disket Mono with Manrope for body text. The interface should feel optimistic and credible to students, families, and teachers.

## Shared tokens

| Token | Value | Purpose |
| --- | --- | --- |
| Ink | #30231e | Primary text |
| Muted ink | #6d5143 | Secondary text on light surfaces |
| Burnt orange | #b83d0b | Primary button backgrounds and current-plan curve |
| Deep orange | #9e3008 | Links, small accent text, and focus rings over warm backgrounds |
| Vivid orange | #ff6a22 | Decorative environmental color; never white body text on this bright shade |
| Warm ivory | #fff6ec | Base page/background theme |
| Soft orange | #fff1e4 | Callouts, tabs, and explanatory surfaces |
| Slate violet | #54506e | Comparison curve/legend with dashed styling and text labels |
| Control border | #987b67 | Numeric/date/select control outlines |
| Glass surface | Warm white (#fffdf9) at 96% opacity | Readable panels over the moving background |
| Panel radius | 24px | Main cards; controls use smaller 10–12px corners |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64px | Consistent rhythm |
| Display typography — latest founder request | Disket Mono Regular 400 / Bold 700, locally bundled | Geometric monospace branding, headings, actions, and score highlights |
| Body typography | Manrope, locally bundled | Readable labels, paragraphs, form controls, and chart annotations |

Use one primary accent and one scenario accent. Decorative orange orbital motion is explicitly requested by the founder; keep it behind content and subordinate to task completion. Avoid unsolicited gauges, fake precision, unnecessary counters, and motion on every component. Model-version disclosure belongs in an explanation, not as an intimidating technical label on every control.

The founder selected Option A, Outfit + Manrope, and approved the full proposed layouts on October 14, 2026, with a capital **L** in **Laplora**. See [DESIGN_REFERENCES.md](DESIGN_REFERENCES.md) for actual website observations, three font pairings, provenance, and delivery tradeoffs.

Latest refinement: a supplied amber-glass reference now guides the vector background—glossy bubbles, curved yellow/orange ribbons, and white orbital lines. The founder subsequently replaced Homizio Nova with Disket Mono from the supplied ZIP. Its included EULA explicitly permits webfont conversion and website use. See [DISKET_TYPOGRAPHY_REVIEW.md](DISKET_TYPOGRAPHY_REVIEW.md) for provenance, type roles, and verification. Disket's lowercase glyphs have uppercase forms; preserve mixed-case semantic text without adding CSS uppercase transforms. Use the supplied real 400/700 weights and disable synthetic styles.

## Layout and components

- Content width: approximately 1100px, with generous desktop margins and a single-column mobile flow.
- Landing: editorial headline, purpose, visible experimental wording, a primary Start simulation action, and a restrained preview using a clearly labeled synthetic example.
- Guided setup: three steps and a review state; one primary panel with explicit labels, sensible groups, a clear Back/Next action, and preserved answers.
- Results: baseline/central/range summary, one primary graph with Total/Math/RW view controls, nearby caveats, and a scenario panel. Keep changed inputs obvious.
- How It Works: understandable model overview, equations in an expandable explanation, sources, experimental assumptions, and privacy/independence text.

Native labeled numeric/date/select controls should lead. A slider always has an equivalent numeric input. Error states use text and icons rather than color alone. Native details/table elements can provide additional assumptions and chart data.

The shared footer includes a small, readable “Made by Santiago Harbison” credit beside the tagline and independence notice.

The pricing view reuses the same glass panels, colors, Disket/Manrope type, button styles, and entrance motion. Free and Pro cards stack on mobile, followed by the potential 90-day pass and a semantic feature table. Paid cards use clear Coming Soon labels and informational text rather than checkout controls. The homepage Pro link remains subordinate to the free simulation action.

## Charts

The current plan uses burnt orange, comparisons use slate violet plus dashed line styling, and the illustrative range uses a light orange shaded area. CSS tokens now drive SVG colors and matching legend markers. Explain which plan a band belongs to. Keep the goal visibly identified if within the plotted range; disclose any zoomed axis or off-scale target. Do not visually imply a probability of success.

Show totals derived from rounded section values in summaries/tooltips, while retaining raw values internally. Provide a date/Math/RW/total table. Keyboard and touch exploration must be tested before claiming the graph accessible.

## Motion contract

Use short 150–250ms feedback and restrained step/result transitions. No artificial simulation delay. Optional graph drawing and counters must preserve an immediately available semantic final value. Reduced motion removes travel/drawing/count-up effects while preserving content and interaction.

Implemented motion: 180ms hover feedback, 380ms page/step entrances, 900ms central-curve drawing, two 18-second cycles of ambient drift, and a slow continuous 30-second orbital rotation with satellites. Scores render immediately with no count-up delay. The founder requested removal of the footer Pause motion button on October 15, 2026. The system reduced-motion preference disables all animations. Ambient shapes use transform motion behind content; they never intercept input.

## Review versus validation

Static wireframes illustrate layout and hierarchy; they do not prove accessibility or performance. Actual implementation must check contrast against rendered backgrounds, visible focus, mobile fit, keyboard navigation, reduced motion, chart alternatives, error states, and understandable model language.
