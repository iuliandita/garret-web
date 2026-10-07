# garret website specification

Status: Manuscript direction approved and implemented. The site is published at usegarret.com. The visual guide preserves the design reference; the working site is built from `src/`. The implementation plan is in `implementation-plan.md`.

## Purpose

Help novelists understand garret, see the application working, select a suitable build, and start writing. Establish usegarret.com as the official product site. Make verified product facts easy for people, search engines, and browsing agents to find.

The application is free, open source, offline, and account-free. The website must explain those promises plainly, without implying encrypted working manuscripts, automatic cloud sync, or desktop feature parity on Android. There is no backend, account system, subscription or email collection. The website uses disclosed Cloudflare Web Analytics through hosting injection; the offline application remains separate.

## References and independent identity

The current [garret site](https://iuliandita.github.io/garret/) supplies the product story, real screenshot gallery, feature vocabulary, backup guidance, download links, and alpha status. Preserve their factual substance while improving navigation and pacing.

The owner's portfolio informs the initial structure: readable typography, restrained navigation, generous space, accessible light/dark themes, and direct copy. Keep personal biography, technical status panels, slash navigation, numbered section labels, a command palette, and a project graph out of garret's site. Its audience is writers rather than infrastructure practitioners.

garret's identity is binding: lowercase name; existing connected-script wordmark with one vermilion full stop; mostly monochrome. Use the supplied ink and paper artwork. The website uses warm paper and charcoal tones, restrained vermilion details, and an original graphite notebook illustration. Keep the wordmark unchanged; avoid gradients, extra decorative dots, and continuous animation. The wordmark is not the body font.

## Visual directions

### Manuscript: selected

A publication-like page with a serif display heading, readable sans body text, plain navigation, and an adjacent real editor capture. The editorial typography is justified by the manuscript and book-making subject. The existing garret site already uses Georgia for display text; retain that character in the first exploration rather than add a font dependency before reviewing the design.

The headline and download action appear beside the screenshot on wide screens. On phones, copy and download action come first, followed by a full-width screenshot. This brings the working app into the initial view while preserving the writing identity. Whitespace provides grouping; avoid enclosing every feature in a card.

### Studio: comparison reference

The same content and brand, with a sans display heading and a larger screenshot below a compact opening. This borrows more of the portfolio's straightforward contemporary typography. It is stronger on product demonstration, but less distinctive as a writing site.

The visual guide opens on the selected Manuscript direction and lets the reviewer compare the earlier Studio alternative and light/dark themes. Studio is retained as a reference, not a second implementation target. These controls are review tools, not requirements for the production interface.

## Design system

- Light: paper `#f8f5ef`, ink `#262421`, muted text `#625d56`, separators `#d9d2c8`, accent `#b6422d`.
- Dark: charcoal `#211f1c`, text `#f0ebe3`, muted text `#bbb3a8`, separators `#4b443b`, accent `#ef9a83`.
- Keep the logo's vermilion unchanged in both modes. Use restrained vermilion for editorial rules, chapter numbers, and selection indicators. Product screenshots retain their original colors.
- Proposed display type: Georgia, with serif fallback. Body and navigation: system sans initially. Evaluate locally hosted alternative fonts only after direction approval.
- Content width: about 1200px. Comfortable paragraph width: 55-65 characters. Body: 17-18px; mobile headlines remain readable without clipping.
- Controls use monochrome fill or plain underlined links, visible focus states, and sufficient touch area. A subtle small radius on buttons is acceptable; screenshots stay rectangular.
- Whole-page theme follows system preference until the writer chooses light or dark with the sun/moon button; that choice persists. The button has a localized accessible action label and no visible appearance label. Do not switch section palettes for decoration.
- No entrance delays, scroll hijacking, continuous animation, or motion needed to understand the page. Any later enhancement respects reduced motion.

## Information architecture and reader journey

### Home

Navigation: The studio, Downloads, Guide, Source. Language and theme controls remain compact and accessible.

Opening: the established promise, "A writing studio for the whole book." Supporting copy: "Manuscript, characters, research, and revisions for your novel. Works offline. No account. Every feature is free." One primary download action and one link to explore the studio. Use a real editor screenshot, with descriptive alternative text and a larger-image view.

Lead with three core benefits: focused writing, connected story planning, and preparing a finished book. Move detailed features into a manual, swipeable chapter browser with category links, previous/next controls, keyboard navigation, and no automatic rotation. Keep every feature in static HTML and allow native scrolling without JavaScript. The chapters cover:

1. Write: scenes, chapters, focus mode, light/dark themes, search, and comments.
2. Organize: story bible, cast, appearances, synopses, research, outlines, and timeline.
3. Revise: DOCX review exchange, attributed proposals, scene history, revision passes, and tasks.
4. Prepare: Markdown, DOCX, EPUB, book design, front/back matter, covers, pen names, and platform-specific PDF proof availability.

Then explain local ownership and manual backups, distinguish Android's library/scene editor from desktop capabilities, and offer platform downloads. A small footer links source, issue reporting, license, screenshot credits, and optional support. No invented testimonials, usage counts, awards, or comparison scores.

### Downloads

Provide explicit Linux, Windows, macOS, and Android choices. Operating-system detection suggests a choice on the main download action, with a monochrome OS symbol. It never hides other platforms or guesses Mac architecture. Identify the current alpha release honestly and link to actual artifacts in the application's GitHub releases. macOS requires native tester feedback; platform requirements and exclusions need a compact factual explanation. Verify release assets and current app documentation before publishing any filename or compatibility claim.

Prefer a build-time release manifest or explicit curated links over a required client-side API fetch. If no suitable artifact is available, explain that and link to the release listing rather than offer a broken button. Do not mirror binaries in this repository. Include a visible source-build route.

### Guide

Start with installing, creating/opening a book, writing the first scene, and keeping a safe copy. Expand to revision and publishing only where useful. Explain that books remain local, encrypted archives are manually created, restoring creates a separate book, and working files should stay outside cloud-synced folders. Encryption of exported archives must not be described as encryption of the working manuscript. Do not imply desktop/Android sync.

### Privacy and about

Keep concise pages or guide sections explaining local operation, site privacy, licensing, credits, and the project's purpose. Avoid a separate privacy policy full of promises that deployment has not verified. Cloudflare Web Analytics measures website visits without analytics cookies. Google Search Console adds no site script. Keep this disclosure separate from application privacy. No third-party embeds, forms or remote fonts.

## Languages and accessibility

Initial production content: English and German, with matching routes and a language selector that preserves the current page where available. German is a planned requirement; the visual guide contains English design copy only. Translations must preserve alpha and platform qualifications.

Use semantic landmarks, one page heading, logical heading order, a skip link, visible keyboard focus, meaningful link labels, appropriate image alternatives, and readable contrast. Theme/language controls and screenshot enlargement work with keyboard and touch. Content reflows at 320px and at 200% zoom. Theme controls reflect their state and do not rely on color alone.

## Search and agent discovery

Publish meaningful HTML at build time, including feature descriptions, platform requirements, and guide text. Use consistent garret naming, page titles and descriptions, canonical URLs under usegarret.com, social preview metadata, a sitemap, language annotations, and appropriate SoftwareApplication structured data derived from verified facts. Never invent ratings or reviews.

Make product promises and limitations explicit. Allow desired search crawlers and user-triggered browsing without indiscriminate challenges. Configure search indexing and model-training access independently. Prefer readable documentation and ordinary links over speculative optimization files. A special agent API is outside initial scope.

## Technical recommendation

Use Astro's static output with native CSS and small JavaScript enhancements for theme selection and screenshot viewing. This keeps page content available without JavaScript and provides room for localized guide pages. Plain HTML/CSS is a viable lower-dependency alternative; a client-heavy application framework is unnecessary for the current scope. This is a proposal, not installed infrastructure; verify current framework and deployment documentation during implementation.

Recommend deploying with Cloudflare Workers Static Assets, using usegarret.com as canonical host and www redirecting to the root. Cloudflare recommends Workers Static Assets for new projects; a purely static site needs no Worker script. Verify repository integration and the applicable free-plan limits before setup. The domain purchase budget does not authorize additional paid hosting or subscriptions. Preview deployments must not become duplicate indexed sites.

Technical sources: [Astro's build-time static output](https://docs.astro.build/en/guides/on-demand-rendering/) and [Cloudflare's recommendation for new static sites](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/).

## Existing GitHub Pages site

Do not retire it now. Keep the current site serving while this draft is reviewed and the replacement is built. Once the new site is verified live on usegarret.com, replace the old marketing page with a small permanent fallback page linking to the new site and a redirect where supported. Map existing useful anchors and paths to their replacements where feasible.

A server-side permanent redirect is preferred when the hosting platform supports it. If the retained GitHub Pages endpoint only permits static files, use an immediate HTML redirect with a visible destination link, and account for old asset/document links rather than claiming all URLs were redirected. Update the application repository's homepage, README links, and release-facing links through a separate PR. Keep the application screenshot gallery and credits useful; retiring duplicated marketing content does not require deleting documentation.

Avoid maintaining two independent marketing sites. No Pages disablement, DNS changes, or production deployment is part of this specification work.

## Acceptance and review

Before implementation, review the visual direction, opening copy, page scope, and migration recommendation. Before launch, check keyboard access, responsive layouts, both themes and languages, link/artifact accuracy, metadata, screenshot credits, build output, and domain/TLS behavior. Capture desktop and mobile views for review. Focus checks on the shipped behavior; do not introduce a large test suite for static copy.

Launch only after the app claims and download routes are verified. Release artifacts and application support stay in the application repository. The website has its own repository and deployment cycle.
