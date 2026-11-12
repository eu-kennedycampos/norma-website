import {
  CONSENT_STORAGE_KEY,
  CONSENT_TTL_DAYS,
  CONSENT_VERSION,
  type ConsentChoices,
  type ConsentMethod,
} from './config';
import { readJson, writeJson } from '~/lib/storage';

/**
 * O registro do consentimento. Além da escolha, guarda o necessário para provar quando e
 * como ela foi feita: um identificador, a versão da política e o método.
 */
export interface ConsentRecord {
  id: string;
  version: number;
  choices: ConsentChoices;
  method: ConsentMethod;
  at: string;
  expires: string;
}

function isValid(record: ConsentRecord | null): record is ConsentRecord {
  return (
    record !== null &&
    record.version === CONSENT_VERSION &&
    typeof record.choices === 'object' &&
    Date.parse(record.expires) > Date.now()
  );
}

/** A escolha atual, ou `null` se a pessoa ainda não escolheu (ou se a escolha venceu ou mudou de versão). */
export function readRecord(): ConsentRecord | null {
  const record = readJson<ConsentRecord>(CONSENT_STORAGE_KEY);
  return isValid(record) ? record : null;
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function writeRecord(choices: ConsentChoices, method: ConsentMethod): ConsentRecord {
  const now = new Date();
  const record: ConsentRecord = {
    // A mesma pessoa mantém o identificador ao mudar de ideia: o histórico fica encadeado.
    id: readJson<ConsentRecord>(CONSENT_STORAGE_KEY)?.id ?? newId(),
    version: CONSENT_VERSION,
    choices: { ...choices },
    method,
    at: now.toISOString(),
    expires: new Date(now.getTime() + CONSENT_TTL_DAYS * 86_400_000).toISOString(),
  };
  writeJson(CONSENT_STORAGE_KEY, record);
  return record;
}
