import type { NextApiRequest, NextApiResponse } from 'next';
import { createInvite } from '@/lib/server/localStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { email } = (req.body || {}) as { email?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    // Create a pending invite (admin will review and send)
    const inv = createInvite(String(email).trim().toLowerCase());
    return res.status(200).json({ success: true, message: 'Request received. Admin will contact you shortly.' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
