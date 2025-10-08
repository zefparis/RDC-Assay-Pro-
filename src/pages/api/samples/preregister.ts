import type { NextApiRequest, NextApiResponse } from 'next';
import { createPreRegisteredSample } from '@/lib/server/localStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { site = 'Kolwezi', contact } = (req.body || {}) as { site?: string; contact?: string };
    const s = createPreRegisteredSample({ site, contact });
    return res.status(200).json({ success: true, data: { fullCode: s.fullCode, shortCode: s.shortCode, checkDigit: s.checkDigit } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
