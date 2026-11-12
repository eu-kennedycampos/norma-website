/**
 * Comportamento comum a todas as páginas. Carregado uma vez pelo BaseLayout;
 * nada aqui é necessário para ler o conteúdo — sem JavaScript, o site continua inteiro.
 */
import { track } from '~/lib/analytics';
import { captureAttribution } from '~/lib/attribution';

captureAttribution();

/* ---------- Revelação ao rolar ---------- */
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealables.forEach((element) => observer.observe(element));
} else {
  revealables.forEach((element) => element.classList.add('is-visible'));
}

/* ---------- Menu no celular ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');

function setMenu(open: boolean): void {
  if (!header || !toggle) return;
  header.dataset.menu = open ? 'open' : 'closed';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.documentElement.classList.toggle('menu-open', open);
}

toggle?.addEventListener('click', () => setMenu(header?.dataset.menu !== 'open'));
header
  ?.querySelectorAll('[data-nav-panel] a')
  .forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header?.dataset.menu === 'open') {
    setMenu(false);
    toggle?.focus();
  }
});
window
  .matchMedia('(min-width: 60rem)')
  .addEventListener('change', (query) => query.matches && setMenu(false));

/* ---------- Barra de ação no celular ----------
 * Aparece só quando nenhuma outra ação está na tela: some sobre os botões do topo e sobre
 * o formulário, porque dois "Pedir medição" juntos só atrapalham. */
const mobileCta = document.querySelector<HTMLElement>('[data-mobile-cta]');
const ctaZones = document.querySelectorAll<HTMLElement>('[data-lead-section], [data-cta-zone]');
if (mobileCta && !('IntersectionObserver' in window)) mobileCta.dataset.hidden = 'false';
if (mobileCta && ctaZones.length > 0 && 'IntersectionObserver' in window) {
  const visible = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    mobileCta.dataset.hidden = String(visible.size > 0);
  });
  ctaZones.forEach((zone) => observer.observe(zone));
}

/* ---------- Cliques que interessam ao anúncio ---------- */
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('a, button') : null;
  if (!target) return;

  const href = target instanceof HTMLAnchorElement ? target.href : '';
  if (href.startsWith('https://wa.me/')) {
    track('click_whatsapp', { cta_location: target.dataset.trackLocation ?? 'pagina' });
    return;
  }
  if (href.startsWith('mailto:')) {
    track('click_email', { cta_location: target.dataset.trackLocation ?? 'pagina' });
    return;
  }
  if (target.dataset.track) {
    track('cta_click', { cta: target.dataset.track, cta_location: target.dataset.trackLocation ?? 'pagina' });
  }
});
