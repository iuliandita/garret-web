import { expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { checkOutput, contract } from './check-output.mjs';
import { release } from '../src/data/releases.ts';

const csp = `script-src 'self' 'sha256-${'A'.repeat(43)}='; base-uri 'none'; form-action 'none'; object-src 'none'`;
const securityMeta = `<meta content="${csp}" http-equiv="Content-Security-Policy">`;
const assets = [release.checksumsUrl, release.signatureUrl, ...Object.values(release.platforms).flatMap(platform => platform.options.map(option => option.url))].filter(Boolean);

function fixture(root) {
  const write = (path, content) => {
    const destination = resolve(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  };
  for (const locale of contract.locales) for (const path of contract.paths) {
    const route = contract.pageUrl(locale, path);
    const alternates = [...contract.locales, 'x-default'].map(lang => `<link href='${contract.origin}${contract.pageUrl(lang === 'x-default' ? 'en' : lang, path)}' hreflang=${lang} rel=alternate>`).join('');
    write(`${route.slice(1)}index.html`, `<html dir=${locale === 'ar' ? 'rtl' : 'ltr'} lang=${locale}><head><meta content="index, follow" name=robots><link href="${contract.origin}${route}" rel=canonical>${alternates}<script type="application/ld+json">${JSON.stringify({ softwareVersion: contract.softwareVersion, description: '<link rel="canonical" href="fake">' })}</script>${securityMeta}</head><body><a href="${contract.repository}">Source</a><a href="${contract.releaseUrl}">Release</a><a href="${contract.pageUrl(locale, 'downloads')}">Downloads</a>${assets.map(url => `<a href="${url}">Asset</a>`).join('')}<svg viewBox="0 0 24 24"><path d="M0 0" /></svg></body></html>`);
  }
  write('404.html', `<html><head><meta name=robots content="noindex, follow">${securityMeta}</head></html>`);
  write('_headers', readFileSync(new URL('../public/_headers', import.meta.url), 'utf8'));
  write('robots.txt', `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${contract.origin}/sitemap.xml\n`);
  write('sitemap.xml', `<urlset>${contract.locales.flatMap(locale => contract.paths.map(path => `<url><loc>${contract.origin}${contract.pageUrl(locale, path)}</loc></url>`)).join('')}</urlset>`);
}

test.each(['valid', 'wrong canonical', 'missing route', 'production as preview', 'duplicate beacon'])('%s output', scenario => {
  const root = mkdtempSync(resolve(tmpdir(), 'site-output-'));
  try {
    fixture(root);
    const home = resolve(root, 'index.html');
    if (scenario === 'wrong canonical') writeFileSync(home, readFileSync(home, 'utf8').replace(`href="${contract.origin}/" rel=canonical`, 'href="https://wrong.example/" rel=canonical'));
    if (scenario === 'missing route') unlinkSync(home);
    if (scenario === 'duplicate beacon') writeFileSync(home, readFileSync(home, 'utf8').replace('</body>', '<script src="https://static.cloudflareinsights.com/beacon.min.js"></script><script data-cf-beacon="{}" src="https://static.cloudflareinsights.com/beacon.min.js"></script></body>'));
    const errors = checkOutput(root, scenario !== 'production as preview');
    if (scenario === 'valid') expect(errors).toEqual([]);
    else {
      const expected = { 'wrong canonical': '/: canonical', 'missing route': 'Missing output: index.html', 'production as preview': '/: canonical', 'duplicate beacon': '/: injected analytics' }[scenario];
      expect(errors).toContain(expected);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test.each([
  ['missing CSP', 'index.html', html => html.replace(securityMeta, ''), '/: CSP'],
  ['duplicate CSP', 'index.html', html => html.replace(securityMeta, securityMeta.repeat(2)), '/: CSP'],
  ['unsafe inline', 'index.html', html => html.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"), '/: CSP'],
  ['missing hash', 'index.html', html => html.replace(`'sha256-${'A'.repeat(43)}='`, ''), '/: CSP'],
  ['wildcard script source', 'index.html', html => html.replace("script-src 'self'", "script-src 'self' *"), '/: CSP'],
  ...['base-uri', 'form-action', 'object-src'].map(name => [name, 'index.html', html => html.replace(`${name} 'none'`, `${name} 'self'`), '/: CSP']),
  ['404 CSP', '404.html', html => html.replace(securityMeta, ''), '404: CSP'],
  ...['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Content-Security-Policy'].map(name => [name, '_headers', html => html.replace(new RegExp(`  ${name}:.*\\n`), ''), `headers: ${name}`]),
  ['scoped headers', '_headers', html => html.replace('/*\n', '/downloads/*\n'), 'headers: X-Frame-Options'],
  ['changed copy', '_headers', html => html + '\n', 'headers: copied from public'],
  ['wrong release', 'index.html', html => html.replaceAll(`/releases/download/${release.tag}/`, '/releases/download/v-invalid/'), '/: release asset URLs'],
  ['external asset', 'downloads/index.html', html => html.replace(assets[2], 'https://wrong.example/installer.exe'), '/downloads/: release assets'],
  ['extra external asset', 'index.html', html => html.replace('</body>', '<a href="https://wrong.example/app.apk">Extra</a></body>'), '/: release asset URLs'],
  ['base prefix escape', 'index.html', html => html.replace(assets[0], assets[0].replace('SHA256SUMS', '../SHA256SUMS')), '/: release asset URLs'],
  ...['script', 'foreignObject', 'circle'].map(name => [name, 'index.html', html => html.replace('</svg>', `<${name}></${name}></svg>`), '/: inline SVG']),
  ['SVG event', 'index.html', html => html.replace('<svg ', '<svg onload="alert(1)" '), '/: inline SVG'],
  ['path event', 'index.html', html => html.replace('<path ', '<path oNcLiCk="alert(1)" '), '/: inline SVG'],
  ['unclosed SVG', 'index.html', html => html.replace('</svg>', ''), '/: inline SVG'],
  ['script outside SVG root', 'index.html', html => html.replace('<svg ', '<span aria-hidden=true><svg ').replace('</svg>', '</svg><script>alert(1)</script></span>'), '/: inline SVG'],
])('rejects %s', (_name, file, mutate, expected) => {
  const root = mkdtempSync(resolve(tmpdir(), 'site-output-'));
  try {
    fixture(root);
    const destination = resolve(root, file);
    writeFileSync(destination, mutate(readFileSync(destination, 'utf8')));
    expect(checkOutput(root, true)).toContain(expected);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
