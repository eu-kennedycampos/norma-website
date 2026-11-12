import { readJson, writeJson } from './storage';

/**
 * Origem do visitante para o lead: parâmetros de campanha (UTM) e identificadores de clique
 * do Google e da Meta. Fica guardada 90 dias — a janela de conversão do Google Ads —, para que
 * quem clica num anúncio hoje e preenche o formulário semana que vem ainda conte para a campanha.
 */
const KEY = 'norma:origem';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
};

interface Stored {
  data: Attribution;
  expires: number;
}

/** Chamado em toda página. Um novo clique de campanha substitui o anterior (último clique). */
export function captureAttribution(): void {
  const url = new URL(window.location.href);
  const fromUrl: Attribution = {};
  for (const name of PARAMS) {
    const value = url.searchParams.get(name);
    if (value) fromUrl[name] = value.slice(0, 200);
  }

  const hasCampaign = Object.keys(fromUrl).length > 0;
  const current = readJson<Stored>(KEY);
  const isValid = current !== null && current.expires > Date.now();
  if (!hasCampaign && isValid) return;

  const externalReferrer =
    document.referrer && new URL(document.referrer).host !== window.location.host
      ? document.referrer
      : undefined;

  writeJson(KEY, {
    data: {
      ...fromUrl,
      landing_page: url.pathname,
      referrer: externalReferrer,
      captured_at: new Date().toISOString(),
    },
    expires: Date.now() + TTL_MS,
  } satisfies Stored);
}

export function readAttribution(): Attribution {
  const stored = readJson<Stored>(KEY);
  return stored && stored.expires > Date.now() ? stored.data : {};
}
