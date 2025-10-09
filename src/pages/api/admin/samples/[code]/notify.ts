import type { NextApiRequest, NextApiResponse } from 'next';
import { notifyClientLocal } from '@/lib/server/localStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query as { code: string };
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { channel = 'email', contact } = (req.body || {}) as { channel?: 'email' | 'sms'; contact?: string };
    const updated = notifyClientLocal(code, channel, contact);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true, data: { ok: true, at: updated.lastNotificationAt } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
