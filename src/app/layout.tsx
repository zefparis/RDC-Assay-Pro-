import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GeoCert Africa — Filiale de SGS | Mineral Analysis & Certification',
  description: 'GeoCert Africa — Filiale de SGS. Sampling, analysis, certification and digital traceability for mining operations.',
  keywords: 'geocert africa, sgs, mineral analysis, assay, certification, mining, laboratory, traceability',
  authors: [{ name: 'GeoCert Africa' }],
  openGraph: {
    title: 'GeoCert Africa — Filiale de SGS',
    description: 'Mineral analysis & certification platform',
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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const d = document.documentElement; let t = localStorage.getItem('rdc-theme'); if (!t) { t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; } if (t === 'dark') d.classList.add('dark'); else d.classList.remove('dark'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
