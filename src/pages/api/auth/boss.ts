import type { NextApiRequest, NextApiResponse } from 'next';
import { signBossToken } from '@/lib/server/bossAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const bossKey = process.env.BOSS_KEY || '';
  if (!bossKey) {
    return res.status(500).json({ error: 'Server not configured: BOSS_KEY missing' });
  }

  const { password } = req.body || {};
  if (!password || password !== bossKey) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signBossToken();

  // Set httpOnly cookie
  const isProd = process.env.NODE_ENV === 'production';
  const ttl = 30 * 60; // 30 minutes
  res.setHeader('Set-Cookie', `bossToken=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${ttl}; ${isProd ? 'Secure; ' : ''}`);

  return res.status(200).json({ token, expiresIn: ttl });
}
