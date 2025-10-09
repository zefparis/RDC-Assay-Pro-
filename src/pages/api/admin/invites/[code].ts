import type { NextApiRequest, NextApiResponse } from 'next';
import { listInvites, revokeInvite, markInviteSent } from '@/lib/server/localStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query as { code: string };
  try {
    if (req.method === 'GET') {
      const inv = listInvites().find(i => i.code === code);
      if (!inv) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true, data: inv });
    }
    if (req.method === 'PATCH') {
      const { action } = (req.body || {}) as { action?: 'send' };
      if (action === 'send') {
        const it = markInviteSent(code);
        if (!it) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json({ success: true, data: it });
      }
      return res.status(400).json({ error: 'Invalid action' });
    }
    if (req.method === 'DELETE') {
      const ok = revokeInvite(code);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(204).end();
    }
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
