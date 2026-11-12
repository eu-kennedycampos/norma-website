import { readJson, writeJson } from './storage';

/**
 * Consentimento de cookies no padrão Consent Mode v2 do Google. O estado inicial (tudo negado)
 * é gravado por um script em linha no <head>, antes de o GTM carregar — ver ConsentDefaults.astro.
 * Aqui só se lê a escolha guardada e se avisa o Google quando ela muda.
 */
export const CONSENT_KEY = 'norma:consentimento';
const VERSION = 1;

export type ConsentChoice = 'granted' | 'denied';

interface StoredConsent {
  choice: ConsentChoice;
  version: number;
  at: string;
}

export function readConsent(): ConsentChoice | null {
  const stored = readJson<StoredConsent>(CONSENT_KEY);
  return stored && stored.version === VERSION ? stored.choice : null;
}

// O gtag precisa receber o objeto `arguments`, não um array: é assim que o GTM o reconhece.
function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

export function saveConsent(choice: ConsentChoice): void {
  writeJson(CONSENT_KEY, { choice, version: VERSION, at: new Date().toISOString() } satisfies StoredConsent);
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  window.dataLayer.push({ event: 'consent_update', consent_choice: choice });
}
