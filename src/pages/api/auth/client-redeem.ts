import type { NextApiRequest, NextApiResponse } from 'next';
import { redeemInvite } from '@/lib/server/localStore';
import { signClientToken } from '@/lib/server/clientAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const code = (req.method === 'GET' ? (req.query.code as string) : (req.body as any)?.code) as string;
    if (!code) return res.status(400).json({ error: 'Code required' });
    const inv = redeemInvite(code);
    if (!inv) return res.status(400).json({ error: 'Invalid or expired code' });
    const token = signClientToken({ sub: inv.email });
    const isProd = process.env.NODE_ENV === 'production';
    const ttl = 7 * 24 * 60 * 60; // 7 days
    res.setHeader('Set-Cookie', `clientToken=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${ttl}; ${isProd ? 'Secure; ' : ''}`);
    if (req.method === 'GET') {
      // Redirect browser to home after redeem
      res.redirect(302, '/');
      return;
    }
    return res.status(200).json({ success: true, data: { email: inv.email } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
