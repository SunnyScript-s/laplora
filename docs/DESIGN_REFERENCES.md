# Design and typography exploration

October 14, 2026 · Requested by the founder while reviewing the V0.1 wireframes.

## Website references

| Reference | What was inspected | Relevant lesson for Laplora |
| --- | --- | --- |
| [Stripe](https://stripe.com/) | Retrieved public HTML and rendered the landing view/CSS. Heading CSS declared `sohne-var`, roughly 48px/300 in the inspected hero. | Large readable editorial type, generous margins, clear primary actions, and disciplined content structure |
| [Framer](https://www.framer.com/) | Retrieved public HTML and rendered the landing view/CSS. Heading CSS declared GT Walsheim Medium, roughly 54px/500 in the inspected hero. | Confident geometric headlines, limited navigation, rounded controls, and a clear product visual |
| [Linear](https://linear.app/) | Retrieved public HTML, inspected rendered navigation and DOM/CSS. Heading CSS declared Inter Variable, 64px/510. The hero remained hidden in the captured view, so its visual composition was not fully verified. | Precise navigation spacing and restrained type hierarchy; no claim of a complete hero inspection |

These are observations of the retrieved pages, not rankings of site popularity or a complete interaction audit. Stripe and Framer were reviewed with page JavaScript disabled; Linear's typography was also inspected with JavaScript enabled. Animations and interactions were not assessed.

Chromium's initial direct requests failed certificate trust checks. Public resources were subsequently retrieved through the configured proxy using Playwright's HTTPS request context, with certificate verification retained, then fulfilled to the review browser. TLS verification was not disabled. The references are read-only; no account login, contact, or form submission was performed.

Use the references for hierarchy, typography, spacing, and clarity. Laplora retains its own aqua/sky/green Aero direction, content, and honest simulation language. No commercial website font, brand asset, testimonial, partner logo, or code was copied into the app.

## Typeface comparisons

See [the comparison image](design/typography-comparison.png) and [specimen source](design/type-study.html).

| Option | Display / wordmark | Body / controls | Assessment |
| --- | --- | --- | --- |
| A — recommended | Outfit | Manrope | Geometric and optimistic display shapes with readable body labels; strongest fit for the proposed Aero direction |
| B | Space Grotesk | Manrope | More technical mathematical character, with a sharper display voice |
| C | Plus Jakarta Sans | Plus Jakarta Sans | Cohesive, friendly, polished single-family alternative |

All three specimens show the same capital-L wordmark, headline, form label, score, and synthetic context. Scores are unchanged from the documented example. The differences are visual judgments, not measured user-study findings.

## Recommended refinement

Use Outfit at approximately 550–650 for headings and the **Laplora** wordmark; Manrope at 400–650 for paragraphs, labels, controls, and score summaries. Use restrained negative display tracking and normal body tracking. Keep numeric columns aligned with tabular-figure styling where supported.

The refreshed static landing/setup/results views apply Option A for review. The existing application wordmark is capitalized and its tracking is adjusted; the new font pairing has not been installed as an application runtime dependency pending the design decision.

## Font provenance and delivery

Four Latin variable WOFF2 files are retained in docs/design/fonts, together with their OFL-1.1 licenses and sources.json. They came from the exact `@fontsource-variable/*@5.3.0` packages through npm. The downloaded archives were checked against the registry's SHA-512 integrity metadata before extracting the font files.

Recommended Outfit + Manrope files total 57,128 bytes, about 56 KiB. The comparison uses all four local families. No Google Fonts/CDN request is necessary for these review files. A future production build should bundle only the chosen families/needed subsets and retain their licenses; additional glyph coverage may be needed if the product adds other languages.

## Actual checks

- All four comparison font faces loaded successfully in Chromium; no browser runtime or failed-request errors in the local review capture.
- Refreshed wireframes fit 390px and 320px viewports without horizontal page overflow.
- Manual review of the comparison, landing, results, and mobile results images completed.
- Application TypeScript checking, production build, and 2 existing foundation browser runs passed after the capitalization/tracking change.
- Model code and coefficients were unchanged; engine unit tests were not rerun for these presentation-only changes.
- Full interface accessibility and typography usability remain implementation/beta checks, not claims from these static specimens.
