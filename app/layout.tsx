import type { Metadata } from 'next';
import './globals.css';
import './archive-overrides.css';
import './publication-system.css';
import './publication-system-fixes.css';
import './publication-risk.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://northboundlabs.ai'),
  title: {
    default: 'Northbound Labs',
    template: '%s | Northbound Labs'
  },
  description: 'Independent research on aviation maintenance, MRO modernization, applied AI, aircraft systems, reliability engineering, and cloud architecture.',
  keywords: ['aviation maintenance', 'MRO modernization', 'aircraft maintenance AI', 'ATA chapters', 'reliability engineering', 'aircraft telemetry', 'AWS aviation architecture'],
  openGraph: {
    title: 'Northbound Labs',
    description: 'Aviation maintenance, MRO modernization, applied AI, aircraft systems, and cloud architecture.',
    url: 'https://northboundlabs.ai',
    siteName: 'Northbound Labs',
    type: 'website'
  },
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
