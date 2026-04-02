# Performance Testing Quick Guide

## Prerequisites

Before running performance tests, ensure you have:

1. Development server running (`npm run dev`)
2. Chrome browser installed (for Lighthouse)
3. Node.js environment set up

## Quick Start

### 1. Run Basic Lighthouse Audit

```bash
# Start dev server (Terminal 1)
npm run dev

# Run audit (Terminal 2)
node scripts/lighthouse-audit.js
```

### 2. Test Different Network Conditions

```bash
# Slow 3G (400 Kbps, 300ms RTT)
node scripts/lighthouse-audit.js --network="Slow 3G"

# Fast 3G (1.6 Mbps, 150ms RTT)
node scripts/lighthouse-audit.js --network="Fast 3G"

# 4G (10 Mbps, 40ms RTT) - Default
node scripts/lighthouse-audit.js --network="4G"
```

### 3. Test Custom URL

```bash
# Test production URL
node scripts/lighthouse-audit.js --url=https://vitalicesf.com

# Test staging URL
node scripts/lighthouse-audit.js --url=https://staging.vitalicesf.com
```

## Understanding Results

### Lighthouse Scores

- **90-100**: Excellent ✅
- **50-89**: Needs improvement ⚠️
- **0-49**: Poor ❌

### Core Web Vitals Targets

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| FCP    | < 1.8s  | 1.8s - 3.0s       | > 3.0s  |
| LCP    | < 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| FID    | < 100ms | 100ms - 300ms     | > 300ms |
| CLS    | < 0.1   | 0.1 - 0.25        | > 0.25  |
| TTI    | < 3.8s  | 3.8s - 7.3s       | > 7.3s  |

## Reading the Report

### Console Output

```
📊 Auditing: Insights Listing
URL: http://localhost:3000/insights

Scores:
  Performance:     95/100 ✅
  Accessibility:   98/100 ✅
  Best Practices:  92/100 ✅
  SEO:             100/100 ✅

Core Web Vitals:
  First Contentful Paint: 1.2s ✅
  Largest Contentful Paint: 2.1s ✅
  Time to Interactive: 2.8s ✅
  Total Blocking Time: 150ms ✅
  Cumulative Layout Shift: 0.05 ✅
  Speed Index: 1.8s ✅

Diagnostics:
  Main Thread Work: 1.5s
  Bootup Time: 0.8s
  Unused JavaScript: 45KB
  Unused CSS: 12KB
  Image Optimization Savings: 0KB
```

### JSON Report

Full report saved to: `docs/reports/lighthouse-insights-report.json`

## Common Issues & Solutions

### Issue: Low Performance Score

**Possible Causes:**

- Large images not optimized
- Too much JavaScript
- Render-blocking resources
- Slow server response

**Solutions:**

1. Check image sizes and formats
2. Review bundle size with `npm run analyze`
3. Ensure code splitting is working
4. Verify ISR is configured

### Issue: High LCP

**Possible Causes:**

- Large cover images
- Images not preloaded
- Slow network

**Solutions:**

1. Optimize cover images (< 200KB)
2. Verify critical images are preloaded
3. Check image CDN performance
4. Use WebP format

### Issue: High CLS

**Possible Causes:**

- Images without dimensions
- Fonts causing layout shift
- Dynamic content insertion

**Solutions:**

1. Add width/height to all images
2. Verify `font-display: swap` is set
3. Reserve space for dynamic content
4. Use Next.js Image component

### Issue: Slow TTI

**Possible Causes:**

- Large JavaScript bundles
- Heavy client-side processing
- Too many third-party scripts

**Solutions:**

1. Implement code splitting
2. Use dynamic imports
3. Defer non-critical scripts
4. Optimize third-party scripts

## Manual Testing

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select categories to test
4. Choose device (Mobile/Desktop)
5. Click "Generate report"

### Network Throttling

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Select throttling profile:
   - Slow 3G
   - Fast 3G
   - No throttling
4. Reload page and observe loading

### Performance Monitor

1. Open Chrome DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Show Performance Monitor"
4. Monitor real-time metrics:
   - CPU usage
   - JS heap size
   - DOM nodes
   - JS event listeners
   - Layouts/sec

## Continuous Monitoring

### In Development

Performance metrics are logged to console:

```javascript
[Performance] { fcp: 1200, lcp: 2100, cls: 0.05 }
```

### In Production

Metrics are sent to Google Analytics:

- Event Category: "Performance"
- Event Label: Metric name (FCP, LCP, etc.)
- Value: Metric value in milliseconds

### Sentry Integration

Performance issues are tracked in Sentry:

- Slow transactions
- Long tasks
- Memory leaks
- Error rates

## Best Practices

### Before Testing

1. Clear browser cache
2. Close other tabs/applications
3. Use incognito mode
4. Test on stable network

### During Testing

1. Run multiple tests (3-5 times)
2. Take average of results
3. Test different pages
4. Test different network conditions

### After Testing

1. Document results
2. Compare with previous tests
3. Identify trends
4. Create action items

## Automated Testing

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/performance.yml
- name: Run Lighthouse CI
  run: |
    npm run build
    npm start &
    sleep 10
    node scripts/lighthouse-audit.js
```

### Scheduled Testing

Run weekly performance audits:

```bash
# Add to crontab
0 0 * * 0 cd /path/to/project && node scripts/lighthouse-audit.js
```

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

## Support

For issues or questions:

1. Check `PERFORMANCE_OPTIMIZATION.md` for detailed guide
2. Review `TASK_18_COMPLETION_SUMMARY.md` for implementation details
3. Check Sentry for production errors
4. Review Google Analytics for real-world metrics
