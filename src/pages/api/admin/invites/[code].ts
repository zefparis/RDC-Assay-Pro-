import type { NextApiRequest, NextApiResponse } from 'next';
import { listInvites, revokeInvite, markInviteSent } from '@/lib/server/localStore';
import { computeBaseUrlFromHeaders, sendInviteEmail } from '@/lib/server/mail';
import { verifyBossToken, readBearer, isBossAuthDisabled } from '@/lib/server/bossAuth';

function requireBoss(req: NextApiRequest, res: NextApiResponse): boolean {
  if (isBossAuthDisabled()) return true;
  const cookie = req.headers.cookie || '';
  const m = /(?:^|; )bossToken=([^;]+)/.exec(cookie);
  const token = (m && m[1]) || readBearer(req);
  if (!verifyBossToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireBoss(req, res)) return;
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
        const inv = listInvites().find(i => i.code === code);
        if (!inv) return res.status(404).json({ error: 'Not found' });
        const base = computeBaseUrlFromHeaders(req.headers as any);
        try {
          await sendInviteEmail(inv, base);
          const it = markInviteSent(code);
          return res.status(200).json({ success: true, data: it });
        } catch (e: any) {
          return res.status(502).json({ error: `Mail send failed: ${e?.message || 'unknown'}` });
        }
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
