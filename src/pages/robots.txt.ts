import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(
  import.meta.env.SITE_ENV === 'production'
    ? 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: https://usegarret.com/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
