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
  // Accept site names or full codes without touching them
  // Only special-handle patterns that look like numeric codes
  const m = /^(\d+)(?:-(\d))?$/.exec(input);
  if (!m) {
    // Not a pure numeric code → return as-is for generic search
    return { search: input };
  }
  const digits = m[1];
  const providedCheck = m[2];
  // Strict validation only when it's a 7-digit short code and a check digit is provided
  if (providedCheck != null && digits.length === 7) {
    const expected = computeLuhnDigit(digits);
    if (Number(providedCheck) !== expected) {
      return { search: digits, error: 'Code invalide (contrôle). Vérifiez le chiffre de contrôle.' };
    }
  }
  return { search: digits };
}

export function looksLikeNumericCode(raw: string): boolean {
  return /^(\d{7})(?:-\d)?$/.test(String(raw || '').trim());
}
