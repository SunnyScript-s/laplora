# Disket Mono typography checkpoint

October 15, 2026. The founder replaced the Homizio Nova request with the uploaded Disket Rostype.zip. This is the current typography direction; earlier font studies remain historical references.

## Typeface and permission

The archive contains Disket-Mono-Regular.ttf, Disket-Mono-Bold.ttf, and Disket-mono_EULA .pdf. Font metadata identifies Disket Mono, weights 400 and 700. The included Mariano Diez Free Font End User License Agreement is dated September 30, 2019. Clause a permits personal and commercial use; clause c says: “You may generate web font formats from the Font and use the generated Font on websites.” This explicitly covers the webfont conversion and website use here.

The full EULA text is retained in public/font-licenses/disket-mono-EULA.txt and included in the production build and standalone preview. Its restrictions on modification, resale, and redistribution still apply. These assets are website fonts, not an independently licensed font download product. Original desktop binaries and archive are not added to the application repository. WOFF2 conversion preserves the full glyph set and outlines; source/output SHA-256 hashes and provenance are recorded in src/styles/fonts/sources.json and public/font-licenses/sources.json. System Python supplies the fontTools/Brotli conversion tools; no application dependency was added.

## Design implementation

Disket Mono Regular provides headings; Bold provides the wordmark, primary/secondary action buttons, and large score highlights. Manrope remains for explanations, form labels/values, navigation text links, and chart annotations. The deliberate pairing gives the geometric font a clear role while keeping longer educational text easy to read.

Disket's lowercase characters have uppercase-shaped glyphs. Semantic source text still says “Laplora” and uses sentence case; no uppercase transform or altered glyph design is applied. Headline sizing, line height, and spacing accommodate the wider monospace letters. A narrower wordmark size at 360px and below preserves 200% text enlargement without clipping the home control. Real supplied weights are used, with synthetic styles disabled and local fallbacks configured.

## Review artifacts

- [Desktop landing](design/disket-landing-desktop.png)
- [Mobile landing](design/disket-landing-mobile.png)
- [Mobile results](design/disket-results-mobile.png)
- [Interactive preview](design/interactive-preview.html): download and open in a browser; regenerated from the actual production app.

See PROGRESS.md for final verification outcomes. Browser emulation and automated accessibility checks do not replace physical-device and screen-reader review.
