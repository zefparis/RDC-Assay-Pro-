import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `clientToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${isProd ? 'Secure; ' : ''}`);
  return res.status(200).json({ ok: true });
}
