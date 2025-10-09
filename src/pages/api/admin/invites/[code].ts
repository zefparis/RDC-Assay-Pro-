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
      const { action, email, expiresAt, ttlMinutes } = (req.body || {}) as { action?: 'send'; email?: string; expiresAt?: string; ttlMinutes?: number };
      if (action === 'send') {
        let inv = listInvites().find(i => i.code === code);
        const base = computeBaseUrlFromHeaders(req.headers as any);
        try {
          if (!inv) {
            // Fallback: accept email/expiresAt from request to send even if in-memory invite is gone (serverless cold start)
            if (!email) return res.status(404).json({ error: 'Not found' });
            const createdAt = new Date().toISOString();
            const exp = expiresAt || new Date(Date.now() + (Number(ttlMinutes) || 60) * 60 * 1000).toISOString();
            const temp = { email: String(email).toLowerCase(), code, createdAt, expiresAt: exp, status: 'Pending' as const };
            await sendInviteEmail(temp as any, base);
            return res.status(200).json({ success: true, data: { ...temp, status: 'Sent' } });
          }
          await sendInviteEmail(inv, base);
          const it = markInviteSent(code);
          return res.status(200).json({ success: true, data: it || inv });
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
