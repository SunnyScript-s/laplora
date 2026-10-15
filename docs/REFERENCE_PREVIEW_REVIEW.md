# Glass reference, preview repair, and font prerequisite

October 14, 2026 · Founder-requested visual refinement

## Reference and implementation

Read the supplied [reference image](https://i.pinimg.com/originals/a3/0c/4f/a30c4f26fc435774e54432112e6c48cd.png). Its defining features are amber glass bubbles, broad yellow/orange curved ribbons, white orbital lines, and strong curved specular highlights.

ReferenceAtmosphere.tsx adds original local vector artwork using these general visual features. The linked image was inspected, not copied into the application or fetched by students' browsers. The earlier rotating ring remains, and glass bubbles have slow vertical motion. All decorative layers are hidden from assistive technology and cannot intercept controls. Existing Pause motion and system reduced-motion behavior remain active. A light veil and warm near-white panels preserve readable foreground content.

## Blank preview

There was no development server running when the blank preview was reported. Restarted the server, changed its development bind address to 0.0.0.0 on port 5173 for preview access, and verified actual browser rendering with HTTP 200, the correct landing heading, and no runtime or failed-request errors. The development session was intentionally left running for review. Live processes still must restart after restoration.

Opening the Codex browser panel returned queued; that is not confirmation that the user's browser pane loaded the cloud URL. This task has no callable port-forwarding capability, so end-to-end desktop-to-cloud routing cannot be asserted from local browser rendering.

Added a self-contained fallback: [interactive-preview.html](design/interactive-preview.html). Download/open it in a browser when the panel cannot reach the cloud server. This is the actual compiled application, not an inert mockup. The generator embeds the bundled script, CSS, WOFF2 fonts, favicon, and font notices in one HTML file. No CDN or server is required for those assets. Official source links still navigate externally when clicked.

The independent browser verification intercepted only the initial HTML request and aborted every other network request. The app loaded embedded fonts and completed the full synthetic student flow to the documented 1240 endpoint with no dependent requests or runtime errors. This verifies independence from hosted assets; the user's specific browser panel and local-file policy were not directly inspected.

Regenerate using npm run build:preview. The source helper scripts/build-preview.mjs reads the production build rather than maintaining a second implementation. A later font change will require regeneration and retaining its actual permissions/notices.

## Homizio Nova status

The founder requested **Homizio Nova by Álvaro Thomáz**, superseding the previous font choice once webfont permission is confirmed. The exact desktop download is available from the author's [DaFont listing](https://www.dafont.com/homizio-nova.font). Its note says “Free for personal & commercial use” and then “For a free webfont license, please visit http://atfg.co/font/homizio-nova”.

Attempted the separate licensing URL; the proxy returned 403. The desktop archive contains Regular/Light and italic font files, with no license document. Font metadata identifies Homizio Nova and Alvaro Thomaz Fonts, with all-rights-reserved copyright text but no embedded license grant. Alternative publisher/archived sources did not establish permission for this exact family's web embedding. FontSpace's separate Homizio family is a different font and was not substituted.

No Homizio Nova binary has been added to the repository, preview, or production build. Current Outfit/Manrope fonts remain visible. Requested a webfont license or working author-permission link from the founder while completing independent artwork/preview work. This is a concrete missing prerequisite, not a request to reapprove the design or a claim that the font requires payment.

## Verification and review files

- TypeScript and production/standalone build passed.
- Verified live development rendering and a full offline-asset preview flow.
- Reviewed [desktop](design/reference-glass-desktop.png) and [mobile](design/reference-glass-mobile.png) captures using a fixed synthetic October 14 profile.
- Targeted checks exercise landing rendering/fonts/keyboard fit, motion/reduced motion, and nine accessibility states across five browser projects. See PROGRESS.md for final actual results and the WebKit timing correction.
- Model, coefficients, input policies, privacy architecture, and original DEVELOPMENT_PLAN.md are unchanged. No unnecessary engine test rerun or deployment.

Homizio Nova remains pending its separate webfont permission. The live app and standalone preview continue to work with the existing fonts while that prerequisite is unresolved.
