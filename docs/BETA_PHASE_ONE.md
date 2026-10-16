# Phase 1 — beta preparation review

This branch implements only Phase 1 of the owner's 16-part beta/validation request. Phase 2 and later work remain unstarted pending approval. The original 16-week plan and production model are preserved.

## Review scope

- Subtle, keyboard-accessible Beta badge beside the existing logo.
- Beta information view using the existing typography, panels, motion, and navigation. Explains usage, experimental projections, non-guaranteed scores, independence from College Board, useful feedback, future evaluation, and privacy. Draft setup and results/comparison state survive navigation.
- Existing Formspree feedback extended with four categories, description, optional usefulness rating, and optional manual browser/device text.
- Existing logo, favicon, animations, score inputs, model coefficients, simulation features, pricing, and footer credit retained.

## Feedback configuration and review

The existing owner-selected endpoint is `https://formspree.io/f/mdeaydqy`. Its public URL is configured in `src/app/feedbackValidation.ts`; no private key is embedded. Only category/message and optional explicitly entered rating/device are sent. Authentication cookies and referrer information are omitted. Sending feedback is the only trigger for a Formspree request; the page loads no provider tracking/script widget.

The schema rejects unsupported categories, blank/short/oversized messages, invalid ratings, oversized device text, and unexpected fields. The UI also has a hidden bot trap, a pending-request lock, a 15-second timeout, and a 30-second cooldown after a confirmed submission. Failed or unconfirmed deliveries preserve the draft and never show a success message. A timeout cannot prove that the provider did not receive a message, so the copy says delivery could not be confirmed.

These are basic client-side spam defenses, not enforceable rate limiting. Review Formspree's service-side spam controls, allowed-domain settings, quotas, and any CAPTCHA requirements in the owner's dashboard. Do not add a private provider API key to the frontend. No settings changes or paid upgrade were made here.

Before inviting testers, send an ordinary non-sensitive test from the preview and confirm it appears in the Formspree inbox. Automated tests intercept requests and do not populate the inbox. Inbox receipt has not been verified from this environment. A success response is provider acceptance, not proof that any notification email was delivered.

## Privacy and retention

Simulation inputs remain in tab memory. They are neither attached to feedback nor used for analytics. Optional device details are typed by the visitor, never automatically collected. Free-text messages can still contain personal information; the form explicitly asks users not to supply it. Anonymous form fields do not hide network metadata: Formspree and Vercel may process IP addresses and connection logs under their policies.

Submitted feedback persists in Formspree for the owner to review/delete; closing a tab does not delete it. Review incoming messages for accidental identifiers, remove unnecessary personal information promptly, and select a documented deletion schedule before inviting minors. A short period such as 90 days is a policy option for the owner to evaluate, not an implemented automatic-retention guarantee. Keep research consent and score-data collection separate from ordinary usability feedback. No student datasets or research collection are introduced in Phase 1.

## Testing and review commands

```sh
npm run verify
npm run build:preview
```

The prepared cloud environment can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run verify`. The default suite includes existing simulation, scenario, pricing, and accessibility coverage plus the beta/feedback cases. Native dialog behavior, keyboard focus, error/retry handling, payload minimization, optional fields, spam controls, 320px/200% text reflow, and reduced motion are exercised. Provider responses are mocked. See PROGRESS.md for executed results rather than inferring a pass from a test list.

## Before approving Phase 1

1. Review the Beta badge, information page, and expanded form in the branch preview on a real phone and computer.
2. Confirm feedback receipt and review the service's spam, quota, domain, and deletion settings.
3. Check that a student understands “modeled trajectory” versus a promised score. Start with a small usability group; usability feedback cannot establish predictive accuracy.
4. Approve or request changes to Phase 1 before merging it into production or beginning Phase 2.

No validation dataset importer, evaluation metrics, developer dashboard, coefficient calibration, or scientific-accuracy claim is part of this branch.
