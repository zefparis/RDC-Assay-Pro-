import type { NextApiRequest, NextApiResponse } from 'next';
import { createInvite, listInvites, markInviteSent } from '@/lib/server/localStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const items = listInvites();
      return res.status(200).json({ success: true, data: items });
    }
    if (req.method === 'POST') {
      const { email, ttlMinutes = 60, send } = (req.body || {}) as { email?: string; ttlMinutes?: number; send?: boolean };
      if (!email) return res.status(400).json({ error: 'Email required' });
      const inv = createInvite(email, Number(ttlMinutes) || 60);
      if (send) markInviteSent(inv.code);
      return res.status(200).json({ success: true, data: inv, link: `/api/auth/client-redeem?code=${inv.code}` });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
