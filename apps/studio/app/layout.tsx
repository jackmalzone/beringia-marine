import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vital Ice CMS',
  description: 'Content Management System for Vital Ice',
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
