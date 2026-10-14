import { expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { checkOutput, contract } from './check-output.mjs';

function fixture(root) {
  const write = (path, content) => {
    const destination = resolve(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  };
  for (const locale of contract.locales) for (const path of contract.paths) {
    const route = contract.pageUrl(locale, path);
    const alternates = [...contract.locales, 'x-default'].map(lang => `<link href='${contract.origin}${contract.pageUrl(lang === 'x-default' ? 'en' : lang, path)}' hreflang=${lang} rel=alternate>`).join('');
    write(`${route.slice(1)}index.html`, `<html dir=${locale === 'ar' ? 'rtl' : 'ltr'} lang=${locale}><head><meta content="index, follow" name=robots><link href="${contract.origin}${route}" rel=canonical>${alternates}<script type="application/ld+json">${JSON.stringify({ softwareVersion: contract.softwareVersion, description: '<link rel="canonical" href="fake">' })}</script><meta content="https://static.cloudflareinsights.com/beacon.min.js" http-equiv="Content-Security-Policy"></head><body><a href="${contract.repository}">Source</a><a href="${contract.releaseUrl}">Release</a><a href="${contract.pageUrl(locale, 'downloads')}">Downloads</a></body></html>`);
  }
  write('404.html', '<html><head><meta name=robots content="noindex, follow"></head></html>');
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
