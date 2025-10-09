"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface ClientSampleItem {
  sampleCode: string;
  mineral: string;
  site: string;
  status: string;
  unit: string;
  updatedAt: string;
  receivedAt?: string;
  mass?: number;
  notes?: string;
  report?: { reportCode: string } | null;
}

export default function ClientPortalPage() {
  const API_BASE = useMemo(() => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1', []);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [items, setItems] = useState<ClientSampleItem[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/client/samples', { credentials: 'include' });
      if (res.status === 401) {
        setAuthorized(false);
        setItems([]);
      } else if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
        setAuthorized(true);
      } else {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/client-logout', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      toast.success('Déconnecté');
      setAuthorized(false);
      setItems([]);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la déconnexion');
    }
  };

  const variantFor = (status: string): any => {
    switch (status) {
      case 'Reported': return 'success';
      case 'In Analysis': return 'info';
      case 'QA/QC': return 'warning';
      case 'Delivered': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <section className="py-14 bg-secondary-50 min-h-[70vh]">
      <Toaster />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Espace Client</h1>
          {authorized && (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={load} disabled={loading}>Rafraîchir</Button>
              <Button variant="outline" onClick={logout}>Se déconnecter</Button>
            </div>
          )}
        </div>

        <Card padding="lg" className="shadow-strong">
          {loading && <div className="text-secondary-600">Chargement…</div>}

          {!loading && authorized === false && (
            <div className="space-y-3">
              <div className="text-secondary-700">Vous n&apos;êtes pas connecté. Cliquez sur le lien reçu par email pour accéder à votre espace, ou demandez un accès.</div>
              <div className="flex gap-2">
                <Link href="/access" className="text-primary-600 hover:text-primary-700 font-medium">Demander l&apos;accès</Link>
              </div>
            </div>
          )}

          {!loading && authorized && (
            <div className="space-y-4">
              {items.length === 0 && (
                <div className="text-secondary-600">Aucun échantillon associé à votre compte pour l&apos;instant.</div>
              )}
              {items.map((it) => (
                <div key={it.sampleCode} className="p-4 rounded-xl bg-white border border-secondary-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant={variantFor(it.status) as any}>{it.status}</Badge>
                    <div className="font-mono font-semibold">{it.sampleCode}</div>
                    <div className="text-sm text-secondary-600">{it.site}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {it.report?.reportCode ? (
                      <a
                        href={`${API_BASE}/reports/${it.report.reportCode}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Télécharger le rapport
                      </a>
                    ) : (
                      <span className="text-sm text-secondary-500">En cours…</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
