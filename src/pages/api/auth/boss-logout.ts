import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const isProd = process.env.NODE_ENV === 'production';
  // Clear cookie by setting Max-Age=0
  res.setHeader('Set-Cookie', `bossToken=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0; ${isProd ? 'Secure; ' : ''}`);
  return res.status(200).json({ ok: true });
}
