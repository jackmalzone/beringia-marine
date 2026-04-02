# Insights Blog System - Performance Optimization

## Overview

This document outlines the performance optimizations implemented for the Insights blog system to achieve Lighthouse scores > 90 and optimal Core Web Vitals.

## Implemented Optimizations

### 1. Image Optimization

#### Next.js Image Component

- **Implementation**: Replaced `<img>` tags with Next.js `<Image>` component
- **Benefits**:
  - Automatic WebP/AVIF format conversion
  - Responsive image sizing with `srcset`
  - Lazy loading for below-the-fold images
  - Blur placeholder for better perceived performance
  - Automatic image optimization and compression

#### Configuration

```typescript
// ArticleCard.tsx
<Image
  src={article.coverImage}
  alt={article.title}
  width={600}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

#### Remote Image Patterns

```typescript
// next.config.ts
images: {
  formats: ['image/webp', 'image/avif'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'media.vitalicesf.com',
      pathname: '/**',
    },
  ],
}
```

### 2. Code Splitting

#### Dynamic Imports

- **Implementation**: Used `next/dynamic` for client components
- **Benefits**:
  - Reduced initial bundle size
  - Faster Time to Interactive (TTI)
  - Better code organization

```typescript
// page.tsx
const InsightsPageClient = dynamic(() => import('./InsightsPageClient'), {
  loading: () => <div>Loading insights...</div>,
  ssr: true,
});
```

#### Package Optimization

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['framer-motion', 'react-icons'],
}
```

### 3. Incremental Static Regeneration (ISR)

#### Configuration

```typescript
// page.tsx
export const revalidate = 3600; // Revalidate every hour
```

#### Benefits

- Static generation for fast initial load
- Automatic updates without full rebuild
- Reduced server load
- Better caching strategy

### 4. Font Optimization

#### Font Display Strategy

```css
/* fonts.css */
@font-face {
  font-family: 'Bebas Neue';
  font-display: swap; /* Prevents layout shift */
  src: url('/fonts/BebasNeue-Regular.woff2') format('woff2');
}
```

#### Benefits

- Prevents FOIT (Flash of Invisible Text)
- Reduces Cumulative Layout Shift (CLS)
- Faster First Contentful Paint (FCP)

### 5. Prefetching

#### Link Prefetching

```typescript
// ArticleCard.tsx
<Link href={`/insights/${article.slug}`} prefetch={true}>
  {/* Card content */}
</Link>
```

#### Critical Image Preloading

```typescript
// InsightsPageClient.tsx
const criticalImages = data.slice(0, 3).map(article => article.coverImage);
preloadCriticalImages(criticalImages);
```

### 6. Performance Monitoring

#### Web Vitals Tracking

```typescript
// insights-performance.ts
measureWebVitals(reportMetric);
```

#### Tracked Metrics

- **FCP** (First Contentful Paint): Target < 1.8s
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1
- **TTI** (Time to Interactive): Target < 3.5s
- **Hydration Time**: Target < 500ms

#### Hydration Monitoring

```typescript
useEffect(() => {
  const endHydration = measureHydrationTime('InsightsPageClient');
  endHydration();
}, []);
```

### 7. Caching Strategy

#### Static Assets

```typescript
// next.config.ts
headers: [
  {
    source: '/images/:path*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
  {
    source: '/fonts/:path*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
];
```

#### Page Caching

```typescript
{
  source: '/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }
  ],
}
```

### 8. Compression

#### Enabled Compression

```typescript
// next.config.ts
compress: true, // Enables gzip compression
```

### 9. CSS Optimization

#### Experimental CSS Optimization

```typescript
// next.config.ts
experimental: {
  optimizeCss: true,
}
```

### 10. Reduced Motion Support

#### Accessibility-First Animations

```typescript
const { shouldReduceMotion } = useAccessibleMotion();

<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0 }}
  animate={shouldReduceMotion ? false : { opacity: 1 }}
/>
```

## Performance Testing

### Lighthouse Audit Script

Run performance audits:

```bash
# Start development server
npm run dev

# Run Lighthouse audit (in another terminal)
node scripts/lighthouse-audit.js

# Test with different network profiles
node scripts/lighthouse-audit.js --network="Slow 3G"
node scripts/lighthouse-audit.js --network="Fast 3G"
node scripts/lighthouse-audit.js --network="4G"
```

### Performance Targets

| Metric               | Target  | Current |
| -------------------- | ------- | ------- |
| Performance Score    | > 90    | TBD     |
| Accessibility Score  | > 90    | TBD     |
| Best Practices Score | > 90    | TBD     |
| SEO Score            | > 90    | TBD     |
| FCP                  | < 1.8s  | TBD     |
| LCP                  | < 2.5s  | TBD     |
| TTI                  | < 3.5s  | TBD     |
| TBT                  | < 300ms | TBD     |
| CLS                  | < 0.1   | TBD     |

### Network Throttling Tests

Test performance across different network conditions:

- **Slow 3G**: 400 Kbps, 300ms RTT
- **Fast 3G**: 1.6 Mbps, 150ms RTT
- **4G**: 10 Mbps, 40ms RTT

## Monitoring in Production

### Analytics Integration

Performance metrics are automatically sent to Google Analytics:

```typescript
window.gtag('event', 'web_vitals', {
  event_category: 'Performance',
  event_label: 'FCP',
  value: Math.round(fcpValue),
});
```

### Sentry Performance Monitoring

Errors and performance issues are tracked via Sentry:

```typescript
reportError(error, {
  category: ErrorCategory.NETWORK,
  severity: ErrorSeverity.LOW,
  component: 'ArticleCard',
});
```

## Best Practices

### Image Guidelines

1. Use WebP format with JPEG fallback
2. Optimize images before upload (target: < 200KB)
3. Use appropriate dimensions (cover images: 1200x630px)
4. Always include descriptive alt text
5. Use lazy loading for below-the-fold images

### Code Guidelines

1. Use dynamic imports for large components
2. Minimize client-side JavaScript
3. Prefer server components when possible
4. Use ISR for frequently updated content
5. Implement proper error boundaries

### Performance Checklist

- [ ] Images optimized and using Next.js Image component
- [ ] Fonts using `font-display: swap`
- [ ] Critical resources preloaded
- [ ] Code splitting implemented
- [ ] ISR configured with appropriate revalidation
- [ ] Caching headers configured
- [ ] Compression enabled
- [ ] Performance monitoring active
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals meet targets

## Troubleshooting

### Slow LCP

- Check image sizes and optimization
- Verify critical images are preloaded
- Review server response times
- Check for render-blocking resources

### High CLS

- Ensure images have width/height attributes
- Use `font-display: swap` for fonts
- Reserve space for dynamic content
- Avoid inserting content above existing content

### Slow TTI

- Reduce JavaScript bundle size
- Implement code splitting
- Defer non-critical JavaScript
- Optimize third-party scripts

### High TBT

- Break up long tasks
- Use web workers for heavy computation
- Optimize JavaScript execution
- Reduce main thread work

## Future Optimizations

### Planned Improvements

1. **Service Worker**: Implement offline support and caching
2. **HTTP/3**: Enable QUIC protocol for faster connections
3. **Edge Caching**: Use Vercel Edge Network for global distribution
4. **Image CDN**: Migrate to dedicated image CDN
5. **Bundle Analysis**: Regular bundle size monitoring
6. **Performance Budget**: Set and enforce performance budgets

### Experimental Features

1. **React Server Components**: Migrate more components to RSC
2. **Streaming SSR**: Implement progressive rendering
3. **Partial Hydration**: Hydrate only interactive components
4. **Priority Hints**: Use `fetchpriority` for critical resources

## Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
