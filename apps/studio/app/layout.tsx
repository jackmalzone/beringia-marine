import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beringia Marine CMS',
  description: 'Content management for Beringia Marine — insights, partners, and site settings.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
