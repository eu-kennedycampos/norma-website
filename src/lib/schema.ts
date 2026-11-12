import { site } from '~/config/site';
import type { FaqItem } from '~/data/types';

/**
 * Construtores de schema.org. Cada nó tem um @id estável, para que as páginas
 * se refiram à mesma organização em vez de repeti-la.
 */
type Node = Record<string, unknown>;

const abs = (path: string, base: URL) => new URL(path, base).toString();

export const orgId = (base: URL) => abs('/#organizacao', base);

export function organization(base: URL): Node {
  const contactPoint: Node[] = [];
  if (site.email || site.whatsapp) {
    contactPoint.push({
      '@type': 'ContactPoint',
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
      ...(site.email && { email: site.email }),
      ...(site.whatsapp && { telephone: `+${site.whatsapp}` }),
    });
  }
  return {
    '@type': 'Organization',
    '@id': orgId(base),
    name: site.legalName,
    alternateName: site.name,
    url: abs('/', base),
    logo: abs('/icon-512.png', base),
    slogan: site.tagline,
    ...(site.cnpj && { taxID: site.cnpj }),
    ...(contactPoint.length > 0 && { contactPoint }),
  };
}

export function website(base: URL): Node {
  return {
    '@type': 'WebSite',
    '@id': abs('/#site', base),
    url: abs('/', base),
    name: site.legalName,
    inLanguage: site.lang,
    publisher: { '@id': orgId(base) },
  };
}

export function customSoftwareService(base: URL): Node {
  return {
    '@type': 'Service',
    '@id': abs('/#sob-medida', base),
    name: 'Desenvolvimento de sistemas sob medida',
    serviceType: 'Desenvolvimento de software sob medida',
    description: site.defaultDescription,
    provider: { '@id': orgId(base) },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: { '@type': 'BusinessAudience', name: 'Empresas e indústrias' },
  };
}

export function softwareApplication(
  base: URL,
  app: { name: string; path: string; description: string; category: string; os: string },
): Node {
  return {
    '@type': 'SoftwareApplication',
    '@id': abs(`${app.path}#produto`, base),
    name: app.name,
    url: abs(app.path, base),
    description: app.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: app.category,
    operatingSystem: app.os,
    inLanguage: site.lang,
    publisher: { '@id': orgId(base) },
  };
}

export function faqPage(base: URL, path: string, items: FaqItem[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': abs(`${path}#perguntas`, base),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbs(base: URL, trail: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path, base),
    })),
  };
}
