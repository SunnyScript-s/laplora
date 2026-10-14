# Orange theme and accessibility review

October 14, 2026 · Founder-requested visual refinement and accessibility/browser milestone

## Design interpretation

The founder requested a vibrant orange “DORfic” theme and a spinning background. The implementation interprets this as warm ivory, vivid orange environmental shapes, a glossy sphere and tilted orbital ring with satellites, warm charcoal text, and readable near-white panels. This describes our design choice rather than claiming a canonical definition of the style. It explicitly supersedes the earlier aqua/green direction; DEVELOPMENT_PLAN.md remains the unmodified source export.

Shared CSS tokens now style buttons, focus rings, explanatory surfaces, SVG curves, grid/goal markers, and matching legend dots. Current-plan curves are burnt orange; comparisons use slate violet and dashed strokes. Typography remains Outfit/Manrope with a capital L in Laplora. The favicon and browser theme color match the new palette.

The ring rotates once every 30 seconds using transform animation behind content. Its satellites and asymmetric highlights make the motion perceptible without moving the form or text. The background is hidden from assistive technology and never intercepts input. Pause motion freezes the ring at its current position; resume continues it. System reduced motion removes rotation and other animations independently.

## Accessibility repairs

- Navigation and long primary actions wrap instead of clipping at 320px with a doubled root font size.
- Chart section buttons wrap at enlarged text sizes; narrow metric cards can stack and wrap values.
- The motion control has a 44px minimum height. Its previous small hit area failed a real Firefox click; enlarging it resolved the interaction.
- Custom-plan invalid fields expose aria-invalid and describe their error summary, including numeric controls and study-method checkboxes.
- Existing focus management, collapsed-field error opening, table alternatives, explicit axis/range wording, and native labeled controls remain in use.

Representative WCAG contrast calculations: warm charcoal #30231e is 14.93:1 against panel #fffdf9; muted #6d5143 is 7.11:1 against that panel and 4.94:1 against warm #ffcc9d. White on the primary #b83d0b is 5.66:1. Controls use #987b67 outlines (3.85:1 against the panel). Small links use a deeper #9e3008 token because the lighter primary color did not meet 4.5:1 against a stronger orange backdrop. Decorative bright orange is not used behind white body text.

Automated scans check WCAG 2 A/AA, 2.1 AA, and 2.2 AA rules exposed by axe-core. They cover landing, baseline, baseline errors, goal, study, review, results with comparison/data table, custom-plan errors, and How It Works with inactive results hidden. The reflow test exercises all seven views at 320px and 200% root text. This tests text enlargement and narrow reflow; it is not a claim of testing every browser zoom behavior.

## Browser workflow

The complete local suite passed **50/50 runs**, with no failures or skips, after the reflow, hit-area, and error-association fixes. TypeScript checking and production build passed. A final deep-orange text contrast refinement was followed by **five additional passing accessibility runs**, one per browser project; each scans nine screens/states. A separate real-browser check verified rotation advances, pause holds its position, resume continues, and reduced motion removes it.

The default suite has 20 runs on desktop/mobile Chromium. LAPLORA_CROSS_BROWSER=1 additionally enables desktop Firefox and desktop/mobile WebKit, for 50 runs across five projects. WebKit uses desktop Safari/iPhone viewport settings on Linux; this is not a test on physical Apple hardware or the shipping Safari application. CI now installs all three engines and enables the expanded suite; its remote execution remains unverified.

Cloud readiness initially failed for environmental reasons. Firefox's profile registry tried to write below the read-only home directory; workspace XDG configuration/cache paths resolved that. Its renderer then failed writing /proc/self/uid_map under the outer cloud sandbox. MOZ_DISABLE_CONTENT_SANDBOX=1 is scoped to local test processes in the prepared helper. This changes Firefox's inner sandbox for the local test run; the application and CI configuration do not set it.

WebKit needed additional native libraries. The standard install-deps command required root authentication unavailable here. Instead, a workspace-only APT cache retrieved signed Debian trixie metadata using the installed Debian archive keyring and HTTPS proxy. Package checksums/TLS/signature verification stayed enabled; required .deb files were extracted under /workspace/.cache/laplora-webkit-deps/lib-root, with no system installation or profile/home edits.

Playwright's optional-library discovery looks in the system ldconfig cache, and the packaged WebKit wrapper replaces LD_LIBRARY_PATH. The dynamic loader was checked against the extracted libraries, then WebKit was launched successfully using Playwright's supported executablePath override and its standard bundle paths. The test configuration supports LAPLORA_WEBKIT_EXECUTABLE_PATH for this cloud-only selection; normal CI uses managed browsers with installed system dependencies. No Playwright assertion or application check is disabled or skipped.

From the prepared cloud checkout:

```sh
source /workspace/.cache/laplora-browser-env.sh
npm run test:e2e
```

The helper selects the cached binaries, workspace XDG paths, local library path, Firefox test-process override, and cross-browser projects. It contains paths/settings, not credentials. Installed caches are retained files; live servers must restart. If caches are missing on a different machine, use the standard README browser installation flow or reproduce the workspace-only setup rather than assuming snapshot restoration worked.

## Previews and limits

- [Orange desktop landing](design/orange-landing-desktop.png) and [mobile landing](design/orange-landing-mobile.png)
- [Orange baseline setup](design/orange-setup-desktop.png)
- [Orange desktop results](design/orange-results-desktop.png) and [mobile results](design/orange-results-mobile.png)
- [Actual background motion recording](design/orange-background-motion.webm), including pause and resume

Previews use the documented synthetic example and a fixed October 14 calendar date. No real student data is used. The model, coefficients, input policy, privacy architecture, and original development plan were not changed. Unit/model tests were not rerun for these presentation/browser changes; the prior 123-test engine result remains historical evidence.

Real screen-reader and physical-device testing, private student beta feedback, and slow-device/network performance measurements remain necessary. Automated scan results and Linux browser tests are a useful checkpoint, not full accessibility compliance, scientific calibration, or release approval. See PROGRESS.md for the actual final test outcomes and local commit.
