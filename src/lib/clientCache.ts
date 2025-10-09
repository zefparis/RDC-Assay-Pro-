import type { Sample, SampleStatus, MineralType, Unit } from '@/types';

const KEY = 'local-samples-cache-v1';

function isClient() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function read(): Sample[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(list: Sample[]) {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 500)));
  } catch {}
}

export function upsertSample(s: Sample) {
  const list = read();
  const idx = list.findIndex(x => x.id === s.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...s };
  else list.unshift(s);
  write(list);
}

export function getSample(id: string): Sample | null {
  const list = read();
  return list.find(x => x.id === id) || null;
}

export function updateStatus(id: string, status: SampleStatus, notes?: string) {
  const list = read();
  const idx = list.findIndex(x => x.id === id);
  if (idx < 0) return;
  const now = new Date().toISOString().split('T')[0];
  const prev = list[idx];
  const timeline = (prev.timeline || []).concat([{ label: status as any, done: true, when: now }]);
  list[idx] = { ...prev, status, notes: notes ?? prev.notes, updatedAt: now, timeline };
  write(list);
}

export function removeSample(id: string) {
  const list = read();
  write(list.filter(x => x.id !== id));
}

export function search(query: string): Sample[] {
  const q = (query || '').toLowerCase();
  const list = read();
  if (!q) return list;
  const digits = q.replace(/\D+/g, '');
  return list.filter(x =>
    x.id.includes(digits) ||
    x.site?.toLowerCase().includes(q) ||
    x.mineral?.toLowerCase() === q
  );
}

export function fromPreRegister(params: { shortCode: string; site: string }): Sample {
  const now = new Date().toISOString().split('T')[0];
  return {
    id: params.shortCode,
    mineral: 'Cu' as MineralType,
    site: params.site,
    status: 'Booked' as SampleStatus,
    grade: null,
    unit: '%' as Unit,
    updatedAt: now,
    createdAt: now,
    mass: undefined,
    notes: undefined,
    timeline: [{ label: 'Booked' as any, done: true, when: now }],
  };
}
