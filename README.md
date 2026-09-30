# garret-web

The website for [garret](https://github.com/iuliandita/garret), a free, local-first writing studio for novelists.

Primary domain: [usegarret.com](https://usegarret.com).

The Manuscript site is built with Astro, TypeScript, and native CSS. English and German pages cover the studio, downloads, getting started, and privacy. The main download suggests a platform without hiding other choices. Theme selection and image enlargement are progressive enhancements; reading and downloading work without JavaScript.

Deployment is pending review. The existing application website remains live.

- [Website specification](docs/website-spec.md)
- [Interactive visual guide](docs/visual-guide.html)
- [Implementation plan](docs/implementation-plan.md)
- [Media sources and credits](docs/media/README.md)

To view the guide locally, run `python -m http.server 8000 --bind 127.0.0.1` from this repository and open `http://127.0.0.1:8000/docs/visual-guide.html`.

## Development

Use Bun 1.4.2 and Node.js 22.12+ (Node 24 in CI).

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun run build
bun run preview
```

Default builds are previews: noindex, disallowed crawling, no official canonical URLs, and an empty sitemap. For the official site only, run `SITE_ENV=production bun run build`. Production builds emit canonical URLs, language alternates, social metadata, application structured data, and the eight-page sitemap. Search and browsing crawlers can read the production site; GPTBot and CCBot are disallowed separately. These are crawler requests, not access controls.

Release links are curated in `src/data/releases.ts`. Check the actual release assets before updating them. A null platform asset shows an honest release-listing fallback. macOS keeps separate Apple Silicon and Intel choices.

## Hosting preparation

`wrangler.jsonc` targets Cloudflare Workers Static Assets, with no Worker script or backend. For local routing/header checks, build and run `bunx wrangler dev --local`. Paid hosting is not configured. Authentication stays in the environment, never in this repository.

After launch approval, build the production output, configure the root custom domain, and deploy the reviewed artifact. Configure a Cloudflare redirect from www to the root, preserving path and query. Keep workers.dev and version preview URLs disabled for production. Build remote previews separately with the default noindex output, and verify crawler headers before publication.

Verify HTTPS, both languages, canonical URLs, download links, static headers, and the www redirect before changing the old GitHub Pages landing page. That transition belongs in a separate application-repository PR, preserving useful old links and a visible fallback.

`develop` is the integration branch; `main` is the release branch. Changes land through pull requests. Feature branches are squashed into `develop`; release promotions use merge commits.

Licensed under GPL-3.0-or-later. Download artifacts remain in the application repository's GitHub releases.
