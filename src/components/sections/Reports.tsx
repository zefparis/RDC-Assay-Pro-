import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Filter, FileText, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import { Report } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredReports = useMemo(() => {
    if (!filterQuery) return reports;
    
    const query = filterQuery.toLowerCase();
    return reports.filter(report => 
      report.id.toLowerCase().includes(query) ||
      report.site.toLowerCase().includes(query) ||
      report.mineral.toLowerCase().includes(query)
    );
  }, [reports, filterQuery]);

  // Supprimer le chargement automatique
  // useEffect(() => {
  //   loadReports();
  // }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.getReports();
      setReports(response.data);
    } catch (err: any) {
      if (err.message?.includes('Access token required') || err.message?.includes('401')) {
        console.log('User not authenticated - reports not loaded');
      } else {
        console.error('Failed to load reports:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (report: Report) => {
    // In a real app, this would trigger the actual download
    window.open(report.url, '_blank');
  };

  return (
    <section id="reports" className="py-20 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card padding="lg" className="shadow-strong">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-success-600" />
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {t.reports.title}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {t.reports.subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Input
                placeholder={t.reports.filter}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                leftIcon={<Filter className="w-4 h-4" />}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredReports.length} {t.reports.results}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadReports}
                  loading={loading}
                  icon={<FileText className="w-4 h-4" />}
                >
                  Charger
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
                    {[
                      t.reports.id,
                      t.reports.site,
                      t.reports.mineral,
                      t.reports.grade,
                      t.reports.certificate,
                      t.reports.hash,
                    ].map((header) => (
                      <th key={header} className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-secondary-500 dark:text-secondary-400">
                        {t.reports.loading}
                      </td>
                    </tr>
                  )}
                  
                  {!loading && filteredReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <code className="font-mono font-semibold text-secondary-900 dark:text-secondary-100">
                          {report.id}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-secondary-700 dark:text-secondary-300">
                        {report.site}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="info" size="sm">
                          {report.mineral}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-medium text-secondary-900 dark:text-secondary-100">
                        {report.grade} {report.unit}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report)}
                          icon={<Download className="w-4 h-4" />}
                          className="text-accent-700 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
                        >
                          {t.reports.download}
                        </Button>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
                          {report.hash}
                        </code>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {!loading && filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-secondary-500 dark:text-secondary-400">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
                          {t.reports.noReports}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Certificate Features */}
            <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-800">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                  <ShieldCheck className="w-4 h-4 text-success-600" />
                  <span>Digital signatures</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                  <FileText className="w-4 h-4 text-primary-600" />
                  <span>SHA-256 hashing</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                  <Download className="w-4 h-4 text-secondary-600" />
                  <span>ISO compliance</span>
                </div>
              </div>
            </div>

            {/* FILAB Partnership Info */}
            <div className="mt-8 p-6 rounded-lg bg-secondary-100/60 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    Analyses réalisées avec notre partenaire FILAB
                  </h3>
                  <p className="mt-1 text-secondary-700 dark:text-secondary-300 max-w-3xl">
                    Pour garantir la qualité et la fiabilité de nos rapports et certificats, nous réalisons nos
                    analyses et caractérisations des matériaux en collaboration avec <span className="font-medium">FILAB</span>,
                    laboratoire privé de référence en France. Cette collaboration nous permet d’offrir des résultats
                    précis, traçables et conformes aux meilleures pratiques du secteur.
                  </p>
                </div>
                <div className="shrink-0">
                  <a
                    href="https://filab.fr/nos-prestations/analyse/laboratoire-caracterisation-des-materiaux/?gad_source=1&gad_campaignid=21888980324&gbraid=0AAAAADpoRnHJr6cn4nZhkd3nVDh-z0Qdv&gclid=Cj0KCQjw3aLHBhDTARIsAIRij582R3jJdTvI0J7AyuzepdC8u5FQxn_yb7pnw8ThhiDYFIzVNngSmwEaAhNuEALw_wcB"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>Voir le laboratoire FILAB</Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Reports;
