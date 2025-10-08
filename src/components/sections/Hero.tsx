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
    <section className="relative py-20 overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/image/elemental-geochemestry.png"
          alt="Elemental geochemistry background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-secondary-50/80" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-xl text-secondary-600 leading-relaxed">
                {t.hero.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
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
                variant="outline"
                onClick={() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.hero.trackSample}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 text-sm text-secondary-500"
            >
              <ShieldCheck className="w-5 h-5 text-success-600" />
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
            <Card className="p-6 shadow-strong">
              <div className="flex items-center gap-3 mb-6">
                <FlaskConical className="w-6 h-6 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {t.dashboard.title}
                  </h3>
                  <p className="text-sm text-secondary-500">
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
                    <Card padding="sm" className="text-center">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-secondary-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-secondary-500">
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
