"use client";

import React, { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function AccessRequestPage() {
  const params = useSearchParams();
  const initialEmail = useMemo(() => (params?.get('email') ?? ''), [params]);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    const e = email.trim();
    if (!e) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setSubmitted(true);
      toast.success('Request sent. You will receive an email once approved.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14 bg-secondary-50 min-h-[70vh]">
      <Toaster />
      <div className="max-w-lg mx-auto px-4">
        <Card padding="lg" className="shadow-strong">
          <div className="text-2xl font-semibold mb-2">Demander l&apos;accès</div>
          <p className="text-secondary-600 mb-6">Entrez votre email pour demander l&apos;accès au portail client RDC Assay. Nous vous enverrons un lien une fois validé.</p>
          {!submitted ? (
            <div className="flex gap-3">
              <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
              <Button onClick={submit} loading={loading} disabled={!email.trim()}>Envoyer</Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">Merci. Votre demande a été enregistrée. Nous vous contacterons par email.</div>
          )}
        </Card>
      </div>
    </section>
  );
}
