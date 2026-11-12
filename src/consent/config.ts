/**
 * Configuração do consentimento de cookies. É a única fonte das categorias, dos cookies
 * que cada uma grava e de como elas viram os sinais do Consent Mode do Google — o aviso,
 * a tela de preferências, a página /cookies e a limpeza na revogação leem daqui.
 *
 * Ao incluir uma ferramenta nova (Meta Pixel, Clarity, Hotjar…): cadastre os cookies dela
 * em `cookies`, na categoria certa, e suba `CONSENT_VERSION` para todo mundo responder de novo.
 */

export type ConsentCategory = 'analytics' | 'marketing';
export type ConsentChoices = Record<ConsentCategory, boolean>;

/** Como a escolha foi feita: vai no registro, que é a prova do consentimento (LGPD art. 8º, § 2º). */
export type ConsentMethod = 'aceitar-todos' | 'recusar-todos' | 'personalizado';

export const CONSENT_STORAGE_KEY = 'norma:consentimento';

/** Suba quando mudarem as categorias ou as ferramentas: a escolha antiga deixa de valer. */
export const CONSENT_VERSION = 2;

/** A escolha vale por 12 meses; depois o aviso aparece de novo. */
export const CONSENT_TTL_DAYS = 365;

export const NO_CONSENT: ConsentChoices = { analytics: false, marketing: false };
export const ALL_CONSENT: ConsentChoices = { analytics: true, marketing: true };

export interface CategoryInfo {
  id: ConsentCategory | 'necessary';
  title: string;
  description: string;
}

export const categoryInfo: CategoryInfo[] = [
  {
    id: 'necessary',
    title: 'Necessários',
    description:
      'Guardam a sua escolha sobre cookies e a origem da visita que acompanha o formulário. Ficam só no seu navegador e não podem ser desligados.',
  },
  {
    id: 'analytics',
    title: 'Medição de uso',
    description:
      'Contam visitas, páginas e cliques de forma agregada. É assim que descobrimos o que melhorar no site e nos nossos sistemas.',
  },
  {
    id: 'marketing',
    title: 'Anúncios',
    description:
      'Mostram se um anúncio trouxe você até aqui e permitem que nossos anúncios em outros sites sejam mais relevantes.',
  },
];

/** Os sinais do Google Consent Mode v2 que cada categoria libera. */
export const googleConsentTypes: Record<ConsentCategory, string[]> = {
  analytics: ['analytics_storage'],
  marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
};

export interface CookieInfo {
  name: string;
  /** Padrão para apagar o cookie quando a categoria é revogada (ausente: não é cookie, é armazenamento local). */
  pattern?: RegExp;
  provider: string;
  category: CategoryInfo['id'];
  purpose: string;
  duration: string;
}

/**
 * Cookies e armazenamento que o site pode gravar. Os de terceiros só existem se a ferramenta
 * estiver ligada no Google Tag Manager — e só depois da permissão da categoria.
 */
export const cookies: CookieInfo[] = [
  {
    name: 'norma:consentimento',
    provider: 'Norma',
    category: 'necessary',
    purpose: 'Guarda a sua escolha sobre cookies.',
    duration: '12 meses (armazenamento local)',
  },
  {
    name: 'norma:origem',
    provider: 'Norma',
    category: 'necessary',
    purpose: 'Guarda de onde veio a visita, para acompanhar o formulário se você enviar um.',
    duration: '90 dias (armazenamento local)',
  },
  {
    name: '_ga',
    pattern: /^_ga$/,
    provider: 'Google Analytics',
    category: 'analytics',
    purpose: 'Distingue visitantes, sem identificar quem são.',
    duration: '2 anos',
  },
  {
    name: '_ga_*',
    pattern: /^_ga_/,
    provider: 'Google Analytics',
    category: 'analytics',
    purpose: 'Mantém o estado da visita para contar páginas e eventos.',
    duration: '2 anos',
  },
  {
    name: '_gid',
    pattern: /^_gid$/,
    provider: 'Google Analytics',
    category: 'analytics',
    purpose: 'Distingue visitantes ao longo do dia.',
    duration: '24 horas',
  },
  {
    name: '_gcl_au',
    pattern: /^_gcl_au$/,
    provider: 'Google Ads',
    category: 'marketing',
    purpose: 'Mede conversões de anúncios.',
    duration: '90 dias',
  },
  {
    name: '_gcl_aw, _gcl_gb, _gcl_dc',
    pattern: /^_gcl_(aw|gb|dc|gs|ag)/,
    provider: 'Google Ads',
    category: 'marketing',
    purpose: 'Guarda o clique no anúncio para atribuir a conversão.',
    duration: '90 dias',
  },
];
