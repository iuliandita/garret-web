# garret Website Implementation Plan

**Goal:** Build the selected Manuscript website for usegarret.com with truthful product information, platform downloads, and a short getting-started guide.

**Architecture:** Astro generates localized static HTML. Shared layouts and native CSS provide the Manuscript identity; small browser scripts handle theme preferences and image enlargement. Download data is curated from verified application releases, with no runtime API dependency.

**Tech stack:** Astro static output, TypeScript, native CSS, Bun, and Cloudflare Workers Static Assets. Resolve current supported versions during setup and commit the dependency lockfile.

**Spec:** [Website specification](website-spec.md). [Visual reference](visual-guide.html). Manuscript is the implementation target; Studio is comparison history only.

**Execution:** Recommend implementation in the current session, followed by one independent branch review. Workers must use separate worktrees when concurrent. Plan approved; implementation follows this plan. No repeated review rounds without new findings.

## Global constraints

- Lowercase garret, existing script wordmark, one vermilion dot, monochrome otherwise; Georgia display type and system sans body initially.
- Keep `#fafafa`/`#202020` light surfaces and `#181818`/`#ededed` dark surfaces; muted text `#595959`/`#b4b4b4`.
- English and German pages; 320px reflow; keyboard access, visible focus, readable contrast, and reduced-motion support.
- No account, backend, email collection, tracking, paid service, remote font, or mirrored application binary.
- Preserve local-book/manual-archive truth, Android scope, alpha status, and platform qualifications.
- Application releases remain the download source. Keep the existing marketing site live until the replacement is verified.
- Changes use feature branches and PRs. No direct shared-branch commits or pushes. No production deployment or retirement in the initial implementation PR.
- Use focused behavior checks and temporary browser probes. Do not add permanent tests that mirror static copy or a large test framework solely for this site.

## Review focus

1. An unavailable or removed platform artifact must lead to an honest release-listing fallback, never an invented filename or hidden platform choice. Check in Task 2.
2. Disabled JavaScript must leave all product text, navigation, language choices, and download links usable. Check in Tasks 1 and 3.
3. Blocked browser storage must not break theme selection or page loading. Check in Task 3.
4. German text and 200% zoom must not push controls or content outside the viewport. Check in Task 3.
5. Preview hosts must not claim to be the live canonical site or become indexed duplicates; redirects must not strand useful old links. Check in Tasks 4 and 5.

## File map

- `package.json`, `bun.lock`, `astro.config.mjs`, `tsconfig.json`: static build, dependency pins, and type checking.
- `src/layouts/SiteLayout.astro`: document metadata, language, header, footer, and theme initialization.
- `src/styles/site.css`: selected Manuscript layout and whole-page light/dark tokens.
- `src/components/Header.astro`, `Footer.astro`, `Screenshot.astro`, `DownloadList.astro`: shared navigation, credits/support, accessible media, and platform choices.
- `src/content/en.ts`, `de.ts`: typed localized copy with matching keys.
- `src/data/releases.ts`: curated release metadata and verified platform links.
- `src/pages/index.astro`, `downloads.astro`, `guide.astro`, `about.astro`, plus matching files under `src/pages/de/`: English root pages and German equivalents.
- `src/scripts/theme.ts`, `screenshot-viewer.ts`: progressively enhanced browser controls.
- `public/brand/`, `public/images/`: existing artwork and credited captures; no generated imitation screenshots.
- `public/robots.txt`, `public/sitemap.xml`, `public/_headers`, `wrangler.jsonc`: indexing, static security headers, and proposed deployment configuration.
- `.github/workflows/interface.yml`: locked install, type check, and static build.
- `README.md`, `docs/media/README.md`: commands, hosting instructions, and media provenance.

## Task 1: Working localized home page

**Files:** build configuration, localized copy modules, SiteLayout, Header, Footer, Screenshot, site CSS, English/German index routes, public brand/images, README.

**Interfaces:** `Locale = 'en' | 'de'`; `SiteLayout` takes `locale`, `title`, `description`, `path`, and page content. `Screenshot` takes `src`, optional `darkSrc`, `alt`, `width`, `height`, and `caption`. Each copy module implements the same typed keys.

- [x] Set up Astro static output with `dev`, `build`, and `check` package scripts. `check` runs Astro's type check; pin resolved dependency versions and use a locked install in CI -> verify: `rtk bun install --frozen-lockfile` succeeds from a fresh install.
- [x] Implement the selected hero, write/organize/revise/prepare sections, ownership explanation, Android scope, footer, and mirrored German route. Copy only the needed public app screenshots, preserving credits -> verify: `rtk bun run check` and `rtk bun run build` exit zero; `dist/index.html` and `dist/de/index.html` contain headings and content.
- [x] Open both routes with JavaScript disabled and inspect the default layout -> verify: core text, anchors, source link, language navigation, and download route are usable; the hero uses a real capture.
- [x] Commit the reviewed home-page batch on the feature branch.

## Task 2: Verified downloads and useful guide

**Files:** releases data, DownloadList, English/German downloads/guide/about routes, corresponding copy modules.

**Interfaces:** release data records `tag`, `releaseUrl`, `channel: 'alpha' | 'stable'`, and a complete record of `linux`, `windows`, `macos`, `android`. Each platform has `label`, `assetUrl: string | null`, and a localized requirements key. A null asset displays a release-listing link and an availability explanation.

- [x] Read the application's current README, release metadata, and relevant platform notes; check each proposed asset exists before recording its exact URL -> verify: release and artifact requests succeed without downloading binaries, and requirements agree with the app documentation.
- [x] Build explicit platform choices, alpha status, source-build route, and graceful missing-artifact state -> verify: a temporary null macOS asset displays the release-listing fallback while the other three choices remain visible; restore the real data afterward.
- [x] Write the short installation/first-book/first-scene/backup guide, about/privacy explanation, and German equivalents -> verify: working manuscript encryption and automatic sync are not claimed; the recovery key and separate restored book are explained correctly.
- [x] Commit the content/download batch.

## Task 3: Accessible interaction and responsive finish

**Files:** theme and screenshot-viewer scripts, SiteLayout, Screenshot, shared controls, site CSS.

**Interfaces:** theme preference is `'auto' | 'light' | 'dark'`, stored under `garret-theme`; automatic resolves from system preference. `initThemeControls(): void` tolerates blocked storage. `initScreenshotViewer(): void` enhances normal image links; without JavaScript those links open the image directly.

- [x] Add system-aware theme initialization and accessible preference controls without a visible theme flash -> verify: light/dark/automatic choices work, reload preserves the chosen preference, and a temporary blocked-storage probe still permits switching themes.
- [x] Add keyboard/touch image enlargement using a native dialog, a labeled close control, Escape handling, and restored trigger focus -> verify: Tab remains within the open dialog and closing restores focus; ordinary image links still work without scripting.
- [x] Check both locales/themes at 320px, 375px, desktop width, and 200% zoom -> verify: no horizontal overflow, clipped controls, overlapping text, unreadable contrast, or lost primary action. Capture representative desktop/mobile views locally.
- [x] Commit the interaction/layout batch. Do not broaden testing unless these checks uncover a new concern.

## Task 4: Search, build checks, and deployment preparation

**Files:** metadata in SiteLayout, robots/sitemap/headers, wrangler configuration, interface workflow, README.

**Interfaces:** canonical root is `https://usegarret.com`; English routes use `/`, `/downloads/`, `/guide/`, `/about/`; German equivalents use `/de/`. Every page exposes matching language alternates. Deployment asset directory is `dist`.

- [x] Add accurate titles/descriptions, canonical URLs, language alternates, social metadata, and SoftwareApplication data from verified release facts; add sitemap and crawler policy -> verify: built HTML and sitemap list actual routes, contain no fabricated ratings, and preserve independently selectable search/training crawler policy.
- [x] Configure static headers and a Workers Static Assets deployment target, following current official documentation; document preview noindex controls and a www-to-root redirect plan -> verify: build output contains the expected headers; preview indexing protections are checked before any remote preview publication. Do not deploy in this task.
- [x] Add CI with locked install, type check, and build; require the resulting check on develop/main after it exists -> verify: workflow succeeds on the implementation PR before declaring the site ready.
- [x] Run the focused final checks, one independent review, and a public-content/secret scan. Resolve in-scope findings and commit.

## Task 5: Launch and old-site transition, after approval

**Files:** deployment configuration and a separate app-repository PR for homepage/README links, its website page/build script, and Pages workflow only as needed.

- [ ] Present the built site and verified download/content results before the production launch step -> verify: the reviewed artifact matches the PR build; no paid subscription or extra domain is introduced.
- [ ] Deploy the reviewed static output using the existing account on a suitable free tier and configure root/www -> verify: HTTPS works, expected pages return successfully, canonical metadata is correct, and www redirects without a loop.
- [ ] Only after the new site works, propose the app-repository transition PR with a visible fallback link and supported redirect from its Pages landing page; retain useful asset/doc paths -> verify: the old homepage and existing feature/download anchors take readers to useful new destinations or clear fallback links. Do not disable the old endpoint first.
- [ ] Update verified private domain notes and repository homepage settings; document any remaining limits. Launch and migration are separate from the initial implementation review.
