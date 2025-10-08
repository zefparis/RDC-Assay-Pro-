"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CheckCircle2, ClipboardList, Globe2, MapPin, ShieldCheck, Truck, Beaker } from "lucide-react";

const schema = z.object({
  companyContact: z.string().min(2, "Required"),
  location: z.string().min(2, "Required"),
  mineralType: z.string().min(1, "Required"),
  estimatedVolume: z.string().min(1, "Required"),
  serviceType: z.enum(["inspection", "sampling_analysis", "port_supervision"], {
    required_error: "Required",
  }),
  datePeriod: z.string().min(1, "Required"),
  notes: z.string().optional(),
  attachments: z.any().optional(),
});

type FormValues = z.infer<typeof schema> & { attachments?: FileList };

export default function InspectionPage() {
  const { t, locale } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; id?: string; error?: string } | null>(null);

  const nf = useMemo(
    () =>
      new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [locale]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      setResult(null);

      const payload = {
        companyContact: values.companyContact,
        location: values.location,
        mineralType: values.mineralType,
        estimatedVolume: values.estimatedVolume,
        serviceType: values.serviceType,
        datePeriod: values.datePeriod,
        notes: values.notes || "",
      };

      const res = await fetch("/api/inspection/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setResult({ ok: true, id: data.id });
      reset();
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Localized strings
  const I = t.inspection!;

  const stepsIcons = [ClipboardList, ShieldCheck, MapPin, Globe2, Beaker, CheckCircle2, Truck];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <Header />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary-900 leading-tight">
              {I.hero.title}
            </h1>
            <p className="mt-4 text-lg text-secondary-700 max-w-3xl">
              {I.hero.tagline}
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#request" className="inline-block">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  {I.form.title}
                </Button>
              </a>
              <a href="#why" className="inline-block">
                <Button size="lg" variant="outline">{I.why.title}</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.why.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {I.why.items.map((txt, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card padding="lg" className="h-full">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-success-600 mt-0.5" />
                    <p className="text-secondary-700">{txt}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.process.title}
          </motion.h2>
          <div className="grid lg:grid-cols-7 md:grid-cols-4 grid-cols-2 gap-4">
            {I.process.steps.map((s, i) => {
              const Icon = stepsIcons[i % stepsIcons.length];
              return (
                <motion.div key={s} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card padding="md" className="text-center">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 grid place-items-center mb-2">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="text-xs uppercase tracking-wide text-secondary-500">{i + 1}</div>
                    <div className="font-medium text-secondary-900">{s}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.pricing.title}
          </motion.h2>
          <Card padding="lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-sm text-secondary-600">
                    <th className="py-2 pr-6">{I.pricing.columns.service}</th>
                    <th className="py-2 pr-6">{I.pricing.columns.range}</th>
                    <th className="py-2">{I.pricing.columns.variables}</th>
                  </tr>
                </thead>
                <tbody className="text-secondary-800">
                  {I.pricing.items.map((row, idx) => {
                    const ranges = [
                      [500, 2000],
                      [2000, 10000],
                      [800, 5000],
                    ];
                    const [min, max] = ranges[idx] || [1000, 5000];
                    const label = `${nf.format(min)}–${nf.format(max)}${idx === 1 ? "+" : ""}`;
                    return (
                      <tr key={idx} className="border-t border-secondary-200">
                        <td className="py-3 pr-6 font-medium">{row.service}</td>
                        <td className="py-3 pr-6">{label}</td>
                        <td className="py-3">{row.variables}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-secondary-500 mt-3">{I.pricing.note}</div>
          </Card>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.conditions.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-4">
            {I.conditions.items.map((c, i) => (
              <Card key={i} padding="md" className="text-secondary-700">{c}</Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.form.title}
          </motion.h2>
          <Card padding="lg" className="shadow-strong">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label={I.form.companyContact}
                placeholder="RDC Assay Pro / Jane Doe"
                {...register("companyContact")}
                error={errors.companyContact && (I.form.required)}
              />

              <Input
                label={I.form.location}
                placeholder={locale === "fr" ? "Pays / Port / Site" : "Country / Port / Site"}
                {...register("location")}
                error={errors.location && (I.form.required)}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label={I.form.mineralType}
                  placeholder={locale === "fr" ? "Cu, Co, Au..." : "Cu, Co, Au..."}
                  {...register("mineralType")}
                  error={errors.mineralType && (I.form.required)}
                />
                <Input
                  label={I.form.estimatedVolume}
                  placeholder={locale === "fr" ? "Tonnage est." : "Est. tonnage"}
                  {...register("estimatedVolume")}
                  error={errors.estimatedVolume && (I.form.required)}
                />
              </div>

              <Select
                label={I.form.serviceType}
                options={[
                  { value: "", label: locale === "fr" ? "Sélectionner..." : "Select...", disabled: true },
                  { value: "inspection", label: I.form.serviceOptions.inspectionOnly },
                  { value: "sampling_analysis", label: I.form.serviceOptions.samplingAnalysis },
                  { value: "port_supervision", label: I.form.serviceOptions.portSupervision },
                ]}
                {...register("serviceType")}
              />

              <Input
                label={I.form.datePeriod}
                placeholder={locale === "fr" ? "jj/mm/aaaa" : "dd/mm/yyyy"}
                {...register("datePeriod")}
                error={errors.datePeriod && (I.form.required)}
              />

              <Input
                label={I.form.notes}
                placeholder={locale === "fr" ? "Détails, contraintes, accès..." : "Details, constraints, access..."}
                {...register("notes")}
              />

              <Input
                type="file"
                label={I.form.attachments}
                {...register("attachments")}
              />

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button type="submit" loading={submitting} className="min-w-40">
                  {I.form.submit}
                </Button>
                {result && (
                  <div className={result.ok ? "text-success-700" : "text-danger-700"}>
                    {result.ok ? I.form.success : I.form.error}
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-secondary-900 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {I.faq.title}
          </motion.h2>
          <div className="divide-y divide-secondary-200 rounded-xl border border-secondary-200 bg-white">
            {I.faq.items.map((item, idx) => (
              <details key={idx} className="p-5 group" open={idx === 0}>
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-medium text-secondary-900">{item.q}</span>
                  <span className="text-secondary-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="mt-2 text-secondary-700">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
