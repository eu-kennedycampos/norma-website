// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * O endereço público vem do ambiente (SITE_URL). Sem ele o build ainda roda — a CI precisa —,
 * mas canonical, sitemap e Open Graph apontariam para um domínio de mentira: por isso o aviso.
 */
const PLACEHOLDER_URL = 'https://www.exemplo.com.br';
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '') || PLACEHOLDER_URL;
if (siteUrl === PLACEHOLDER_URL) {
  console.warn('\n[norma] SITE_URL não definido: usando um domínio de exemplo. Não publique este build.\n');
}

/** Páginas que existem, mas não devem ir para o índice do Google. */
const NOT_INDEXED = ['/obrigado', '/404'];

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  build: {
    // /ponto-eletronico.html em vez de /ponto-eletronico/index.html: URL sem barra no fim, igual ao canonical.
    format: 'file',
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !NOT_INDEXED.some((path) => new URL(page).pathname.startsWith(path)),
    }),
  ],
  env: {
    schema: {
      PUBLIC_GTM_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_LEAD_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_WHATSAPP: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_CONTACT_EMAIL: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
