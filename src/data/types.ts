/** Tipos do conteúdo. O texto do site mora em `src/data`, separado da marcação. */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ComparisonRow {
  criterion: string;
  shelf: string;
  norma: string;
}

export interface ProcessStep {
  verb: string;
  text: string;
  deliverable: string;
}

export interface Feature {
  title: string;
  text: string;
}

export interface ProductSummary {
  /** Nome depois de "norma" no logo. */
  product: string;
  name: string;
  href: string;
  /** Cor do ponto do esquadro. */
  dot: string;
  pitch: string;
  highlights: string[];
  trial: string;
}

/** Interesse declarado no formulário; vira o rótulo do lead e o parâmetro da página de obrigado. */
export type LeadInterest = 'sob-medida' | 'ponto' | 'assinatura';

export interface ProductPage {
  path: string;
  product: string;
  name: string;
  dot: string;
  interest: LeadInterest;
  seo: { title: string; description: string; image: string };
  schema: { category: string; os: string };
  hero: { title: string; lead: string };
  features: { title: string; lead: string; items: Feature[] };
  included: { title: string; text: string; points: string[] };
  faq: FaqItem[];
  waitlist: { title: string; text: string };
}
