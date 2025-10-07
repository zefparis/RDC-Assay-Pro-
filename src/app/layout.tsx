import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RDC Assay Pro - Mineral Analysis & Certification Platform',
  description: 'Professional mineral assay and certification platform for DRC. Sampling, analysis, certification and digital traceability.',
  keywords: 'mineral analysis, assay, certification, DRC, mining, laboratory, traceability',
  authors: [{ name: 'RDC Assay Team' }],
  openGraph: {
    title: 'RDC Assay Pro',
    description: 'Professional mineral analysis & certification platform',
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
