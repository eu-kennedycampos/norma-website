/** Validação e montagem de links de contato, usadas no formulário e nos botões. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Aceita e-mail ou telefone brasileiro (10 ou 11 dígitos, com ou sem DDI 55). */
export function isValidContact(value: string): boolean {
  const text = value.trim();
  if (EMAIL.test(text)) return true;
  const digits = text.replace(/\D/g, '');
  const national = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  return national.length === 10 || national.length === 11;
}

export function whatsappUrl(number: string, text?: string): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${number}${query}`;
}
