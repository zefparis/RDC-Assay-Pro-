import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { MineralType, Unit } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const submissionSchema = z.object({
  mineral: z.string().min(1, 'Mineral type is required'),
  unit: z.string().min(1, 'Unit is required'),
  site: z.string().min(1, 'Mining site is required'),
  mass: z.number().min(0.1, 'Mass must be at least 0.1 kg'),
  notes: z.string().optional(),
});

type SubmissionForm = z.infer<typeof submissionSchema>;

const SampleSubmission: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      mineral: 'Cu',
      unit: '%',
      site: 'Kolwezi',
      mass: 5,
      notes: '',
    },
  });

  const mineralOptions = [
    { value: 'Cu', label: 'Copper (Cu)' },
    { value: 'Co', label: 'Cobalt (Co)' },
    { value: 'Li', label: 'Lithium (Li)' },
    { value: 'Au', label: 'Gold (Au)' },
    { value: 'Sn', label: 'Tin (Sn)' },
    { value: 'Ta', label: 'Tantalum (Ta)' },
    { value: 'W', label: 'Tungsten (W)' },
    { value: 'Zn', label: 'Zinc (Zn)' },
    { value: 'Pb', label: 'Lead (Pb)' },
    { value: 'Ni', label: 'Nickel (Ni)' },
  ];

  const unitOptions = [
    { value: '%', label: 'Percentage (%)' },
    { value: 'g/t', label: 'Grams per tonne (g/t)' },
    { value: 'ppm', label: 'Parts per million (ppm)' },
    { value: 'oz/t', label: 'Ounces per tonne (oz/t)' },
  ];

  const onSubmit = async (data: SubmissionForm) => {
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const sample = await api.createSample({
        mineral: data.mineral as MineralType,
        site: data.site,
        unit: data.unit as Unit,
        mass: data.mass,
        notes: data.notes,
      });
      
      setSuccess({ id: sample.id });
      reset();
    } catch (err: any) {
      if (err.message?.includes('Access token required') || err.message?.includes('401')) {
        setError('Veuillez vous connecter pour soumettre un échantillon');
      } else {
        setError(err.message || t.submission.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="submit" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card padding="lg" className="shadow-strong">
            <div className="flex items-center gap-3 mb-8">
              <FlaskConical className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  {t.submission.title}
                </h2>
                <p className="text-secondary-600">
                  {t.submission.subtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Select
                  label={t.submission.mineralType}
                  options={mineralOptions}
                  error={errors.mineral?.message}
                  {...register('mineral')}
                />
                
                <Select
                  label={t.submission.unit}
                  options={unitOptions}
                  error={errors.unit?.message}
                  {...register('unit')}
                />
                
                <Input
                  label={t.submission.miningSite}
                  placeholder="Kolwezi, Likasi, Kibali..."
                  error={errors.site?.message}
                  {...register('site')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  step="0.1"
                  label={t.submission.mass}
                  error={errors.mass?.message}
                  {...register('mass', { valueAsNumber: true })}
                />
                
                <Input
                  label={t.submission.notes}
                  placeholder={t.submission.notesPlaceholder}
                  error={errors.notes?.message}
                  {...register('notes')}
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-secondary-500">
                    Endpoint: <code className="bg-secondary-100 px-2 py-1 rounded text-xs">POST /api/samples</code>
                  </div>
                  {isAuthenticated ? (
                    <Badge variant="success" size="sm">✓ Connecté</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">⚠ Connexion requise</Badge>
                  )}
                </div>
                
                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="min-w-32"
                  disabled={!isAuthenticated}
                >
                  {t.submission.submit}
                </Button>
              </div>
            </form>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-success-50 border border-success-200"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                  <div>
                    <div className="text-success-800 font-medium">
                      {t.submission.success}
                    </div>
                    <div className="text-sm text-success-700 mt-1">
                      {t.submission.initialStatus}: <Badge variant="default" size="sm">Received</Badge>
                      <span className="ml-2">ID: <code className="font-mono font-semibold">{success.id}</code></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-danger-600" />
                <div className="text-danger-800">{error}</div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleSubmission;
