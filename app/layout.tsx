import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aviation AI Modernization',
  description: 'Practical research and architecture for airline maintenance, enterprise AI, and AWS modernization.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
