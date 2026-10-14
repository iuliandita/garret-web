import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(
  import.meta.env.SITE_ENV === 'production'
    ? 'User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: /\n\nUser-agent: GPTBot\nUser-agent: CCBot\nUser-agent: ClaudeBot\nUser-agent: Applebot-Extended\nUser-agent: Bytespider\nUser-agent: meta-externalagent\nDisallow: /\n\nSitemap: https://usegarret.com/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
