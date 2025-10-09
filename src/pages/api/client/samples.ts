import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClientToken } from '@/lib/server/clientAuth';
import { listSamplesByClient } from '@/lib/server/localStore';

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const cookie = req.headers.cookie || '';
  const m = /(?:^|; )clientToken=([^;]+)/.exec(cookie);
  const token = (m && m[1]) || null;
  const payload = verifyClientToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  const email = payload.sub;
  const list = listSamplesByClient(email).map((s) => ({
    sampleCode: s.shortCode,
    mineral: 'CU',
    site: s.site,
    status: toBackendStatusToken(s.status),
    grade: null,
    unit: 'PERCENT',
    updatedAt: s.updatedAt,
    receivedAt: s.createdAt,
    mass: s.mass,
    notes: s.notes,
    report: s.reportUrl ? { reportCode: s.fullCode.replace(/[^A-Z0-9]/g, '') } : null,
  }));
  return res.status(200).json({ success: true, data: list });
}
