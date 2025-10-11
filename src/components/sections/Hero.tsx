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
            <Card className="p-6 shadow-strong bg-white/70 dark:bg-secondary-900/70 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <FlaskConical className="w-6 h-6 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {t.dashboard.title}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {t.dashboard.overview}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
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

              {/* Decorative elements */}
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
