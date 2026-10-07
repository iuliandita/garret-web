import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://usegarret.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"],
      scriptDirective: { resources: ["'self'", ...(process.env.SITE_ENV === 'production' ? ['https://static.cloudflareinsights.com/beacon.min.js'] : [])] },
      styleDirective: { resources: ["'self'"] },
    },
  },
});
