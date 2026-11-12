import {
  PUBLIC_CONSENT_PREVIEW,
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_GTM_ID,
  PUBLIC_WHATSAPP,
} from 'astro:env/client';

/**
 * Os dados institucionais, num lugar só. O que ainda não foi definido fica `null`
 * e simplesmente não aparece no site — nunca um texto de exemplo publicado.
 */
interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  defaultTitle: string;
  defaultDescription: string;
  lang: string;
  ogLocale: string;
  themeColor: string;
  /** CNPJ formatado (00.000.000/0000-00). */
  cnpj: string | null;
  /** "Cidade — UF". */
  city: string | null;
  /** Só dígitos, com DDI: 5543999999999. */
  whatsapp: string | null;
  email: string | null;
  /** Rótulo dos produtos que ainda não foram lançados. */
  launchLabel: string;
}

export const site: SiteConfig = {
  name: 'Norma',
  legalName: 'Norma Tecnologia',
  tagline: 'Software com o formato da sua empresa.',
  defaultTitle: 'Sistemas sob medida para empresas e indústrias',
  defaultDescription:
    'A Norma conhece a sua operação por dentro e constrói o sistema em volta do jeito que a sua empresa trabalha. Sem planilha paralela, sem adaptar o processo ao software.',
  lang: 'pt-BR',
  ogLocale: 'pt_BR',
  themeColor: '#111110',
  cnpj: null,
  city: null,
  whatsapp: PUBLIC_WHATSAPP?.replace(/\D/g, '') || null,
  email: PUBLIC_CONTACT_EMAIL || null,
  launchLabel: 'Lançamento em 2027',
};

/**
 * O aviso de cookies só existe quando há o que consentir: uma ferramenta de medição ligada (GTM).
 * PUBLIC_CONSENT_PREVIEW=true força o aviso, para ver e testar antes de ligar o GTM.
 */
export const consentEnabled = Boolean(PUBLIC_GTM_ID?.trim()) || PUBLIC_CONSENT_PREVIEW;

export interface NavItem {
  label: string;
  href: string;
}

/** Âncoras com o caminho da home na frente: funcionam igual na home e nas páginas de produto. */
export const mainNav: NavItem[] = [
  { label: 'Por que sob medida', href: '/#problema' },
  { label: 'Diferencial', href: '/#diferencial' },
  { label: 'Implantação', href: '/#implantacao' },
  { label: 'Soluções prontas', href: '/#solucoes' },
];

export const productLinks: NavItem[] = [
  { label: 'Norma Ponto', href: '/ponto-eletronico' },
  { label: 'Norma Assinatura', href: '/assinatura-eletronica' },
];
