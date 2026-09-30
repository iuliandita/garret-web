import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://usegarret.com',
  output: 'static',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
});
