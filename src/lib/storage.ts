/**
 * localStorage que nunca derruba a página: em aba anônima, com cookies bloqueados
 * ou com a cota cheia, ler devolve `null` e gravar é ignorado.
 */
export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem armazenamento disponível: o site funciona igual, só não lembra.
  }
}
