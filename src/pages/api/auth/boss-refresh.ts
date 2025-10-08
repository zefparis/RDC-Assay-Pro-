import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyBossToken, signBossToken, readBearer } from '@/lib/server/bossAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const bearer = readBearer(req);
  const current = bearer || req.cookies?.bossToken;
  const payload = verifyBossToken(current);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = signBossToken();
  const isProd = process.env.NODE_ENV === 'production';
  const ttl = 30 * 60; // 30 minutes
  res.setHeader('Set-Cookie', `bossToken=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${ttl}; ${isProd ? 'Secure; ' : ''}`);
  return res.status(200).json({ token, expiresIn: ttl });
}
