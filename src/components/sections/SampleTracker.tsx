import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, QrCode, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import { Sample } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const SampleTracker: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [error, setError] = useState('');

  const searchSamples = useCallback(async () => {
    // Ne pas faire de recherche si pas de query
    if (!query.trim()) {
      setSamples([]);
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await api.searchSamples(query);
      setSamples(response.data);
    } catch (err: any) {
      if (err.message?.includes('Access token required') || err.message?.includes('401')) {
        setError('Veuillez vous connecter pour rechercher des échantillons');
      } else {
        setError(t.common.error);
      }
      setSamples([]);
    } finally {
      setLoading(false);
    }
  }, [query, t.common.error]);

  // Supprimer le useEffect automatique
  // useEffect(() => {
  //   searchSamples();
  // }, [searchSamples]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchSamples();
  };

  return (
    <section id="tracking" className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card padding="lg" className="shadow-strong">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  {t.tracking.title}
                </h2>
                <p className="text-secondary-600">
                  {t.tracking.subtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <Input
                  placeholder={t.tracking.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  loading={loading}
                  className="min-w-32"
                >
                  {t.tracking.search}
                </Button>
              </div>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center gap-2 text-danger-700"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {samples.map((sample, index) => (
                  <motion.div
                    key={sample.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SampleRow sample={sample} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!loading && samples.length === 0 && (
                <div className="text-center py-12 text-secondary-500">
                  {t.tracking.noResults}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

interface SampleRowProps {
  sample: Sample;
}

const SampleRow: React.FC<SampleRowProps> = ({ sample }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Reported': return 'success';
      case 'Analyzing': case 'QA/QC': return 'info';
      case 'Prep': return 'warning';
      default: return 'default';
    }
  };

  const loadDetails = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setLoading(true);
    try {
      const sampleDetails = await api.getSample(sample.id);
      setDetails(sampleDetails);
      setExpanded(true);
    } catch (err) {
      console.error('Failed to load sample details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, done: boolean) => {
    if (done) return <CheckCircle2 className="w-4 h-4 text-success-600" />;
    return <Clock className="w-4 h-4 text-secondary-400" />;
  };

  return (
    <Card padding="md" className="transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Badge variant={getStatusVariant(sample.status) as any}>
            {sample.status}
          </Badge>
          <div className="font-mono font-semibold text-secondary-900">
            {sample.id}
          </div>
          <div className="text-sm text-secondary-600">
            {sample.site} • {sample.mineral}
          </div>
          {sample.grade && (
            <div className="text-sm font-medium text-secondary-900">
              {sample.grade} {sample.unit}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={loadDetails}
          loading={loading}
          icon={<ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />}
          iconPosition="right"
        >
          {t.tracking.viewStatus}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-secondary-200"
          >
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-sm text-secondary-500 mb-1">{t.tracking.mineral}</div>
                <div className="font-semibold text-secondary-900">{details.mineral}</div>
              </div>
              <div>
                <div className="text-sm text-secondary-500 mb-1">{t.tracking.site}</div>
                <div className="font-semibold text-secondary-900">{details.site}</div>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-secondary-600" />
                <div className="text-sm text-secondary-600">{t.tracking.qrTraceability}</div>
              </div>
            </div>

            {details.timeline && (
              <div>
                <div className="text-sm text-secondary-500 mb-3">{t.tracking.timeline}</div>
                <div className="flex flex-wrap gap-4">
                  {details.timeline.map((event, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {getStatusIcon(event.label, event.done)}
                      <div className="text-sm">
                        <span className={`font-medium ${event.done ? 'text-secondary-900' : 'text-secondary-500'}`}>
                          {event.label}
                        </span>
                        {event.when && (
                          <span className="text-secondary-500 ml-2">• {event.when}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {details.notes && (
              <div className="mt-4 p-3 rounded-lg bg-secondary-50">
                <div className="text-sm text-secondary-500 mb-1">Notes</div>
                <div className="text-sm text-secondary-700">{details.notes}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default SampleTracker;
