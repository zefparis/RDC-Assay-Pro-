import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getSampleIdByCode(code: string, bossKey: string): Promise<string> {
  const resp = await fetch(`${BASE_URL}/samples/code/${encodeURIComponent(code)}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-BOSS-KEY': bossKey,
    },
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data.data.sample?.id || data.data?.sample?.id || data.data?.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const bossKey = process.env.BOSS_KEY || '';
  if (!bossKey) return res.status(500).json({ error: 'Server not configured: BOSS_KEY missing' });

  const { code } = req.query as { code: string };

  try {
    const sampleId = await getSampleIdByCode(code, bossKey);

    // Forward multipart body as-is
    const upstream = await fetch(`${BASE_URL}/samples/${sampleId}/report`, {
      method: 'POST',
      headers: {
        'X-BOSS-KEY': bossKey,
        // Preserve content-type including boundary if present
        'Content-Type': (req.headers['content-type'] as string) || 'application/octet-stream',
      },
      // @ts-expect-error: Node IncomingMessage is acceptable as BodyInit in Node fetch
      body: req,
    });

    const text = await upstream.text();
    // Try passthrough JSON if possible
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      res.status(upstream.status).setHeader('Content-Type', upstream.headers.get('content-type') || 'text/plain');
      return res.send(text);
    }
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
