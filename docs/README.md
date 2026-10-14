# Documentation map

- [Repository setup and publishing](../README.md), [contributing](../CONTRIBUTING.md) and [private security reporting](../SECURITY.md).
- [Website specification](website-spec.md), [visual reference](visual-guide.html) and [implementation plan](implementation-plan.md).
- [Media provenance and licenses](media/README.md). Preserve screenshot, illustration, font and icon credits.
- Localized copy and route helpers: `src/content/index.ts`, with English/German catalogs alongside it. Published alpha links and platform assets: `src/data/releases.ts`.
- Layout metadata: `src/layouts/SiteLayout.astro`; crawler output: `src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. Downloads and guide pages describe platform limits; website checks do not establish native qualification.

The output gate is `scripts/check-output.mjs`, with focused failure fixtures in `scripts/check-output.test.mjs`. Preview and production output must both pass before publication. Analytics is injected by the hosting edge; no source beacon is needed.
