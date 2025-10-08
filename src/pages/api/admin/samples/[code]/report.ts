import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadReportLocal, findByCode } from '@/lib/server/localStore';

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

function shape(code: string) {
  const s = findByCode(code);
  if (!s) return null;
  return {
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
    qrCode: undefined,
    report: s.reportUrl ? { reportCode: s.fullCode.replace(/[^A-Z0-9]/g, '') } : null,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { code } = req.query as { code: string };
  // Simulate upload: set a fake URL and mark Reported
  const url = `https://example.com/reports/${code}.pdf`;
  const s = uploadReportLocal(code, url);
  if (!s) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ success: true, data: { sample: shape(code) } });
}
