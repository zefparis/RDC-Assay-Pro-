import type { NextApiRequest, NextApiResponse } from 'next';
import { createSubmittedSample } from '@/lib/server/localStore';

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

function mineralToBackend(min?: string) {
  switch ((min || 'Cu') as string) {
    case 'Cu': return 'CU';
    case 'Co': return 'CO';
    case 'Li': return 'LI';
    case 'Au': return 'AU';
    case 'Sn': return 'SN';
    case 'Ta': return 'TA';
    case 'W': return 'W';
    case 'Zn': return 'ZN';
    case 'Pb': return 'PB';
    case 'Ni': return 'NI';
    default: return 'CU';
  }
}

function unitToBackend(unit?: string) {
  switch ((unit || '%') as string) {
    case '%': return 'PERCENT';
    case 'g/t': return 'GRAMS_PER_TON';
    case 'ppm': return 'PPM';
    case 'oz/t': return 'OUNCES_PER_TON';
    default: return 'PERCENT';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const s = createSubmittedSample({
      site: body.site || 'Kolwezi',
      mineral: body.mineral,
      unit: body.unit,
      mass: body.mass,
      notes: body.notes,
    });

    const shaped = {
      sampleCode: s.shortCode,
      mineral: mineralToBackend(s.mineral),
      site: s.site,
      status: toBackendStatusToken(s.status),
      grade: null,
      unit: unitToBackend(s.unit),
      updatedAt: s.updatedAt,
      receivedAt: s.createdAt,
      mass: s.mass,
      notes: s.notes,
      qrCode: undefined,
      report: null,
    };

    return res.status(200).json({ success: true, data: { sample: shaped } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
