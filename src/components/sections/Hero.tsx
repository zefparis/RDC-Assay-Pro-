import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FlaskConical, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: FlaskConical, label: t.dashboard.active, value: '24', color: 'text-primary-600' },
    { icon: TrendingUp, label: t.dashboard.analyzing, value: '8', color: 'text-warning-600' },
    { icon: ShieldCheck, label: t.dashboard.reports, value: '156', color: 'text-success-600' },
    { icon: Clock, label: t.dashboard.avgTime, value: '48h', color: 'text-secondary-600' },
  ];

  return (
    <section className="relative py-24 lg:py-28 overflow-hidden min-h-[800px]">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/image/elemental-geochemestry.png"
          alt="Elemental geochemistry background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-110 filter saturate-175 contrast-125 brightness-115"
          style={{ objectPosition: 'center 65%' }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 p-6 max-w-2xl rounded-2xl bg-black/50 backdrop-blur-sm md:bg-black/60 dark:bg-secondary-800/50 dark:backdrop-blur-sm"
            >
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl dark:text-secondary-100">
                {t.hero.title}
              </h1>
              <p className="text-xl text-warning-400 leading-relaxed drop-shadow-xl">
                {t.hero.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {t.hero.submitSample}
              </Button>
              <Button
                size="lg"
                onClick={() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })}
                className="ml-3 bg-warning-600 hover:bg-warning-700 text-white shadow-lg"
              >
                {t.hero.trackSample}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 text-sm text-white/80 drop-shadow-md"
            >
              <ShieldCheck className="w-5 h-5 text-white/90" />
              <span>{t.hero.features}</span>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <Card className="p-6 shadow-strong bg-white/70 dark:bg-secondary-900/70 backdrop-blur-sm w-full lg:max-w-[640px] max-h-[540px] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical className="w-6 h-6 text-primary-600" />
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {t.dashboard.title}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {t.dashboard.overview}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                  >
                    <Card padding="sm" className="text-center bg-white/80 dark:bg-secondary-800/50">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {stat.label}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card padding="sm" className="bg-white/80 dark:bg-secondary-800/50">
                  <div className="text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">Pipeline</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-200">Reçus: 32</span>
                    <span className="px-2 py-1 rounded bg-warning-100 text-warning-700 dark:bg-warning-800/30 dark:text-warning-300">En analyse: 8</span>
                    <span className="px-2 py-1 rounded bg-primary-100 text-primary-700 dark:bg-primary-800/30 dark:text-primary-300">QA/QC: 5</span>
                    <span className="px-2 py-1 rounded bg-success-100 text-success-700 dark:bg-success-800/30 dark:text-success-300">Rapportés: 156</span>
                  </div>
                </Card>

                <Card padding="sm" className="bg-white/80 dark:bg-secondary-800/50">
                  <div className="text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">Taux QA/QC</div>
                  <div className="h-2 w-full rounded bg-secondary-200 dark:bg-secondary-800">
                    <div className="h-2 rounded bg-success-500" style={{ width: '86%' }} />
                  </div>
                  <div className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">Conformité: 86%</div>
                </Card>

                <Card padding="sm" className="bg-white/80 dark:bg-secondary-800/50">
                  <div className="text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">SLA</div>
                  <div className="h-2 w-full rounded bg-secondary-200 dark:bg-secondary-800">
                    <div className="h-2 rounded bg-warning-500" style={{ width: '48%' }} />
                  </div>
                  <div className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">Délai moyen: 48h</div>
                </Card>

                <Card padding="sm" className="bg-white/80 dark:bg-secondary-800/50">
                  <div className="text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">Activité récente</div>
                  <ul className="space-y-1 text-xs text-secondary-600 dark:text-secondary-300">
                    <li>Rapport #A1023 généré</li>
                    <li>Échantillon #S789 en analyse</li>
                    <li>Invitation envoyée à client@exemple.com</li>
                  </ul>
                </Card>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-10" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-10" />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
