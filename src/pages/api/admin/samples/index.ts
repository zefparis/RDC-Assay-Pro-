import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyBossToken, readBearer, isBossAuthDisabled } from '@/lib/server/bossAuth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const disabled = isBossAuthDisabled();
  if (!disabled) {
    const bearer = readBearer(req);
    const cookieToken = req.cookies?.bossToken;
    const valid = verifyBossToken(bearer || cookieToken);
    if (!valid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const bossKey = process.env.BOSS_KEY || '';
  if (!bossKey) return res.status(500).json({ error: 'Server not configured: BOSS_KEY missing' });

  const { page = '1', limit = '20', search } = req.query as Record<string, string>;
  const query = new URLSearchParams({ page: String(page), limit: String(limit), ...(search ? { search } : {}) });

  const upstream = await fetch(`${BASE_URL}/samples?${query.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-BOSS-KEY': bossKey,
    },
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json({ error: err.message || `HTTP ${upstream.status}` });
  }

  const data = await upstream.json();
  return res.status(200).json(data);
}
