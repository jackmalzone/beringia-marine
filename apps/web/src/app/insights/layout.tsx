export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * Insights section layout
 * Using native browser scrolling for optimal performance
 */

interface InsightsLayoutProps {
  children: React.ReactNode;
}

export default function InsightsLayout({ children }: InsightsLayoutProps) {
  return <>{children}</>;
}
