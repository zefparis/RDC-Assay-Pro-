import { onlyDigits, computeLuhnDigit } from '@/lib/code';

export type LocalStatus =
  | 'Booked'
  | 'Pickup Assigned'
  | 'Picked Up'
  | 'In Transit'
  | 'At Lab Reception'
  | 'Received'
  | 'In Analysis'
  | 'QA/QC'
  | 'Reported'
  | 'Delivered';

export interface LocalTimelineEvent {
  type: LocalStatus;
  at: string; // ISO string
  by?: string;
  location?: { lat: number; lng: number };
  notes?: string;
}

// ===== Invites helpers =====
function randomCode(len = 6): string {
  let s = '';
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function createInvite(email: string, ttlMinutes = 60): LocalInvite {
  const code = randomCode(6);
  const now = new Date();
  const invite: LocalInvite = {
    email: String(email || '').trim().toLowerCase(),
    code,
    createdAt: nowISO(),
    expiresAt: new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString(),
    status: 'Pending',
  };
  STORE.invites.set(code, invite);
  return invite;
}

export function listInvites(): LocalInvite[] {
  return Array.from(STORE.invites.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function revokeInvite(code: string): boolean {
  const it = STORE.invites.get(code);
  if (!it) return false;
  it.status = 'Revoked';
  it.revokedAt = nowISO();
  return true;
}

export function redeemInvite(code: string): LocalInvite | null {
  const it = STORE.invites.get(code);
  if (!it) return null;
  if (it.status === 'Revoked') return null;
  if (new Date(it.expiresAt).getTime() < Date.now()) return null;
  it.status = 'Redeemed';
  it.redeemedAt = nowISO();
  return it;
}

export function markInviteSent(code: string): LocalInvite | null {
  const it = STORE.invites.get(code);
  if (!it) return null;
  if (it.status === 'Revoked') return null;
  it.status = 'Sent';
  return it;
}

export function createSubmittedSample(input: {
  site: string;
  mineral?: string;
  unit?: string;
  mass?: number;
  notes?: string;
}): LocalSample {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const tail = String(now.getTime()).slice(-3);
  const extra = Math.floor(Math.random() * 10);
  const shortDigits = `${yy}${mm}${tail}`.slice(0, 6) + String(extra);
  const checkDigit = computeLuhnDigit(shortDigits);
  const seq = `${yy}${mm}${tail}${String(extra)}`.slice(-6);
  const fullCode = `RC-${yy}${mm}-${seq}`;

  const sample: LocalSample = {
    id: shortDigits,
    fullCode,
    shortCode: shortDigits,
    checkDigit,
    site: input.site || 'Kolwezi',
    mineral: input.mineral,
    unit: input.unit,
    mass: input.mass,
    notes: input.notes,
    status: 'Received',
    createdAt: nowISO(),
    updatedAt: nowISO(),
    timeline: [
      { type: 'Received', at: nowISO(), notes: input.notes },
    ],
  };
  STORE.samples.set(sample.id, sample);
  return sample;
}

export interface LocalSample {
  id: string; // shortCode (7 digits) used as primary key in this store
  fullCode: string; // RC-YYMM-######
  shortCode: string; // 7 digits
  checkDigit: number;
  site: string;
  clientEmail?: string;
  mineral?: string;
  unit?: string;
  mass?: number;
  notes?: string;
  status: LocalStatus;
  updatedAt: string;
  createdAt: string;
  timeline: LocalTimelineEvent[];
  reportUrl?: string;
  technician?: string;
  estimatedCompletion?: string;
  lastNotificationAt?: string;
}

// Client invite types
export type LocalInviteStatus = 'Pending' | 'Sent' | 'Redeemed' | 'Revoked';
export interface LocalInvite {
  email: string;
  code: string; // magic code
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string;
  revokedAt?: string;
  status: LocalInviteStatus;
}

// In-memory store (non-persistent). For production, replace by a DB.
const STORE: { samples: Map<string, LocalSample>; invites: Map<string, LocalInvite> } = {
  samples: new Map(),
  invites: new Map(), // key by code
};

function nowISO(): string {
  return new Date().toISOString();
}

export function createPreRegisteredSample(input: { site: string; contact?: string }): LocalSample {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  // Sequential placeholder: use timestamp tail to avoid collision in-memory
  const tail = String(now.getTime()).slice(-3); // last 3 digits
  const extra = Math.floor(Math.random() * 10);
  const shortDigits = `${yy}${mm}${tail}`.slice(0, 6) + String(extra); // 7 digits
  const checkDigit = computeLuhnDigit(shortDigits);
  const seq = `${yy}${mm}${tail}${String(extra)}`.slice(-6);
  const fullCode = `RC-${yy}${mm}-${seq}`;

  const sample: LocalSample = {
    id: shortDigits,
    fullCode,
    shortCode: shortDigits,
    checkDigit,
    site: input.site || 'Kolwezi',
    status: 'Booked',
    createdAt: nowISO(),
    updatedAt: nowISO(),
    timeline: [
      { type: 'Booked', at: nowISO(), notes: input.contact ? `Contact: ${input.contact}` : undefined },
    ],
  };
  STORE.samples.set(sample.id, sample);
  return sample;
}

export function findByCode(codeOrShort: string): LocalSample | undefined {
  const digits = onlyDigits(codeOrShort);
  if (!digits) return undefined;
  // Primary key is 7-digit shortCode
  const byShort = STORE.samples.get(digits);
  if (byShort) return byShort;
  // Try match by fullCode fragments
  const vals = Array.from(STORE.samples.values());
  for (let i = 0; i < vals.length; i++) {
    const s = vals[i];
    if (s.fullCode.replace(/\D+/g, '') === digits) return s;
  }
  return undefined;
}

export function searchSamplesLocal(params: { search?: string; page?: number; limit?: number }) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 20));
  const q = (params.search || '').toLowerCase().trim();
  const all = Array.from(STORE.samples.values());
  const filtered = q
    ? all.filter((s) =>
        s.site.toLowerCase().includes(q) ||
        s.shortCode.includes(q.replace(/\D+/g, '')) ||
        s.fullCode.toLowerCase().includes(q)
      )
    : all;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function updateStatusLocal(code: string, next: LocalStatus, notes?: string): LocalSample | undefined {
  const s = findByCode(code);
  if (!s) return undefined;
  s.status = next;
  s.updatedAt = nowISO();
  s.timeline.push({ type: next, at: s.updatedAt, notes });
  return s;
}

export function setSampleClientEmailLocal(code: string, email: string): LocalSample | undefined {
  const s = findByCode(code);
  if (!s) return undefined;
  s.clientEmail = String(email || '').trim().toLowerCase();
  s.updatedAt = nowISO();
  s.timeline.push({ type: s.status, at: s.updatedAt, notes: `Client set: ${s.clientEmail}` });
  return s;
}

export function uploadReportLocal(code: string, url: string, meta?: { technician?: string; grade?: number; unit?: string }) {
  const s = findByCode(code);
  if (!s) return undefined;
  s.reportUrl = url;
  s.status = 'Reported';
  s.updatedAt = nowISO();
  s.timeline.push({ type: 'Reported', at: s.updatedAt, notes: 'Report uploaded' });
  if (meta?.technician) s.technician = meta.technician;
  return s;
}

export function notifyClientLocal(code: string, channel: 'email' | 'sms' = 'email', contact?: string) {
  const s = findByCode(code);
  if (!s) return undefined;
  const now = nowISO();
  s.lastNotificationAt = now;
  s.updatedAt = now;
  const note = `Client notified via ${channel}${contact ? ' to ' + contact : ''}`;
  s.timeline.push({ type: s.status, at: now, notes: note });
  return s;
}

export function deleteSampleLocal(code: string): boolean {
  const s = findByCode(code);
  if (!s) return false;
  return STORE.samples.delete(s.id);
}
