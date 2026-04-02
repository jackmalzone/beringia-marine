import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { VITAL_ICE_BUSINESS } from '@/lib/config/business-info';
import PageSchema from '@/components/seo/PageSchema';
import ServerSideSEO from '@/components/seo/ServerSideSEO';

// Dynamic import with SSR disabled to prevent mobile hydration issues with widgets
const ContactPageClient = dynamic(() => import('./ContactPageClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
      }}
    >
      <div>Loading contact information...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: `Contact Vital Ice | San Francisco Wellness Center`,
  description: `Contact Vital Ice in San Francisco's Marina District. Visit us at 2400 Chestnut St for cold plunge, sauna, and recovery services. Book your session today.`,
  keywords: [
    'contact vital ice san francisco',
    'cold plunge therapy marina district',
    'infrared sauna contact san francisco',
    'wellness center 2400 chestnut street',
    'recovery center marina district',
    'vital ice location hours phone',
    'san francisco wellness contact',
    'cold therapy contact sf',
    'sauna therapy marina district',
    'wellness services contact sf',
    'recovery treatments san francisco',
    'vital ice directions parking',
  ],
  openGraph: {
    title: `Contact Vital Ice | San Francisco Wellness Center`,
    description: `Contact Vital Ice in San Francisco's Marina District. Visit us at 2400 Chestnut St for cold plunge, sauna, and recovery services.`,
    type: 'website',
    locale: 'en_US',
    siteName: VITAL_ICE_BUSINESS.name,
    url: `${VITAL_ICE_BUSINESS.website}/contact`,
    images: [
      {
        url: 'https://media.vitalicesf.com/seo/contact-page-og.jpg',
        width: 1200,
        height: 630,
        alt: `Contact ${VITAL_ICE_BUSINESS.name} - Wellness Center in Marina District, San Francisco`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact Vital Ice | San Francisco Wellness Center`,
    description: `Contact Vital Ice in San Francisco's Marina District. Visit us at 2400 Chestnut St for cold plunge, sauna, and recovery services.`,
    images: ['https://media.vitalicesf.com/seo/contact-page-og.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
  other: {
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': `${VITAL_ICE_BUSINESS.coordinates.latitude};${VITAL_ICE_BUSINESS.coordinates.longitude}`,
    ICBM: `${VITAL_ICE_BUSINESS.coordinates.latitude}, ${VITAL_ICE_BUSINESS.coordinates.longitude}`,
  },
};

// Enable static generation with ISR for better SEO
export const revalidate = 3600; // Revalidate every hour

export default function ContactPage() {
  return (
    <>
      <ServerSideSEO pageKey="contact" />
      <PageSchema pageKey="contact" />
      <ContactPageClient />
    </>
  );
}
