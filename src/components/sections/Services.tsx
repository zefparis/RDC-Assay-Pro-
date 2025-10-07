import React from 'react';
import { motion } from 'framer-motion';
import { Search, FlaskConical, ShieldCheck, Truck, Microscope, FileCheck, QrCode } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Card from '@/components/ui/Card';

const Services: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Search,
      title: t.services.sampling.title,
      description: t.services.sampling.description,
      features: ['Grab sampling', 'Channel sampling', 'Core drilling', 'Chain of custody'],
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: FlaskConical,
      title: t.services.analysis.title,
      description: t.services.analysis.description,
      features: ['XRF Analysis', 'ICP-OES/MS', 'Fire Assay', 'Moisture & LOI'],
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      icon: ShieldCheck,
      title: t.services.certification.title,
      description: t.services.certification.description,
      features: ['Digital certificates', 'Hash verification', 'QR traceability', 'ISO compliance'],
      color: 'text-success-600',
      bgColor: 'bg-success-50',
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
            Solutions complètes d'analyse minière avec traçabilité numérique et certification internationale
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
              <Card hover padding="lg" className="h-full">
                <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6`}>
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
