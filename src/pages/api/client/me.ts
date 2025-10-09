import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClientToken } from '@/lib/server/clientAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const cookie = req.headers.cookie || '';
    const m = /(?:^|; )clientToken=([^;]+)/.exec(cookie);
    const token = m && m[1];
    const payload = verifyClientToken(token);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });
    return res.status(200).json({ success: true, data: { email: payload.sub } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
