/**
 * Critical CSS component for inlining above-the-fold styles
 * This component should be placed in the HTML head for optimal performance
 */

import { getCriticalCSS, minifyCSS } from '@/lib/performance/criticalCSS';

interface CriticalCSSProps {
  minify?: boolean;
}

export default function CriticalCSS({ minify = true }: CriticalCSSProps) {
  const criticalCSS = getCriticalCSS();

  if (!criticalCSS) {
    return null;
  }

  const css =
    minify && process.env.NODE_ENV === 'production' ? minifyCSS(criticalCSS) : criticalCSS;

  return <style id="critical-css" dangerouslySetInnerHTML={{ __html: css }} />;
}
