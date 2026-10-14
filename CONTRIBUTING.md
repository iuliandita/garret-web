# Contributing

Branch from `develop` and open a focused pull request back to `develop`; `main` is the release branch. Use conventional commits. Preserve the website's existing identity, artwork, source credits, language routes, theme persistence and accessibility behavior.

Install with `bun install --frozen-lockfile` using the Bun and Node versions in the [README](README.md). Run:

```sh
bun run check
bun test scripts/check-output.test.mjs
bun run build
bun run check:output
SITE_ENV=production bun run build
SITE_ENV=production bun run check:output
```

The output gate checks expected routes, language and RTL metadata, preview indexing restrictions, production canonical URLs, language alternates, sitemap and robots policies, source/release destinations, and absence of source-injected analytics. Existing typed catalogs enforce their shape; update every current locale when changing labels. These gates do not qualify native apps, download installation, live redirects, edge analytics or deployment.

For interface changes, exercise both themes, every affected locale (including RTL where supported), mobile and desktop widths, keyboard navigation, visible focus, reduced motion and no-JavaScript reading/download paths. State what you tested and what remains unverified.

## Documentation impact

Assess the entire PR. Update the affected setup, release, product, privacy, media or contributor guidance, or explain specifically why it stays accurate. Verify release assets before editing the existing release source; do not imply development screenshots prove published or native platform support. Preserve media credits. Use the [documentation map](docs/README.md) to find the relevant sources. No full automated documentation-impact assessment is claimed by the emitted-output gate.

Report website bugs through the issue form with the URL, locale, theme, browser/OS and reproduction. Redact credentials, tokens, personal data and private addresses from logs and screenshots. Report vulnerabilities [privately](SECURITY.md). Deployment remains a separate owner-authorized action.
