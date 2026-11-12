/**
 * O gerenciador de consentimento no navegador. API pequena e sem dependência do site,
 * para poder ser levada aos produtos da Norma:
 *
 *   consent.get()            a escolha atual (tudo `false` enquanto ninguém escolheu)
 *   consent.decided()        se já existe uma escolha válida
 *   consent.set(c, método)   grava, avisa o Google, limpa cookies revogados, registra e libera scripts
 *   consent.onChange(fn)     reage a mudanças (devolve a função para cancelar)
 *   consent.open()           abre a tela de preferências
 *
 * O estado inicial (tudo negado, ou a escolha guardada) é aplicado antes, por um script em
 * linha no <head> — ver ConsentHead.astro. Aqui só entram as mudanças.
 */
import { PUBLIC_CONSENT_ENDPOINT, PUBLIC_CONSENT_MODE, PUBLIC_GTM_ID } from 'astro:env/client';
import {
  NO_CONSENT,
  cookies,
  googleConsentTypes,
  type ConsentCategory,
  type ConsentChoices,
  type ConsentMethod,
} from './config';
import { readRecord, writeRecord, type ConsentRecord } from './store';

declare global {
  interface Window {
    dataLayer: unknown[];
    __normaGtmLoaded?: boolean;
  }
}

type Listener = (choices: ConsentChoices, record: ConsentRecord) => void;

const listeners = new Set<Listener>();
const OPEN_EVENT = 'norma:consentimento-abrir';

// O gtag precisa receber o objeto `arguments`, não um array: é assim que o GTM o reconhece.
function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

function googleState(choices: ConsentChoices): Record<string, 'granted' | 'denied'> {
  const state: Record<string, 'granted' | 'denied'> = {};
  for (const category of Object.keys(googleConsentTypes) as ConsentCategory[]) {
    for (const type of googleConsentTypes[category]) state[type] = choices[category] ? 'granted' : 'denied';
  }
  return state;
}

/** Modo básico (padrão): o GTM só carrega depois de alguma permissão. Avançado: carrega sempre, sem cookies. */
export function loadGtm(): void {
  const id = PUBLIC_GTM_ID?.trim();
  if (!id || window.__normaGtmLoaded) return;
  window.__normaGtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/** Apaga os cookies das categorias revogadas, no domínio atual e nos domínios-pai. */
function deleteCookies(revoked: ConsentCategory[]): void {
  if (revoked.length === 0) return;
  const patterns = cookies.filter((c) => c.pattern && revoked.includes(c.category as ConsentCategory));
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim() ?? '')
    .filter((name) => name && patterns.some((c) => c.pattern?.test(name)));
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const name of names) {
    for (const domain of domains)
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
  }
}

/**
 * Scripts de terceiros marcados como `<script type="text/plain" data-consent="analytics">`
 * (ver ConsentScript.astro) só viram scripts de verdade quando a categoria é permitida.
 */
function activateScripts(choices: ConsentChoices): void {
  document
    .querySelectorAll<HTMLScriptElement>('script[type="text/plain"][data-consent]')
    .forEach((holder) => {
      const needed = (holder.dataset.consent ?? '').split(/\s+/).filter(Boolean) as ConsentCategory[];
      if (holder.dataset.activated || !needed.every((category) => choices[category])) return;
      const script = document.createElement('script');
      for (const attr of Array.from(holder.attributes)) {
        if (!['type', 'data-consent', 'data-src'].includes(attr.name))
          script.setAttribute(attr.name, attr.value);
      }
      if (holder.dataset.src) script.src = holder.dataset.src;
      else script.text = holder.text;
      holder.dataset.activated = 'true';
      holder.after(script);
    });
}

/** Envia o registro ao servidor, se houver um: é o histórico que prova o consentimento. */
function sendReceipt(record: ConsentRecord): void {
  const endpoint = PUBLIC_CONSENT_ENDPOINT?.trim();
  if (!endpoint) return;
  const body = JSON.stringify({ ...record, page: window.location.pathname });
  const sent = navigator.sendBeacon?.(endpoint, new Blob([body], { type: 'application/json' }));
  if (!sent) {
    void fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }
}

function anyGranted(choices: ConsentChoices): boolean {
  return Object.values(choices).some(Boolean);
}

export const consent = {
  get(): ConsentChoices {
    return { ...(readRecord()?.choices ?? NO_CONSENT) };
  },

  decided(): boolean {
    return readRecord() !== null;
  },

  /** O navegador pede para não rastrear (Global Privacy Control): a tela de preferências avisa. */
  prefersPrivacy(): boolean {
    return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  },

  set(choices: ConsentChoices, method: ConsentMethod): ConsentRecord {
    const previous = this.get();
    const record = writeRecord(choices, method);
    const revoked = (Object.keys(choices) as ConsentCategory[]).filter((c) => previous[c] && !choices[c]);

    gtag('consent', 'update', googleState(choices));
    gtag('set', 'ads_data_redaction', !choices.marketing);
    window.dataLayer.push({
      event: 'consent_update',
      consent_analytics: choices.analytics ? 'granted' : 'denied',
      consent_marketing: choices.marketing ? 'granted' : 'denied',
      consent_method: method,
    });

    deleteCookies(revoked);
    sendReceipt(record);
    if (PUBLIC_CONSENT_MODE === 'advanced' || anyGranted(choices)) loadGtm();
    activateScripts(choices);
    listeners.forEach((listener) => listener(choices, record));

    // Um script de terceiro já carregado não tem como ser descarregado: recarregar é o único jeito
    // de a revogação valer na hora.
    const loadedRevoked = revoked.some((category) =>
      document.querySelector(`script[data-activated][data-consent~="${category}"]`),
    );
    if (loadedRevoked) window.location.reload();

    return record;
  },

  onChange(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  open(): void {
    document.dispatchEvent(new CustomEvent(OPEN_EVENT));
  },

  onOpen(handler: () => void): void {
    document.addEventListener(OPEN_EVENT, handler);
  },

  /** Na carga da página: libera os scripts que a escolha guardada já permite. */
  init(): void {
    activateScripts(this.get());
  },
};
