import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../app/globals.css';
import { cn } from '../lib/utils';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'jrdriving - Convoyage de véhicules',
  description:
    'Solution SaaS de convoyage automobile pour les professionnels et particuliers : devis, missions et suivi en temps réel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={cn('min-h-screen bg-gray-50 font-sans text-slate-900', inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
