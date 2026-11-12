/**
 * Envio dos formulários de lead. Caminhos, na ordem:
 *  1. PUBLIC_LEAD_ENDPOINT definido → POST em JSON e página de obrigado;
 *  2. senão, PUBLIC_WHATSAPP definido → a mensagem pronta abre no WhatsApp;
 *  3. senão → aviso com o e-mail de contato.
 * Em todos os casos de sucesso o evento `generate_lead` vai para o dataLayer antes da navegação,
 * e a página /obrigado serve de conversão alternativa no Google Ads.
 */
import { PUBLIC_LEAD_ENDPOINT } from 'astro:env/client';
import { track, trackThenNavigate } from '~/lib/analytics';
import { readAttribution } from '~/lib/attribution';
import { isValidContact, whatsappUrl } from '~/lib/contact';

const SEND_TIMEOUT_MS = 12_000;

const INTEREST_LABEL: Record<string, string> = {
  'sob-medida': 'sistema sob medida',
  ponto: 'Norma Ponto',
  assinatura: 'Norma Assinatura',
};

interface LeadPayload {
  interest: string;
  name: string;
  company: string;
  contact: string;
  message: string;
  team_size: string;
  page: string;
  attribution: ReturnType<typeof readAttribution>;
  submitted_at: string;
}

function field(form: HTMLFormElement, name: string): string {
  const element = form.elements.namedItem(name);
  return element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
    ? element.value.trim()
    : '';
}

function setStatus(form: HTMLFormElement, message: string, tone: 'error' | 'info' = 'error'): void {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
}

function setBusy(form: HTMLFormElement, busy: boolean): void {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  form.setAttribute('aria-busy', String(busy));
  if (button) button.disabled = busy;
}

/** Mensagens em português no lugar das do navegador, e a regra "e-mail ou telefone". */
function validate(form: HTMLFormElement): boolean {
  const contact = form.elements.namedItem('contact');
  if (contact instanceof HTMLInputElement) {
    contact.setCustomValidity(
      contact.value.trim() && !isValidContact(contact.value)
        ? 'Informe um e-mail ou um telefone com DDD.'
        : '',
    );
  }
  for (const element of Array.from(form.elements)) {
    if (
      (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) &&
      element.validity.valueMissing
    ) {
      element.setCustomValidity('Preencha este campo.');
    }
  }
  const ok = form.reportValidity();
  if (!ok) track('form_error', { form_id: form.id });
  return ok;
}

function buildPayload(form: HTMLFormElement): LeadPayload {
  return {
    interest: form.dataset.interest ?? 'sob-medida',
    name: field(form, 'name'),
    company: field(form, 'company'),
    contact: field(form, 'contact'),
    message: field(form, 'message'),
    team_size: field(form, 'team_size'),
    page: window.location.pathname,
    attribution: readAttribution(),
    submitted_at: new Date().toISOString(),
  };
}

function whatsappMessage(lead: LeadPayload): string {
  const lines = [
    `Olá! Tenho interesse em ${INTEREST_LABEL[lead.interest] ?? 'um sistema'}.`,
    `Nome: ${lead.name}`,
    `Empresa: ${lead.company}`,
    lead.team_size && `Pessoas na equipe: ${lead.team_size}`,
    lead.message && `\n${lead.message}`,
  ];
  return lines.filter(Boolean).join('\n');
}

async function sendToEndpoint(endpoint: string, lead: LeadPayload): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

function thankYouUrl(interest: string, via: string): string {
  return `/obrigado?i=${encodeURIComponent(interest)}&via=${via}`;
}

async function handleSubmit(form: HTMLFormElement, event: SubmitEvent): Promise<void> {
  event.preventDefault();
  setStatus(form, '');
  if (!validate(form)) return;

  const lead = buildPayload(form);
  const eventParams = { form_id: form.id, lead_interest: lead.interest };

  // Robôs preenchem o campo escondido: fingimos sucesso e não enviamos nada.
  if (field(form, 'website')) {
    window.location.assign(thankYouUrl(lead.interest, 'form'));
    return;
  }

  const endpoint = PUBLIC_LEAD_ENDPOINT?.trim();
  const whatsapp = form.dataset.whatsapp;

  if (endpoint) {
    setBusy(form, true);
    const ok = await sendToEndpoint(endpoint, lead);
    if (ok) {
      trackThenNavigate(
        'generate_lead',
        { ...eventParams, method: 'form' },
        thankYouUrl(lead.interest, 'form'),
      );
      return;
    }
    setBusy(form, false);
    track('form_error', { ...eventParams, reason: 'envio' });
    setStatus(
      form,
      whatsapp
        ? 'Não conseguimos enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.'
        : 'Não conseguimos enviar agora. Tente de novo em alguns instantes.',
    );
    return;
  }

  if (whatsapp) {
    // Abre na mesma interação do clique: depois de um `await`, o navegador bloquearia a janela.
    window.open(whatsappUrl(whatsapp, whatsappMessage(lead)), '_blank', 'noopener');
    trackThenNavigate(
      'generate_lead',
      { ...eventParams, method: 'whatsapp' },
      thankYouUrl(lead.interest, 'whatsapp'),
    );
    return;
  }

  const email = form.dataset.email;
  setStatus(
    form,
    email
      ? `O envio pelo site ainda não está ativo. Escreva para ${email}.`
      : 'O envio pelo site ainda não está ativo.',
    'info',
  );
}

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-lead-form]')) {
  form.noValidate = true;
  form.addEventListener('submit', (event) => void handleSubmit(form, event as SubmitEvent));
  // A mensagem personalizada precisa ser limpa assim que a pessoa corrige o campo.
  form.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      target.setCustomValidity('');
  });
  form.addEventListener(
    'focusin',
    () => track('form_start', { form_id: form.id, lead_interest: form.dataset.interest ?? '' }),
    { once: true },
  );
}
