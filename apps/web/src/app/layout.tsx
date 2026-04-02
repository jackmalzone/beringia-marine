import { Bebas_Neue, Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import NavigationLoadingProvider from '@/components/providers/NavigationLoadingProvider';
import { ModalProvider } from '@/components/providers/ModalProvider';
import PageErrorBoundary from '@/components/providers/PageErrorBoundary';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import FooterLinks from '@/components/layout/Footer/FooterLinks';
import NavigationLinks from '@/components/layout/Navigation/NavigationLinks';
import VisibleNavigation from '@/components/layout/Navigation/VisibleNavigation';
import StructuredData from '@/components/seo/StructuredData';
import SSRBodyBlock from '@/components/seo/SSRBodyBlock';
import AnalyticsBoot from '@/components/providers/AnalyticsBoot';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';
import DeferredAnalytics from '@/components/providers/DeferredAnalytics';
import { getAnalyticsConfig } from '@/lib/analytics/config';
import { getGlobalSettings } from '@/lib/sanity/queries';
import { getCriticalCSSContent } from '@/lib/performance/criticalCSS';
import { getPageSchema } from '@/lib/seo/structured-data';
import { mergeMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/lib/config/site-config';
import { headers } from 'next/headers';
import FontPresetToggle from '@/components/dev/FontPresetToggle';
import LoadingScreen from '@/components/shared/LoadingScreen/LoadingScreen';
import './globals.css';

const FONT_PRESET_BOOT_SCRIPT = `(function(){try{var k='beringia-font-preset';if(localStorage.getItem(k)==='legacy')document.documentElement.setAttribute('data-font-preset','legacy');}catch(e){}})();`;

/** Home hero H1 — guaranteed load even if self-hosted `/fonts/BebasNeue*` is missing */
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-home-hero-bebas',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata = mergeMetadata('home');

// Skip static prerender so build succeeds (layout uses store/context in Header, etc.)
export const dynamic = 'force-dynamic';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: SITE_CONFIG.themeColor,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Generate critical CSS for server-side rendering only
  // This uses fs.readFileSync which only works on the server
  const criticalCSS = typeof window === 'undefined' ? getCriticalCSSContent() : '';
  const globalSettings = await getGlobalSettings();
  const analyticsConfig = getAnalyticsConfig(globalSettings);
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const renderChildrenOutsideClientShell = /^\/insights\/[^/]+$/i.test(normalizedPath);

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Deferred to improve initial page load performance */}
        {/* GTM now loads via DeferredAnalytics component after page load */}

        <script
          id="font-preset-boot"
          dangerouslySetInnerHTML={{ __html: FONT_PRESET_BOOT_SCRIPT }}
        />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload critical assets (same-origin defaults — swap paths when you add production media) */}
        {/* Preload critical fonts - prioritize above-the-fold fonts */}
        {/* TODO(assets): add Domitian font binaries under public/fonts and preload here when available. */}
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch and preconnect for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect for critical third-party services */}
        <link rel="dns-prefetch" href="//o4509843732496384.ingest.us.sentry.io" />
        <link rel="preconnect" href="https://o4509843732496384.ingest.us.sentry.io" crossOrigin="anonymous" />

        {/* Critical CSS - Inline above-the-fold styles */}
        {criticalCSS && (
          <style
            id="critical-css"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: criticalCSS }}
          />
        )}

        {/* Structured Data */}
        <StructuredData data={getPageSchema('home')} />
      </head>
      <body className={`${bebasNeue.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <LoadingScreen />
        {/* Crawler-visible SSR block (literal HTML) for fetch-based SEO checks */}
        <SSRBodyBlock />
        <FontPresetToggle />
        {analyticsConfig.enabled && !analyticsConfig.consentRequired && analyticsConfig.gtmId && (
          <>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(analyticsConfig.gtmId)}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
          </>
        )}

        {analyticsConfig.enabled && !analyticsConfig.consentRequired && analyticsConfig.metaPixelId && (
          <>
            {/* Meta Pixel (noscript) */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${encodeURIComponent(analyticsConfig.metaPixelId)}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            {/* End Meta Pixel (noscript) */}
          </>
        )}

        {renderChildrenOutsideClientShell ? (
          <>
            {/* Header/nav shell stays client-enhanced, but page body renders directly for HTML-first SSR. */}
            <PerformanceProvider>
              <NavigationLoadingProvider>
                <SmoothScrollProvider>
                  <ModalProvider>
                    <AnalyticsBoot analyticsConfig={analyticsConfig} />
                    <NavigationLinks />
                    <VisibleNavigation />
                    <Header />
                  </ModalProvider>
                </SmoothScrollProvider>
              </NavigationLoadingProvider>
            </PerformanceProvider>
            {children}
            <PerformanceProvider>
              <NavigationLoadingProvider>
                <SmoothScrollProvider>
                  <ModalProvider>
                    <FooterLinks />
                    <Footer />
                    <DeferredAnalytics analyticsConfig={analyticsConfig} />
                  </ModalProvider>
                </SmoothScrollProvider>
              </NavigationLoadingProvider>
            </PerformanceProvider>
          </>
        ) : (
          <PerformanceProvider>
            <NavigationLoadingProvider>
              <SmoothScrollProvider>
                <ModalProvider>
                  <AnalyticsBoot analyticsConfig={analyticsConfig} />
                  <NavigationLinks />
                  <VisibleNavigation />
                  <Header />
                  <PageErrorBoundary pageName="layout">{children}</PageErrorBoundary>
                  <FooterLinks />
                  <Footer />
                  <DeferredAnalytics analyticsConfig={analyticsConfig} />
                </ModalProvider>
              </SmoothScrollProvider>
            </NavigationLoadingProvider>
          </PerformanceProvider>
        )}
        <Analytics />
      </body>
    </html>
  );
}
