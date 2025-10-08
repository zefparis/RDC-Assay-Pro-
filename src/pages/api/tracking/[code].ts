import type { NextApiRequest, NextApiResponse } from 'next';
import { normalizeTrackingInput } from '@/lib/code';
import { findByCode } from '@/lib/server/localStore';

function toBackendSampleShape(s: ReturnType<typeof findByCode>) {
  if (!s) return null;
  const statusToken = toBackendStatusToken(s.status);
  return {
    sampleCode: s.shortCode,
    mineral: 'CU',
    site: s.site,
    status: statusToken,
    grade: null,
    unit: 'PERCENT',
    updatedAt: s.updatedAt,
    receivedAt: s.createdAt,
    mass: s.mass,
    notes: s.notes,
    qrCode: undefined,
    timeline: s.timeline.map((e) => ({ status: toBackendStatusToken(e.type), timestamp: e.at, notes: e.notes })),
    report: s.reportUrl ? { reportCode: s.fullCode.replace(/[^A-Z0-9]/g, '') } : null,
  };
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { code } = req.query as { code: string };
  const norm = normalizeTrackingInput(code);
  if (norm.error) return res.status(400).json({ error: norm.error });
  const sample = findByCode(norm.search);
  if (!sample) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ success: true, data: { sample: toBackendSampleShape(sample) } });
}
