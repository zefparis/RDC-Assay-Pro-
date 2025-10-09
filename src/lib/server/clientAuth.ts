import type { NextApiRequest } from 'next';
import crypto from 'crypto';

const ALG = 'sha256';
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getSecret() {
  const secret = process.env.CLIENT_JWT_SECRET || process.env.BOSS_JWT_SECRET || process.env.BOSS_KEY || '';
  if (!secret) throw new Error('CLIENT_JWT_SECRET/BOSS_JWT_SECRET not set');
  return secret;
}

export function signClientToken(payload: Partial<{ sub: string; iat: number; exp: number }> & { sub: string }) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_TTL_SECONDS;
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = { iat, exp, ...payload };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(body));
  const toSign = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac(ALG, getSecret()).update(toSign).digest();
  const sigB64 = base64url(sig);
  return `${toSign}.${sigB64}`;
}

export function verifyClientToken(token: string | undefined | null): { sub: string; iat: number; exp: number } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expected = base64url(crypto.createHmac(ALG, getSecret()).update(`${h}.${p}`).digest());
  if (s !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(p, 'base64').toString());
    if (!payload.exp || Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function readClientBearer(req: NextApiRequest): string | null {
  const h = (req.headers.authorization || (req.headers as any).Authorization) as string | undefined;
  if (!h) return null;
  const m = /^Bearer\s+(.+)/i.exec(h as string);
  return m ? m[1] : null;
}
