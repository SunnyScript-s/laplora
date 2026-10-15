# Laplora Pro and planned monetization

October 15, 2026. This addition presents the planned freemium offering within the existing interface. The original development plan is preserved; no score-model changes accompany this scope addition.

## Available and planned options

| Option | Price in USD | Status |
| --- | --- | --- |
| Laplora Free | $0 | Available now |
| Laplora Pro | $4.99/month | Planned; Coming Soon |
| 90-day SAT Prep Pass | $9.99 one-time | Potential alternative; Coming Soon |

Free includes unlimited basic SAT simulations one at a time, basic trajectories, Math and Reading & Writing estimates, and no account requirement. The current plan versus one alternative comparison also remains free, including Increased Practice and custom adjustments. Existing inputs still live only in tab memory.

Planned Pro features are saved simulation history, actual SAT practice-score tracking, multiple strategy comparisons, advanced progress analytics, personalized study-plan adjustments, and exportable progress reports. Multiple strategy comparison would bring several saved plans together; it does not restrict the currently available free comparison.

The pass is a possible way to access planned Pro features for 90 days with one payment. It is under consideration, not an activated offer or a promise of a launch date. Both paid options clearly say Coming Soon and are unavailable for purchase. No signup, waitlist collection, checkout, payment provider, subscription, saved history, or other premium feature has been implemented.

## Presentation and navigation

- The homepage retains “Start from an existing score. No quiz. No account.” and its existing primary simulation action. A subordinate Explore Laplora Pro button opens pricing; a shared navigation entry provides access elsewhere.
- Pricing uses the shared DORfic background, glass panels, colors, typography, buttons, and reduced-motion-aware entrance animation. Local pricing styles add the card grid, pass layout, and semantic feature comparison table without changing the existing global design.
- The page has available/planned labels, descriptive headings, a table caption and scoped headers, normal text wrapping, and no disabled or simulated purchase interaction.
- It follows the app's existing view-state navigation rather than introducing routing dependencies. Pricing and How It Works share a return destination. Setup/results remain mounted while hidden, preserving the active form step, entered values, comparison selection, and chart section.
- The Free card starts setup from home and resumes the active setup/results workspace otherwise. The in-app Back button returns to the originating workspace; browser Back remains outside step navigation.

## Code boundaries

`src/product/plans.ts` owns stable feature, tier, and offer IDs, explicit availability, USD prices in cents, and monthly versus one-time duration metadata. Paid offers reference the Pro tier. It is a product catalog, not an entitlement service or a payment authority.

`src/app/Pricing.tsx` renders the catalog and current free-comparison explanation. `Pricing.module.css` supplies local layout; existing shared classes handle panels, controls, type, and entrance motion. App.tsx connects navigation while preserving the active workspace. The pure engine and its parameters are unchanged.

## Future implementation sequence

1. Define account ownership, retention, consent, data export/deletion, and privacy requirements before storing student history or actual scores.
2. Add authenticated storage for simulation snapshots and practice-score records, with server-enforced ownership checks. The current in-memory flow should continue to support anonymous Free use.
3. Add a server-authoritative entitlement service referencing the stable tier/feature IDs. Implement each premium capability before making it available; catalog flags alone cannot grant access.
4. When separately authorized, integrate provider-specific prices and verified subscription events behind a billing service. Handle renewal, cancellation, expiry, refunds, and the pass's finite access period. Neither browser prices nor local storage may authorize paid access.
5. Validate analytics and study-plan explanations, implement reports, and review accessibility/privacy before changing Coming Soon labels. Preserve the experimental-model wording and avoid promises of score improvement.

This sequence documents extension points; it does not introduce placeholder network services, account state, provider dependencies, or fake premium results.

## Preview and verification

Run npm run dev, then choose Explore Laplora Pro on the homepage or Laplora Pro in the navigation. For a server-independent copy, run npm run build:preview and download/open [interactive-preview.html](design/interactive-preview.html). Pricing is bundled into the same actual application.

Review captures: [desktop pricing](design/pro-pricing-desktop.png), [mobile pricing](design/pro-pricing-mobile.png), [desktop homepage](design/pro-home-desktop.png), and [mobile homepage](design/pro-home-mobile.png).

The browser tests cover the live-versus-planned distinction, prices and duration, no purchase controls or external requests, anonymous Free entry, keyboard focus, setup/comparison retention, an accessibility scan, reduced motion, and 320px/200% text reflow. See PROGRESS.md for actual run outcomes. Automated browser checks do not establish empirical prediction accuracy or replace physical-device/screen-reader review.

Follow-up verification: the full suite passed locally with CI=1: 123 unit tests and 65 browser cases across Chromium desktop/mobile, Firefox desktop, and WebKit desktop/mobile. CI now uses one browser worker after diagnosing resource-related WebKit timeouts in the first hosted run; assertions, timeouts, and application motion remain intact. See [GitHub Actions](https://github.com/SunnyScript-s/laplora/actions) for hosted results.
