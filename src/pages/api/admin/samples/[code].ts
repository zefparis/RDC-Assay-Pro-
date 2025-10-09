import type { NextApiRequest, NextApiResponse } from 'next';
import { updateStatusLocal, deleteSampleLocal, findByCode, setSampleClientEmailLocal } from '@/lib/server/localStore';

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

function fromBackendToken(token: string): any {
  switch (token) {
    case 'BOOKED': return 'Booked';
    case 'PICKUP_ASSIGNED': return 'Pickup Assigned';
    case 'PICKED_UP': return 'Picked Up';
    case 'IN_TRANSIT': return 'In Transit';
    case 'AT_LAB_RECEPTION': return 'At Lab Reception';
    case 'RECEIVED': return 'Received';
    case 'ANALYZING': return 'In Analysis';
    case 'QA_QC': return 'QA/QC';
    case 'REPORTED': return 'Reported';
    case 'DELIVERED': return 'Delivered';
    default: return 'Received';
  }
}

function shape(sample: ReturnType<typeof findByCode>) {
  if (!sample) return null;
  return {
    sampleCode: sample.shortCode,
    mineral: 'CU',
    site: sample.site,
    clientEmail: sample.clientEmail,
    status: toBackendStatusToken(sample.status),
    grade: null,
    unit: 'PERCENT',
    updatedAt: sample.updatedAt,
    receivedAt: sample.createdAt,
    mass: sample.mass,
    notes: sample.notes,
    qrCode: undefined,
    report: sample.reportUrl ? { reportCode: sample.fullCode.replace(/[^A-Z0-9]/g, '') } : null,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query as { code: string };

  try {
    if (req.method === 'PATCH') {
      const body = (req.body || {}) as { status?: string; notes?: string; clientEmail?: string };
      let updated = undefined as ReturnType<typeof findByCode> | undefined;
      if (body.clientEmail) {
        updated = setSampleClientEmailLocal(code, body.clientEmail) || updated;
      }
      if (body.status) {
        const nextLocal = fromBackendToken(body.status);
        if (!nextLocal) return res.status(400).json({ error: 'Missing or invalid status' });
        updated = updateStatusLocal(code, nextLocal, body.notes) || updated;
      }
      if (!updated) return res.status(400).json({ error: 'No updates applied' });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true, data: { sample: shape(updated) } });
    }

    if (req.method === 'DELETE') {
      const ok = deleteSampleLocal(code);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['PATCH', 'DELETE']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
