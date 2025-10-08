"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LogOut, Search, Edit3, Upload, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import type { Sample, SampleStatus, Unit } from '@/types';

function statusVariant(s: SampleStatus): React.ComponentProps<typeof Badge>["variant"] {
  switch (s) {
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

  // Gate state
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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

  // Status options (localized)
  const statusOptions = useMemo(() => ([
    { value: 'Received', label: t.sample?.status.received || 'Received' },
    { value: 'In Analysis', label: t.sample?.status.inAnalysis || 'In Analysis' },
    { value: 'QA/QC', label: t.sample?.status.qualityCheck || 'QA/QC' },
    { value: 'Reported', label: t.sample?.status.reported || 'Reported' },
    { value: 'Delivered', label: t.sample?.status.delivered || 'Delivered' },
  ] as Array<{ value: SampleStatus; label: string }>), [t.sample?.status]);

  const unitOptions = [
    { value: '%', label: '%' },
    { value: 'g/t', label: 'g/t' },
    { value: 'ppm', label: 'ppm' },
    { value: 'oz/t', label: 'oz/t' },
  ];

  // Check session by attempting a small fetch
  useEffect(() => {
    const check = async () => {
      setChecking(true);
      try {
        await api.adminListSamples({ page: 1, limit: 1 });
        setAuthed(true);
      } catch {
        setAuthed(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  // Auto-refresh token while authed
  useEffect(() => {
    if (!authed) return;
    let stopped = false;
    const REFRESH_MS = 20 * 60 * 1000; // 20 minutes, less than 30m TTL

    const doRefresh = async () => {
      if (stopped) return;
      try {
        await api.adminRefresh();
      } catch (e: any) {
        // On 401 or failure, force logout state
        setAuthed(false);
      }
    };

    const id = setInterval(doRefresh, REFRESH_MS);

    const vis = () => {
      if (document.visibilityState === 'visible') {
        void doRefresh();
      }
    };
    document.addEventListener('visibilitychange', vis);

    return () => {
      stopped = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [authed]);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await api.adminLogin(password);
      setAuthed(true);
      toast.success(locale === 'fr' ? 'Connecté' : 'Logged in');
      // Load data right away
      void loadData(1, searchTerm);
    } catch (err: any) {
      setAuthed(false);
      setLoginError(err?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const loadData = async (newPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const resp = await api.adminListSamples({ page: newPage, limit, search });
      setItems(resp.data);
      setPage(resp.page);
      setTotalPages(resp.totalPages);
    } catch (err: any) {
      if (String(err?.message || '').includes('401')) {
        setAuthed(false);
      } else {
        toast.error(err.message || (locale === 'fr' ? 'Erreur de chargement' : 'Load error'));
      }
    } finally {
      setLoading(false);
    }
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

  const logout = async () => {
    try {
      await fetch('/api/auth/boss-logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setAuthed(false);
  };

  return (
    <section className="py-10 sm:py-16 bg-secondary-50 min-h-[80vh]">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {!authed ? (
            <Card padding="lg" className="max-w-md mx-auto shadow-strong">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold">{t.bossadmin?.loginTitle || 'Laboratory access'}</h1>
                  <p className="text-secondary-600 text-sm">{checking ? (locale === 'fr' ? 'Vérification…' : 'Checking…') : (locale === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password')}</p>
                </div>
              </div>
              <form onSubmit={doLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder={t.bossadmin?.passwordPlaceholder || 'Administrator password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loginError && (
                  <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">{loginError}</div>
                )}
                <Button type="submit" loading={loginLoading} className="w-full">{t.bossadmin?.login || 'Login'}</Button>
              </form>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{t.bossadmin?.title || 'Admin Panel'}</h1>
                  <p className="text-secondary-600 text-sm">{t.bossadmin?.sidebar.samples || 'Samples'}</p>
                </div>
                <Button variant="ghost" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
                  {t.bossadmin?.logout || 'Logout'}
                </Button>
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
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" icon={<Edit3 className="w-4 h-4" />} onClick={() => openEdit(s)}>
                                {t.bossadmin?.actions.edit || 'Edit'}
                              </Button>
                              <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />} onClick={() => setUploading(s)}>
                                {t.bossadmin?.actions.uploadReport || 'Upload report'}
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
          )}
        </motion.div>
      </div>
    </section>
  );
}
