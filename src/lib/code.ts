// Utilities for sample code handling: 7-digit short code with optional Luhn check digit
// - Formatting for display: "NNNNNNN-D"
// - Normalizing input: accept digits or digits-CheckDigit; validate if check digit is present

export function onlyDigits(input: string): string {
  return (input || '').replace(/\D+/g, '');
}

// Compute Luhn check digit for a numeric string
export function computeLuhnDigit(num: string): number {
  const digits = onlyDigits(num);
  let sum = 0;
  // For computing the check digit, start from rightmost and do NOT double the rightmost; double every second digit moving left
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d = d * 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

export function formatShortCodeDisplay(num: string): string {
  const digits = onlyDigits(num);
  if (!digits) return num || '';
  // Only enforce check digit display for 7-digit short codes
  if (digits.length !== 7) return num || digits;
  const check = computeLuhnDigit(digits);
  return `${digits}-${check}`;
}

export function normalizeTrackingInput(raw: string): { search: string; error?: string } {
  const input = String(raw || '').trim();
  // If the input contains meaningful digits, search by digits; else use raw (site)
  const digitsOnly = onlyDigits(input);
  // Check for explicit check digit pattern anywhere like NNNNNNN-D
  const m = /(\d{7})(?:-(\d))?/.exec(input);
  if (m) {
    const core = m[1];
    const provided = m[2];
    if (provided != null) {
      const expected = computeLuhnDigit(core);
      if (Number(provided) !== expected) {
        return { search: core, error: 'Code invalide (contrôle). Vérifiez le chiffre de contrôle.' };
      }
    }
    return { search: core };
  }
  // Fallback: if we have at least 5 digits, treat as a code fragment search; otherwise treat as site
  if (digitsOnly.length >= 5) {
    return { search: digitsOnly };
  }
  return { search: input };
}

export function looksLikeNumericCode(raw: string): boolean {
  return /^(\d{7})(?:-\d)?$/.test(String(raw || '').trim());
}
