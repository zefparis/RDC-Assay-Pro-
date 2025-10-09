"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit3, Upload, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import type { Sample, SampleStatus, Unit } from '@/types';

  function statusVariant(s: SampleStatus): React.ComponentProps<typeof Badge>["variant"] {
    switch (s) {
      case 'Booked': return 'secondary';
      case 'Pickup Assigned': return 'secondary';
      case 'Picked Up': return 'info';
      case 'In Transit': return 'info';
      case 'At Lab Reception': return 'secondary';
      case 'Reported': return 'success';
      case 'In Analysis': return 'info';
      case 'QA/QC': return 'warning';
      case 'Delivered': return 'secondary';
      case 'Received':
      default: return 'default';
    }
  }


export default function BossAdminPage() {
  const { t, locale } = useTranslation();

  // Table state
  const [items, setItems] = useState<Sample[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [editing, setEditing] = useState<Sample | null>(null);
  const [uploading, setUploading] = useState<Sample | null>(null);
  const [nextStatus, setNextStatus] = useState<SampleStatus>('Received');
  const [notes, setNotes] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [unit, setUnit] = useState<Unit | ''>('');

  // Client access / invites state
  const [invites, setInvites] = useState<Array<{ email: string; code: string; status: string; createdAt: string; expiresAt: string }>>([]);
  const [invEmail, setInvEmail] = useState('');
  const [invTtl, setInvTtl] = useState(60);
  const [invLoading, setInvLoading] = useState(false);

  // Boss auth
  const [needBossAuth, setNeedBossAuth] = useState(false);
  const [bossPwd, setBossPwd] = useState('');
  const [bossLoading, setBossLoading] = useState(false);

  // Status options (include pre-lab; fallback labels for new ones)
  const statusOptions = useMemo(() => ([
    { value: 'Booked', label: locale === 'fr' ? 'Pré‑enregistré' : 'Booked' },
    { value: 'Pickup Assigned', label: locale === 'fr' ? 'Ramassage assigné' : 'Pickup Assigned' },
    { value: 'Picked Up', label: locale === 'fr' ? 'Ramassé' : 'Picked Up' },
    { value: 'In Transit', label: locale === 'fr' ? 'En transit' : 'In Transit' },
    { value: 'At Lab Reception', label: locale === 'fr' ? 'Arrivé à la réception labo' : 'At Lab Reception' },
    { value: 'Received', label: t.sample?.status.received || 'Received' },
    { value: 'In Analysis', label: t.sample?.status.inAnalysis || 'In Analysis' },
    { value: 'QA/QC', label: t.sample?.status.qualityCheck || 'QA/QC' },
    { value: 'Reported', label: t.sample?.status.reported || 'Reported' },
    { value: 'Delivered', label: t.sample?.status.delivered || 'Delivered' },
  ] as Array<{ value: SampleStatus; label: string }>), [locale, t.sample?.status]);

  const unitOptions = [
    { value: '%', label: '%' },
    { value: 'g/t', label: 'g/t' },
    { value: 'ppm', label: 'ppm' },
    { value: 'oz/t', label: 'oz/t' },
  ];

  // Load data on mount
  useEffect(() => {
    void loadData(1, '');
    void loadInvitesSafe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async (newPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const resp = await api.adminListSamples({ page: newPage, limit, search });
      setItems(resp.data);
      setPage(resp.page);
      setTotalPages(resp.totalPages);
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes('401') || /unauthorized/i.test(msg)) {
        setNeedBossAuth(true);
      } else {
        toast.error(msg || (locale === 'fr' ? 'Erreur de chargement' : 'Load error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadInvitesSafe = async () => {
    try {
      const list = await api.adminListInvites();
      setInvites(list);
    } catch {}
  };

  const openEdit = (s: Sample) => {
    setEditing(s);
    setNextStatus(s.status);
    setNotes(s.notes || '');
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const updated = await api.adminUpdateSampleStatus(editing.id, nextStatus, notes);
      setItems(prev => prev.map(it => it.id === updated.id ? updated : it));
      toast.success(t.bossadmin?.notifications.statusUpdated || 'Status updated');
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.message || 'Update failed');
    }
  };

  // Quick actions for pre-lab statuses
  const setStatusQuick = async (s: Sample, next: SampleStatus, note?: string) => {
    try {
      const updated = await api.adminUpdateSampleStatus(s.id, next, note);
      setItems(prev => prev.map(it => it.id === updated.id ? updated : it));
      toast.success(t.bossadmin?.notifications.statusUpdated || 'Status updated');
    } catch (e: any) {
      toast.error(e?.message || 'Update failed');
    }
  };

  const setClient = async (s: Sample) => {
    const email = window.prompt(locale === 'fr' ? 'Email client' : 'Client email', s.clientEmail || '')?.trim();
    if (!email) return;
    try {
      const updated = await api.adminSetClientEmail(s.id, email);
      setItems(prev => prev.map(it => it.id === updated.id ? updated : it));
      toast.success(locale === 'fr' ? 'Client défini' : 'Client set');
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  };

  const notifyClient = async (s: Sample) => {
    const email = s.clientEmail || window.prompt(locale === 'fr' ? 'Envoyer à (email)' : 'Send to (email)')?.trim();
    if (!email) return;
    try {
      const r = await api.adminNotifySample(s.id, 'email', email);
      toast.success((locale === 'fr' ? 'Notification envoyée à ' : 'Notification sent to ') + email);
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    }
  };

  const saveUpload = async () => {
    if (!uploading || !uploadFile) return;
    try {
      const updated = await api.adminUploadReport(uploading.id, uploadFile, {
        grade: grade ? Number(grade) : undefined,
        unit: unit || undefined,
      });
      setItems(prev => prev.map(it => it.id === updated.id ? updated : it));
      toast.success(t.bossadmin?.notifications.reportGenerated || 'Report generated');
      setUploading(null);
      setUploadFile(null);
      setGrade('');
      setUnit('');
    } catch (e: any) {
      toast.error(e?.message || 'Upload failed');
    }
  };

  const doDelete = async (s: Sample) => {
    const confirmText = locale === 'fr' ? 'Supprimer définitivement cet enregistrement ?' : 'Permanently delete this record?';
    if (!window.confirm(confirmText)) return;
    try {
      await api.adminDeleteSample(s.id);
      setItems(prev => prev.filter(it => it.id !== s.id));
      toast.success(t.bossadmin?.notifications.deleted || 'Deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-secondary-50 min-h-[80vh]">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {
            <div className="space-y-6">
              {needBossAuth && (
                <Card padding="lg" className="shadow-strong border border-amber-300 bg-amber-50">
                  <div className="text-lg font-bold mb-1">{locale === 'fr' ? 'Authentification Admin' : 'Admin Authentication'}</div>
                  <p className="text-secondary-700 mb-3">{locale === 'fr' ? 'Entrez le mot de passe boss pour accéder au panneau d\'administration.' : 'Enter the boss password to access the admin panel.'}</p>
                  <div className="flex gap-2">
                    <Input type="password" placeholder={locale === 'fr' ? 'Mot de passe' : 'Password'} value={bossPwd} onChange={(e) => setBossPwd(e.target.value)} className="flex-1" />
                    <Button onClick={async () => {
                      setBossLoading(true);
                      try {
                        await api.adminLogin(bossPwd);
                        setNeedBossAuth(false);
                        setBossPwd('');
                        await loadData(1, searchTerm);
                        await loadInvitesSafe();
                        toast.success(locale === 'fr' ? 'Connecté' : 'Authenticated');
                      } catch (e: any) {
                        toast.error(e?.message || 'Login failed');
                      } finally {
                        setBossLoading(false);
                      }
                    }} loading={bossLoading} disabled={!bossPwd.trim()}>
                      {locale === 'fr' ? 'Se connecter' : 'Sign in'}
                    </Button>
                  </div>
                </Card>
              )}
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{t.bossadmin?.title || 'Admin Panel'}</h1>
                  <p className="text-secondary-600 text-sm">{t.bossadmin?.sidebar.samples || 'Samples'}</p>
                </div>
              </div>

              <Card padding="lg" className="shadow-strong">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder={t.bossadmin?.searchPlaceholder || 'Search by code or site...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <Button onClick={() => loadData(1, searchTerm)}>{locale === 'fr' ? 'Rechercher' : 'Search'}</Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-secondary-500">
                        <th className="py-2 pr-4">{t.bossadmin?.table.id || 'ID'}</th>
                        <th className="py-2 pr-4">{t.bossadmin?.table.site || 'Site'}</th>
                        <th className="py-2 pr-4">{t.bossadmin?.table.mineral || 'Mineral'}</th>
                        <th className="py-2 pr-4">{t.bossadmin?.table.status || 'Status'}</th>
                        <th className="py-2 pr-4">{t.bossadmin?.table.updated || 'Updated'}</th>
                        <th className="py-2 pr-4">{t.bossadmin?.table.actions || 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((s) => (
                        <tr key={s.id} className="border-t border-secondary-200">
                          <td className="py-2 pr-4 font-mono font-medium text-secondary-900">{s.id}</td>
                          <td className="py-2 pr-4">{s.site}</td>
                          <td className="py-2 pr-4">{s.mineral}</td>
                          <td className="py-2 pr-4"><Badge variant={statusVariant(s.status)}>{s.status}</Badge></td>
                          <td className="py-2 pr-4">{s.updatedAt}</td>
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-2">
                              {/* Quick pre-lab actions (shown until Received) */}
                              {(['Booked','Pickup Assigned','Picked Up','In Transit','At Lab Reception'] as SampleStatus[]).includes(s.status as SampleStatus) && (
                                <>
                                  <Button variant="outline" size="sm" onClick={() => {
                                    const n = window.prompt(locale === 'fr' ? 'Assignation (notes optionnelles)' : 'Assign pickup (optional notes)') || undefined;
                                    setStatusQuick(s, 'Pickup Assigned', n);
                                  }}>
                                    {locale === 'fr' ? 'Assigner' : 'Assign'}
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setStatusQuick(s, 'Picked Up')}>
                                    {locale === 'fr' ? 'Ramassé' : 'Picked up'}
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setStatusQuick(s, 'In Transit')}>
                                    {locale === 'fr' ? 'Transit' : 'Transit'}
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setStatusQuick(s, 'At Lab Reception')}>
                                    {locale === 'fr' ? 'Arrivé labo' : 'At lab'}
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm" icon={<Edit3 className="w-4 h-4" />} onClick={() => openEdit(s)}>
                                {t.bossadmin?.actions.edit || 'Edit'}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setClient(s)}>
                                {locale === 'fr' ? 'Client' : 'Client'}
                              </Button>
                              <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />} onClick={() => setUploading(s)}>
                                {t.bossadmin?.actions.uploadReport || 'Upload report'}
                              </Button>
                              <Button variant="secondary" size="sm" onClick={() => notifyClient(s)} disabled={!s.clientEmail && s.status !== 'Reported'}>
                                {locale === 'fr' ? 'Notifier' : 'Notify'}
                              </Button>
                              <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => doDelete(s)}>
                                {t.bossadmin?.actions.delete || 'Delete'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-secondary-600">{locale === 'fr' ? `Page ${page} / ${totalPages}` : `Page ${page} / ${totalPages}`}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => loadData(page - 1)}>
                      {locale === 'fr' ? 'Précédent' : 'Prev'}
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => loadData(page + 1)}>
                      {locale === 'fr' ? 'Suivant' : 'Next'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Edit modal */}
              <AnimatePresence>
                {editing && (
                  <div className="fixed inset-0 z-50 grid place-items-center p-4">
                    <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                      <Card padding="lg" className="shadow-strong">
                        <div className="text-lg font-bold mb-4">{t.bossadmin?.actions.changeStatus || 'Change status'}</div>
                        <div className="space-y-4">
                          <Select
                            label={t.bossadmin?.table.status || 'Status'}
                            value={nextStatus}
                            onChange={(e) => setNextStatus(e.target.value as SampleStatus)}
                            options={statusOptions}
                          />
                          <Input
                            label={locale === 'fr' ? 'Notes' : 'Notes'}
                            placeholder={locale === 'fr' ? 'Commentaire interne…' : 'Internal note…'}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setEditing(null)}>{t.common.close}</Button>
                            <Button onClick={saveEdit}>{t.bossadmin?.actions.save || 'Save'}</Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Client Access / Invites */}
              <Card padding="lg" className="shadow-strong">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold">{locale === 'fr' ? 'Accès client' : 'Client Access'}</div>
                    <div className="text-sm text-secondary-600">{locale === 'fr' ? "Invitations par email (code magique)" : 'Email invites (magic code)'}</div>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder={locale === 'fr' ? 'Email client' : 'Client email'} value={invEmail} onChange={(e) => setInvEmail(e.target.value)} />
                    <Input placeholder="TTL (min)" type="number" value={invTtl} onChange={(e) => setInvTtl(Number(e.target.value || 60))} className="w-24" />
                    <Button onClick={async () => {
                      if (!invEmail.trim()) return;
                      setInvLoading(true);
                      try {
                        const inv = await api.adminCreateInvite(invEmail.trim(), invTtl, true);
                        await navigator.clipboard?.writeText(`${window.location.origin}/api/auth/client-redeem?code=${inv.code}`);
                        toast.success(locale === 'fr' ? 'Invitation créée et copiée' : 'Invite created & link copied');
                        setInvEmail('');
                        await loadInvitesSafe();
                      } catch (e: any) {
                        toast.error(e?.message || 'Failed');
                      } finally {
                        setInvLoading(false);
                      }
                    }} loading={invLoading}>{locale === 'fr' ? 'Inviter' : 'Invite'}</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-secondary-500">
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Code</th>
                        <th className="py-2 pr-4">Statut</th>
                        <th className="py-2 pr-4">Créé</th>
                        <th className="py-2 pr-4">Expire</th>
                        <th className="py-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.map((inv) => (
                        <tr key={inv.code} className="border-t border-secondary-200">
                          <td className="py-2 pr-4">{inv.email}</td>
                          <td className="py-2 pr-4 font-mono">{inv.code}</td>
                          <td className="py-2 pr-4">{inv.status}</td>
                          <td className="py-2 pr-4">{new Date(inv.createdAt).toLocaleString()}</td>
                          <td className="py-2 pr-4">{new Date(inv.expiresAt).toLocaleString()}</td>
                          <td className="py-2 pr-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={async () => {
                                try {
                                  await navigator.clipboard?.writeText(`${window.location.origin}/api/auth/client-redeem?code=${inv.code}`);
                                  toast.success(locale === 'fr' ? 'Lien copié' : 'Link copied');
                                } catch {}
                              }}>{locale === 'fr' ? 'Copier lien' : 'Copy link'}</Button>
                              <Button variant="outline" size="sm" onClick={async () => {
                                try {
                                  await navigator.clipboard?.writeText(inv.code);
                                  toast.success(locale === 'fr' ? 'Code copié' : 'Code copied');
                                } catch {}
                              }}>{locale === 'fr' ? 'Copier code' : 'Copy code'}</Button>
                              <Button variant="outline" size="sm" onClick={async () => { try { await api.adminSendInvite(inv.code, { email: inv.email, expiresAt: inv.expiresAt }); toast.success(locale === 'fr' ? 'Envoyé' : 'Sent'); await loadInvitesSafe(); } catch (e: any) { toast.error(e?.message || 'Failed'); } }}>{locale === 'fr' ? 'Envoyer' : 'Send'}</Button>
                              <Button variant="danger" size="sm" onClick={async () => { if (!window.confirm(locale === 'fr' ? 'Révoquer ?' : 'Revoke?')) return; try { await api.adminRevokeInvite(inv.code); toast.success('Revoked'); await loadInvitesSafe(); } catch (e: any) { toast.error(e?.message || 'Failed'); } }}>{locale === 'fr' ? 'Révoquer' : 'Revoke'}</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {invites.length === 0 && (
                        <tr>
                          <td className="py-6 text-center text-secondary-500" colSpan={6}>{locale === 'fr' ? 'Aucune invitation' : 'No invites'}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Upload modal */}
              <AnimatePresence>
                {uploading && (
                  <div className="fixed inset-0 z-50 grid place-items-center p-4">
                    <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                      <Card padding="lg" className="shadow-strong">
                        <div className="text-lg font-bold mb-4">{t.bossadmin?.actions.uploadReport || 'Upload report'}</div>
                        <div className="space-y-4">
                          <input type="file" accept="application/pdf,image/*,.csv" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                          <div className="grid grid-cols-2 gap-3">
                            <Input label={locale === 'fr' ? 'Teneur' : 'Grade'} type="number" step="any" value={grade} onChange={(e) => setGrade(e.target.value)} />
                            <Select label={locale === 'fr' ? 'Unité' : 'Unit'} value={unit} onChange={(e) => setUnit(e.target.value as Unit)} options={unitOptions} />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setUploading(null)}>{t.common.close}</Button>
                            <Button onClick={saveUpload} disabled={!uploadFile}>{t.bossadmin?.actions.save || 'Save'}</Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          }
        </motion.div>
      </div>
    </section>
  );
}
