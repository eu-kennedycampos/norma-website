/**
 * Eventos para o Google Tag Manager. Tudo passa pelo dataLayer: com o GTM ausente
 * (sem PUBLIC_GTM_ID), os eventos só se acumulam no array e nada sai do navegador.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export type TrackParams = Record<string, string | number | boolean | undefined>;

function layer(): unknown[] {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

const gtmActive = () => document.documentElement.dataset.gtm === 'on';

export function track(event: string, params: TrackParams = {}): void {
  layer().push({ event, ...params });
}

/**
 * Registra o evento e só então navega. Sem isso, a conversão do anúncio se perde
 * quando a página troca antes de a tag disparar. O GTM chama `eventCallback`;
 * o temporizador garante a navegação mesmo se ele falhar ou estiver bloqueado.
 */
export function trackThenNavigate(event: string, params: TrackParams, url: string): void {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    window.location.assign(url);
  };
  if (!gtmActive()) {
    track(event, params);
    go();
    return;
  }
  layer().push({ event, ...params, eventCallback: go, eventTimeout: 1200 });
  window.setTimeout(go, 1500);
}
