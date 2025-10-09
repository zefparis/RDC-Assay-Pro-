import type { NextApiRequest, NextApiResponse } from 'next';
import { createInvite, listInvites, markInviteSent } from '@/lib/server/localStore';
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
  try {
    if (!requireBoss(req, res)) return;
    if (req.method === 'GET') {
      const items = listInvites();
      return res.status(200).json({ success: true, data: items });
    }
    if (req.method === 'POST') {
      const { email, ttlMinutes = 60, send } = (req.body || {}) as { email?: string; ttlMinutes?: number; send?: boolean };
      if (!email) return res.status(400).json({ error: 'Email required' });
      const inv = createInvite(email, Number(ttlMinutes) || 60);
      const base = computeBaseUrlFromHeaders(req.headers as any);
      if (send) {
        try {
          await sendInviteEmail(inv, base);
          markInviteSent(inv.code);
        } catch (e: any) {
          return res.status(502).json({ error: `Mail send failed: ${e?.message || 'unknown'}` });
        }
      }
      return res.status(200).json({ success: true, data: inv, link: `${base}/api/auth/client-redeem?code=${inv.code}` });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
