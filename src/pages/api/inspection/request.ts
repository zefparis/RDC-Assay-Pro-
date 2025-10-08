import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const { companyContact, location, mineralType, estimatedVolume, serviceType, datePeriod, notes } = req.body || {};

    if (!companyContact || !location || !mineralType || !estimatedVolume || !serviceType || !datePeriod) {
      return res.status(400).json({ ok: false, message: 'Missing fields' });
    }

    // Mock persistence: generate a pseudo ID
    const id = `INSP-${Date.now().toString(36).toUpperCase()}`;

    // In a real implementation, insert into DB and trigger notification workflows here.

    return res.status(200).json({ ok: true, id });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || 'Server error' });
  }
}
