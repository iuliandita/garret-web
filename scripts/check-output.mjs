import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copy, pageUrl } from '../src/content/index.ts';
import { release } from '../src/data/releases.ts';

export const contract = { locales: Object.keys(copy), pageUrl, paths: ['', 'downloads', 'guide', 'about'], origin: 'https://usegarret.com', repository: 'https://github.com/iuliandita/garret', releaseUrl: release.releaseUrl, softwareVersion: release.tag.slice(1), downloads: true };
const releaseBase = `${contract.repository}/releases/download/${release.tag}/`;
const releaseAssets = [release.checksumsUrl, release.signatureUrl, release.androidInstructionsUrl, ...Object.values(release.platforms).flatMap(platform => platform.options.map(option => option.url))].filter(url => url !== null);
const publicHeaders = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');

function underReleaseBase(value) {
  try {
    const filename = value.slice(releaseBase.length);
    return value.startsWith(releaseBase) && new URL(value).href === value && filename !== '' && !/[/\\%?#]/.test(filename);
  } catch { return false; }
}

function validCsp(head, production) {
  const policies = tags(head, 'meta').filter(tag => tag['http-equiv']?.toLowerCase() === 'content-security-policy');
  if (policies.length !== 1) return false;
  const entries = (policies[0].content ?? '').split(';').map(part => part.trim().split(/\s+/)).filter(([name]) => name);
  const directives = new Map(entries.map(([name, ...values]) => [name, values]));
  const scripts = directives.get('script-src') ?? [];
  const hash = value => /^'sha(?:256-[A-Za-z0-9+/]{43}=|384-[A-Za-z0-9+/]{64}|512-[A-Za-z0-9+/]{86}==)'$/.test(value);
  return directives.size === entries.length && !entries.flat().includes("'unsafe-inline'") &&
    scripts.includes("'self'") && scripts.some(hash) && scripts.every(value => hash(value) || value === "'self'" || (production && value === 'https://static.cloudflareinsights.com/beacon.min.js')) &&
    ['base-uri', 'form-action', 'object-src'].every(name => same(directives.get(name) ?? [], ["'none'"]));
}

function validInlineSvg(html) {
  const svgs = [...html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg\s*>/gi)];
  const icons = [...html.matchAll(/<span\b[^>]*\baria-hidden=["']?true["']?[^>]*>([\s\S]*?)<\/span\s*>/gi)].map(([, content]) => content).filter(content => /<svg\b/i.test(content));
  return svgs.length === [...html.matchAll(/<svg\b/gi)].length && [...svgs.map(([svg]) => svg), ...icons].every(svg =>
    [...svg.matchAll(/<\/?([^\s/>]+)[^>]*>/g)].every(([, name]) => /^(svg|path)$/i.test(name)) &&
    tags(svg, '(?:svg|path)').every(attributes => Object.keys(attributes).every(name => !/^on/i.test(name)))
  );
}

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
  fail('release assets: base', releaseAssets.every(underReleaseBase));
  const checkSecurity = (html, route) => {
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    fail(`${route}: CSP`, validCsp(head, production));
    fail(`${route}: inline SVG`, validInlineSvg(html));
    const urls = tags(html, '[a-z][a-z0-9:-]*').flatMap(tag => [tag.href, tag.src].filter(Boolean));
    const downloads = urls.filter(url => /\/releases\/download\//i.test(url) || /^(?:https?:)?\/\/.*\/(?:SHA256SUMS(?:\.asc)?|[^/?#]+\.(?:exe|msi|zip|dmg|apk|deb|rpm|AppImage|tar\.gz))(?:[?#]|$)/i.test(url));
    fail(`${route}: release asset URLs`, downloads.every(underReleaseBase));
  };
  for (const locale of contract.locales) {
    for (const path of contract.paths) {
      const route = contract.pageUrl(locale, path);
      const html = read(`${route.slice(1)}index.html`);
      checkSecurity(html, route);
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
      if (path === 'downloads') fail(`${route}: release assets`, releaseAssets.filter(url => url !== release.androidInstructionsUrl).every(url => hrefs.includes(url)));
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
  checkSecurity(notFound, '404');
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
  const headers = read('_headers');
  fail('headers: copied from public', headers === publicHeaders);
  const globalHeaders = headers.match(/^\/\*\r?\n((?:[ \t]+[^\n]*\r?\n?)*)/m)?.[1] ?? '';
  for (const [name, value] of Object.entries({ 'X-Frame-Options': 'DENY', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "frame-ancestors 'none'" })) {
    const values = [...globalHeaders.matchAll(new RegExp(`^[ \\t]+${name}:\\s*([^\\r\\n]+)`, 'gmi'))].map(match => match[1].trim());
    fail(`headers: ${name}`, same(values, [value]));
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = checkOutput(resolve('dist'), process.env.SITE_ENV === 'production');
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Validated ${contract.locales.length * contract.paths.length} ${process.env.SITE_ENV === 'production' ? 'production' : 'preview'} pages and 404.`);
}
