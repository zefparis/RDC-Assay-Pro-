import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@rdcassay.africa' },
    { icon: Phone, label: 'Phone', value: '+243 123 456 789' },
    { icon: MapPin, label: 'Address', value: 'Kinshasa, RDC' },
  ];

  const socialLinks = [
    { icon: Globe, label: 'Website', href: 'https://rdcassay.africa' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/rdcassay' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/rdcassay' },
  ];

  const services = [
    'Échantillonnage minier',
    'Analyses laboratoire',
    'Certification digitale',
    'Traçabilité QR',
  ];

  const apiEndpoints = [
    'GET /api/samples',
    'POST /api/samples',
    'GET /api/reports',
    'GET /api/dashboard',
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white grid place-items-center font-bold text-lg">
                R
              </div>
              <span className="font-bold text-xl">RDC Assay</span>
            </div>
            <p className="text-secondary-300 mb-6 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-secondary-700 flex items-center justify-center transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-6">{t.footer.contact}</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact) => (
                <li key={contact.label} className="flex items-center gap-3">
                  <contact.icon className="w-4 h-4 text-primary-400" />
                  <div>
                    <div className="text-xs text-secondary-400">{contact.label}</div>
                    <div className="text-secondary-300">{contact.value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* API Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-6">{t.footer.api}</h3>
            <div className="space-y-3">
              <div className="text-sm text-secondary-300 mb-3">
                Base URL: <code className="bg-secondary-800 px-2 py-1 rounded text-xs">
                  https://api.rdcassay.africa
                </code>
              </div>
              <ul className="space-y-2">
                {apiEndpoints.map((endpoint) => (
                  <li key={endpoint}>
                    <code className="text-xs bg-secondary-800 px-2 py-1 rounded text-secondary-300">
                      {endpoint}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-secondary-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm text-secondary-400">
            © 2025 RDC Assay. Tous droits réservés.
          </div>
          <div className="flex gap-6 text-sm text-secondary-400">
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
