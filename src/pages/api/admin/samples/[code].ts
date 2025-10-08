import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getSampleIdByCode(code: string, bossKey: string): Promise<string> {
  const resp = await fetch(`${BASE_URL}/samples/code/${encodeURIComponent(code)}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-BOSS-KEY': bossKey,
      'Authorization': `Bearer ${bossKey}`,
    },
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data.data.sample?.id || data.data.sample?.id || data.data?.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const bossKey = process.env.BOSS_KEY || '';
  if (!bossKey) return res.status(500).json({ error: 'Server not configured: BOSS_KEY missing' });

  const { code } = req.query as { code: string };

  try {
    const sampleId = await getSampleIdByCode(code, bossKey);

    if (req.method === 'PATCH') {
      const upstream = await fetch(`${BASE_URL}/samples/${sampleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-BOSS-KEY': bossKey,
          'Authorization': `Bearer ${bossKey}`,
        },
        body: JSON.stringify(req.body || {}),
      });
      const data = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json(data);
    }

    if (req.method === 'DELETE') {
      const upstream = await fetch(`${BASE_URL}/samples/${sampleId}`, {
        method: 'DELETE',
        headers: {
          'X-BOSS-KEY': bossKey,
          'Authorization': `Bearer ${bossKey}`,
        },
      });
      if (!upstream.ok) {
        const err = await upstream.json().catch(() => ({}));
        return res.status(upstream.status).json({ error: err.message || `HTTP ${upstream.status}` });
      }
      return res.status(204).end();
    }

    res.setHeader('Allow', ['PATCH', 'DELETE']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
