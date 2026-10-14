import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copy, pageUrl } from '../src/content/index.ts';
import { release } from '../src/data/releases.ts';

export const contract = { locales: Object.keys(copy), pageUrl, paths: ['', 'downloads', 'guide', 'about'], origin: 'https://usegarret.com', repository: 'https://github.com/iuliandita/garret', releaseUrl: release.releaseUrl, softwareVersion: release.tag.slice(1), downloads: true };

// Generated HTML uses quoted or unquoted attributes; script bodies are not tags.
function tags(html, name) {
  const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, '$1</script>');
  return [...markup.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(match => {
    const attributes = {};
    for (const attr of match[1].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attributes[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? attr[4] ?? '';
    }
    return attributes;
  });
}
const same = (actual, expected) => JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());

export function checkOutput(root, production) {
  const errors = [];
  const fail = (name, condition) => { if (!condition) errors.push(name); };
  const read = path => {
    try { return readFileSync(resolve(root, path), 'utf8'); }
    catch { errors.push(`Missing output: ${path}`); return ''; }
  };
  for (const locale of contract.locales) {
    for (const path of contract.paths) {
      const route = contract.pageUrl(locale, path);
      const html = read(`${route.slice(1)}index.html`);
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
      const links = tags(head, 'link');
      const canonical = links.filter(tag => tag.rel === 'canonical').map(tag => tag.href);
      const robots = tags(head, 'meta').filter(tag => tag.name === 'robots').map(tag => tag.content);
      fail(`${route}: canonical`, same(canonical, production ? [contract.origin + route] : []));
      fail(`${route}: robots`, same(robots, [production ? 'index, follow' : 'noindex, follow']));
      const language = tags(html, 'html')[0];
      fail(`${route}: locale`, language?.lang === locale);
      fail(`${route}: direction`, (language?.dir ?? 'ltr') === (locale === 'ar' ? 'rtl' : 'ltr'));
      const alternates = links.filter(tag => tag.rel === 'alternate' && tag.hreflang);
      const expected = [...contract.locales, 'x-default'].map(lang => `${lang}:${contract.origin}${contract.pageUrl(lang === 'x-default' ? 'en' : lang, path)}`);
      fail(`${route}: alternates`, same(alternates.map(tag => `${tag.hreflang}:${tag.href}`), production ? expected : []));
      const hrefs = tags(html, 'a').map(tag => tag.href);
      fail(`${route}: application source`, hrefs.includes(contract.repository));
      if (path === '' && contract.downloads) fail(`${route}: downloads`, hrefs.includes(contract.pageUrl(locale, 'downloads')));
      if ((path === '' && !contract.downloads) || path === 'downloads') fail(`${route}: release`, hrefs.includes(contract.releaseUrl));
      if (production) {
        const json = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => {
          try { return JSON.parse(match[1]); } catch { return {}; }
        });
        fail(`${route}: release metadata`, json.some(item => item.softwareVersion === contract.softwareVersion));
      }
      fail(`${route}: injected analytics`, !tags(html, 'script').some(tag => /cloudflareinsights|google-analytics|googletagmanager/i.test(tag.src ?? '') || 'data-cf-beacon' in tag));
    }
  }
  const notFound = read('404.html');
  const notFoundHead = notFound.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  fail('404: noindex', tags(notFoundHead, 'meta').some(tag => tag.name === 'robots' && tag.content === 'noindex, follow'));
  fail('404: no canonical', !tags(notFoundHead, 'link').some(tag => tag.rel === 'canonical'));
  fail('404: injected analytics', !tags(notFound, 'script').some(tag => /cloudflareinsights|google-analytics|googletagmanager/i.test(tag.src ?? '') || 'data-cf-beacon' in tag));
  const sitemap = [...read('sitemap.xml').matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => match[1]);
  const expectedPages = contract.locales.flatMap(locale => contract.paths.map(path => contract.origin + contract.pageUrl(locale, path)));
  fail('sitemap: exact routes', same(sitemap, production ? expectedPages : []));
  const robots = read('robots.txt');
  const wildcard = robots.split(/\n\s*\n/)[0];
  fail('robots: wildcard policy', /^User-agent: \*$/m.test(wildcard) && (production ? /^Allow: \/$/m.test(wildcard) && !/^Disallow:/m.test(wildcard) : /^Disallow: \/$/m.test(wildcard) && !/^Allow:/m.test(wildcard)));
  fail('robots: sitemap', production ? robots.includes(`Sitemap: ${contract.origin}/sitemap.xml\n`) : !/^Sitemap:/m.test(robots));
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = checkOutput(resolve('dist'), process.env.SITE_ENV === 'production');
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Validated ${contract.locales.length * contract.paths.length} ${process.env.SITE_ENV === 'production' ? 'production' : 'preview'} pages and 404.`);
}
