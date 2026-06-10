import { randomBytes } from "node:crypto";

/**
 * Genera un public token URL-safe per le SP survey.
 * Formato: 3 gruppi di 4 caratteri separati da trattino, es. "k8h2-9f4p-aa12".
 * Usa caratteri lowercase a-z + 0-9 (alfabeto base32 ridotto, no caratteri ambigui come l/1/o/0).
 * Lunghezza totale 14 caratteri (12 alfanumerici + 2 trattini). Spazio combinatorio ~ 32^12 ≈ 10^18.
 */
const SP_TOKEN_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function getSecureRandomBytes(length: number): Uint8Array {
  try {
    return randomBytes(length);
  } catch {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }
}

function charFromByte(byte: number): string {
  return SP_TOKEN_ALPHABET[byte % SP_TOKEN_ALPHABET.length];
}

export function generateSPToken(): string {
  const bytes = getSecureRandomBytes(12);
  const chars = Array.from(bytes, charFromByte);

  return [
    chars.slice(0, 4).join(""),
    chars.slice(4, 8).join(""),
    chars.slice(8, 12).join(""),
  ].join("-");
}
