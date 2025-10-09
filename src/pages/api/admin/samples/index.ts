import type { NextApiRequest, NextApiResponse } from 'next';
import { searchSamplesLocal } from '@/lib/server/localStore';
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

function toBackendStatusToken(local: string): string {
  switch (local) {
    case 'Booked': return 'BOOKED';
    case 'Pickup Assigned': return 'PICKUP_ASSIGNED';
    case 'Picked Up': return 'PICKED_UP';
    case 'In Transit': return 'IN_TRANSIT';
    case 'At Lab Reception': return 'AT_LAB_RECEPTION';
    case 'Received': return 'RECEIVED';
    case 'In Analysis': return 'ANALYZING';
    case 'QA/QC': return 'QA_QC';
    case 'Reported': return 'REPORTED';
    case 'Delivered': return 'DELIVERED';
    default: return 'RECEIVED';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireBoss(req, res)) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { page = '1', limit = '20', search } = req.query as Record<string, string>;
  const { data, total, page: p, limit: l, totalPages } = searchSamplesLocal({
    search,
    page: Number(page),
    limit: Number(limit),
  });

  const shaped = data.map((s) => ({
    sampleCode: s.shortCode,
    mineral: 'CU',
    site: s.site,
    clientEmail: s.clientEmail,
    status: toBackendStatusToken(s.status),
    grade: null,
    unit: 'PERCENT',
    updatedAt: s.updatedAt,
    receivedAt: s.createdAt,
    mass: s.mass,
    notes: s.notes,
    qrCode: undefined,
    report: s.reportUrl ? { reportCode: s.fullCode.replace(/[^A-Z0-9]/g, '') } : null,
  }));

  return res.status(200).json({
    data: shaped,
    pagination: { total, page: p, limit: l, totalPages },
  });
}
