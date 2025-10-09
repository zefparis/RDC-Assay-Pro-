"use client";

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';

export default function AccessRequestPage() {
  const [email, setEmail] = useState('');
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
          <div className="text-2xl font-semibold mb-2">Request Access</div>
          <p className="text-secondary-600 mb-6">Enter your email to request access to the RDC Assay client portal.</p>
          {!submitted ? (
            <div className="flex gap-3">
              <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
              <Button onClick={submit} loading={loading} disabled={!email.trim()}>Send</Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">Thank you. Your request has been recorded.</div>
          )}
        </Card>
      </div>
    </section>
  );
}
