"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Sample } from "@/types";
import { QrCode, ChevronLeft, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function StatusIcon({ done }: { done: boolean }) {
  if (done) return <CheckCircle2 className="w-4 h-4 text-success-600" />;
  return <Clock className="w-4 h-4 text-secondary-400" />;
}

export default function TrackPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sample, setSample] = useState<Sample | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await api.getSample(params.code);
        if (!mounted) return;
        setSample(s);
        setError("");
      } catch (e: any) {
        if (!mounted) return;
        const msg = e?.message || "Erreur";
        if (msg.includes("Access token")) {
          setError("Veuillez vous connecter pour accéder au suivi de l'échantillon.");
        } else if (msg.includes("404")) {
          setError("Échantillon introuvable.");
        } else {
          setError("Impossible de charger le suivi pour le moment.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [params.code]);

  return (
    <div className="min-h-screen bg-secondary-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/#tracking") } icon={<ChevronLeft className="w-4 h-4" />}>Retour</Button>
        </div>

        <Card padding="lg" className="shadow-strong">
          <div className="flex items-center gap-3 mb-6">
            <QrCode className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Suivi de l&apos;échantillon</h1>
              <p className="text-secondary-600">Code: {params.code}</p>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-secondary-500">Chargement…</div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center gap-2 text-danger-700">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && sample && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                {sample.qrCode && (
                  <Image
                    src={sample.qrCode}
                    alt={`QR ${sample.id}`}
                    width={144}
                    height={144}
                    className="rounded-lg bg-white p-1 border border-secondary-200 shadow-sm"
                  />
                )}
                <div className="space-y-2">
                  <div className="font-mono text-secondary-900 text-lg">{sample.id}</div>
                  <div className="text-secondary-700">{sample.site} • {sample.mineral}</div>
                  {sample.grade != null && (
                    <div className="text-secondary-900 font-medium">{sample.grade} {sample.unit}</div>
                  )}
                </div>
              </div>

              {sample.timeline && sample.timeline.length > 0 && (
                <div>
                  <div className="text-sm text-secondary-500 mb-3">Historique</div>
                  <div className="flex flex-col gap-3">
                    {sample.timeline.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <StatusIcon done={e.done} />
                        <div className="text-sm">
                          <span className="font-medium text-secondary-900">{e.label}</span>
                          {e.when && <span className="text-secondary-500 ml-2">• {e.when}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
