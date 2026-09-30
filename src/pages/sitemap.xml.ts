import type { APIRoute } from 'astro';
import { pageUrl, type Locale } from '../content';

export const GET: APIRoute = () => {
  const urls = import.meta.env.SITE_ENV === 'production'
    ? (['en', 'de'] as Locale[]).flatMap(locale =>
        ['', 'downloads', 'guide', 'about'].map(path => `<url><loc>https://usegarret.com${pageUrl(locale, path)}</loc></url>`),
      ).join('')
    : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
