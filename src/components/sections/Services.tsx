import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FlaskConical, ShieldCheck, Truck, Microscope, FileCheck, QrCode, Clipboard, Share2, Printer } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatShortCodeDisplay } from '@/lib/code';
import { upsertSample, fromPreRegister } from '@/lib/clientCache';
import Image from 'next/image';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [site, setSite] = useState('Kolwezi');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ fullCode: string; shortCode: string; checkDigit: number } | null>(null);

  const services = [
    {
      icon: Search,
      title: t.services.sampling.title,
      description: t.services.sampling.description,
      features: ['Grab sampling', 'Channel sampling', 'Core drilling', 'Chain of custody'],
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
      image: '/image/lab1.jpg',
    },
    {
      icon: FlaskConical,
      title: t.services.analysis.title,
      description: t.services.analysis.description,
      features: ['XRF Analysis', 'ICP-OES/MS', 'Fire Assay', 'Moisture & LOI'],
      color: 'text-accent-700',
      bgColor: 'bg-accent-50',
      image: '/image/elemental-geochemestry.png',
    },
    {
      icon: ShieldCheck,
      title: t.services.certification.title,
      description: t.services.certification.description,
      features: ['Digital certificates', 'Hash verification', 'QR traceability', 'ISO compliance'],
      color: 'text-success-700',
      bgColor: 'bg-success-50',
      image: '/image/gold.jpg',
    },
  ];

  const additionalFeatures = [
    { icon: Truck, label: t.services.supervision },
    { icon: Microscope, label: 'Mineralogy' },
    { icon: FileCheck, label: 'Quality Control' },
    { icon: QrCode, label: 'Digital Tracking' },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Solutions complètes d&apos;analyse minière avec traçabilité numérique et certification internationale
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover padding="lg" className="h-full overflow-hidden">
                {/* Top image */}
                {service.image && (
                  <div className="-mx-6 -mt-6 mb-6 h-40 relative">
                    <Image src={service.image} alt={service.title} fill className="object-cover" priority={index === 0} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 shadow-soft`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-secondary-600 mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-secondary-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pre-registration block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card padding="lg" className="shadow-strong">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {t.services?.preregister?.title || 'Pré‑enregistrer un échantillon'}
                </h3>
                <p className="text-secondary-600">
                  {t.services?.preregister?.description || 'Obtenez un code de suivi avant ramassage.'}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <Input
                label={t.services?.preregister?.site || 'Site'}
                placeholder="Kolwezi, Likasi..."
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
              <Input
                label={t.services?.preregister?.contact || 'Contact'}
                placeholder="email@domaine.com / +243..."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  try {
                    setError('');
                    setLoading(true);
                    const res = await fetch('/api/samples/preregister', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ site, contact }),
                    });
                    if (!res.ok) {
                      const e = await res.json().catch(() => ({}));
                      throw new Error(e.error || `HTTP ${res.status}`);
                    }
                    const data = await res.json();
                    setResult(data.data);
                    try {
                      upsertSample(fromPreRegister({ shortCode: data.data.shortCode, site }));
                    } catch {}
                  } catch (e: any) {
                    setError(t.services?.preregister?.error || 'Échec du pré‑enregistrement');
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
              >
                {t.services?.preregister?.create || 'Créer le code'}
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 rounded-xl bg-secondary-50 border border-secondary-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm text-secondary-500">
                      {t.services?.preregister?.codeIssued || 'Code émis'}
                    </div>
                    <div className="text-xl font-mono font-bold text-secondary-900">
                      {formatShortCodeDisplay(result.shortCode)}
                    </div>
                    <div className="text-sm text-secondary-600">
                      <span className="font-medium">{t.services?.preregister?.fullCode || 'Code complet'}:</span> {result.fullCode}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Clipboard className="w-4 h-4" />}
                      onClick={() => navigator.clipboard.writeText(formatShortCodeDisplay(result.shortCode))}
                    >
                      {t.services?.preregister?.copy || 'Copier'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Share2 className="w-4 h-4" />}
                      onClick={() => {
                        const text = `${t.services?.preregister?.codeIssued || 'Code émis'}: ${formatShortCodeDisplay(result.shortCode)}`;
                        const url = typeof window !== 'undefined' ? window.location.origin + '/#tracking' : '';
                        if (navigator.share) {
                          navigator.share({ title: 'Sample tracking', text, url }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(`${text} ${url}`);
                        }
                      }}
                    >
                      {t.services?.preregister?.share || 'Partager'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Printer className="w-4 h-4" />}
                      onClick={() => {
                        const printable = window.open('', 'print');
                        if (!printable) return;
                        const code = formatShortCodeDisplay(result.shortCode);
                        printable.document.write(`<!doctype html><html><head><meta charset='utf-8'><title>Label</title><style>body{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;padding:24px} .label{border:1px solid #ddd;border-radius:12px;padding:16px;width:320px} .big{font-size:28px;font-weight:800} .small{color:#555;font-size:12px}</style></head><body><div class='label'><div class='big'>${code}</div><div class='small'>${result.fullCode}</div><div class='small'>${site}</div></div><script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300)}</script></body></html>`);
                        printable.document.close();
                      }}
                    >
                      {t.services?.preregister?.print || 'Imprimer étiquette'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card padding="lg" className="bg-gradient-to-r from-secondary-50 to-primary-50">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Services Additionnels
              </h3>
              <p className="text-secondary-600">
                Support complet pour vos opérations minières
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-soft"
                >
                  <feature.icon className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
