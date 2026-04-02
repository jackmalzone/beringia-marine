# Insights Blog System - Testing Quick Reference

Quick reference guide for testing the Insights Blog System.

## Quick Start

```bash
# 1. Run automated validation
node scripts/validate-insights-integration.js

# 2. Run integration tests
npm test -- src/components/insights/__tests__/integration.test.tsx

# 3. Run Lighthouse audit (requires dev server running)
npm run dev  # In one terminal
node scripts/lighthouse-audit.js  # In another terminal
```

## Automated Testing

### Validation Script

```bash
# Run full validation
node scripts/validate-insights-integration.js

# Output: 65 checks covering all features
# Expected: 96.9% success rate (63/65 passed)
```

### Integration Tests

```bash
# Run all integration tests
npm test -- src/components/insights/__tests__/integration.test.tsx

# Run specific test suite
npm test -- src/components/insights/__tests__/integration.test.tsx -t "Complete User Flow"

# Run with coverage
npm test -- src/components/insights/__tests__/integration.test.tsx --coverage
```

### Component Tests

```bash
# Run all insights component tests
npm test -- src/components/insights

# Run specific component tests
npm test -- src/components/insights/ArticleCard
npm test -- src/components/insights/CategoryFilter
npm test -- src/components/insights/SearchBar
```

### Data Layer Tests

```bash
# Run data layer tests
npm test -- src/lib/data/__tests__/insights.test.ts
```

## Performance Testing

### Lighthouse Audit

```bash
# Start dev server first
npm run dev

# Run Lighthouse (in another terminal)
node scripts/lighthouse-audit.js

# Test with specific network profile
node scripts/lighthouse-audit.js --network="Slow 3G"
node scripts/lighthouse-audit.js --network="Fast 3G"
node scripts/lighthouse-audit.js --network="4G"

# Test specific URL
node scripts/lighthouse-audit.js --url=http://localhost:3000/insights
```

### Performance Targets

- Performance Score: > 90
- Accessibility Score: > 90
- Best Practices Score: > 90
- SEO Score: > 90

## Manual Testing

### Quick Smoke Test (5 minutes)

1. Navigate to `/insights`
2. Click a category filter
3. Type in search bar
4. Click an article card
5. Click "Back to Insights"
6. Test on mobile viewport

### Full Manual Test (30 minutes)

See `docs/insights/TASK_22_INTEGRATION_TESTING.md` for complete checklist.

## Accessibility Testing

### Automated

```bash
# Run accessibility tests
npm test -- src/components/insights/__tests__/integration.test.tsx -t "Accessibility"
```

### Manual (Screen Reader)

```bash
# macOS - VoiceOver
Cmd + F5  # Enable VoiceOver
# Navigate with VO + arrow keys

# Windows - NVDA
# Download and install NVDA
# Navigate with arrow keys
```

### Keyboard Navigation Test

1. Press Tab to navigate
2. Press Enter/Space to activate
3. Verify focus indicators visible
4. Verify logical tab order

## SEO Testing

### Metadata Verification

```bash
# View page source
# Check for:
# - <title> tag
# - <meta name="description">
# - Open Graph tags (og:*)
# - Twitter Card tags (twitter:*)
# - JSON-LD structured data
```

### Social Media Preview

```bash
# Facebook Debugger
https://developers.facebook.com/tools/debug/

# Twitter Card Validator
https://cards-dev.twitter.com/validator

# LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/
```

## Error Testing

### 404 Testing

```bash
# Navigate to non-existent article
http://localhost:3000/insights/non-existent-slug

# Verify:
# - Custom 404 page displays
# - "Back to Insights" link works
```

### Network Error Testing

```bash
# In DevTools:
# 1. Open Network tab
# 2. Set throttling to "Offline"
# 3. Try to load page
# 4. Verify error message
# 5. Restore network
# 6. Verify retry works
```

## Responsive Testing

### Browser DevTools

```bash
# Chrome DevTools
Cmd/Ctrl + Shift + M  # Toggle device toolbar

# Test viewports:
# - Mobile: 375px (iPhone)
# - Tablet: 768px (iPad)
# - Desktop: 1920px
```

### Real Devices

- Test on actual mobile device
- Test on actual tablet
- Test landscape and portrait

## Cross-Browser Testing

### Browsers to Test

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Continuous Integration

### GitHub Actions (if configured)

```yaml
# .github/workflows/test.yml
- name: Run Insights Tests
  run: npm test -- src/components/insights

- name: Run Validation
  run: node scripts/validate-insights-integration.js
```

## Test Reports

### Generated Reports

```bash
# Validation report
docs/reports/insights-integration-report.json

# Lighthouse report
docs/reports/lighthouse-insights-report.json

# Test coverage report
coverage/lcov-report/index.html
```

### View Reports

```bash
# Open coverage report
open coverage/lcov-report/index.html

# View JSON reports
cat docs/reports/insights-integration-report.json | jq
cat docs/reports/lighthouse-insights-report.json | jq
```

## Troubleshooting

### Tests Failing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Jest cache
npm test -- --clearCache

# Run tests in watch mode for debugging
npm test -- src/components/insights/__tests__/integration.test.tsx --watch
```

### Lighthouse Failing

```bash
# Ensure dev server is running
npm run dev

# Check port is correct (default 3000)
node scripts/lighthouse-audit.js --url=http://localhost:3000

# Try different network profile
node scripts/lighthouse-audit.js --network="4G"
```

### Validation Script Issues

```bash
# Make script executable
chmod +x scripts/validate-insights-integration.js

# Run with node directly
node scripts/validate-insights-integration.js

# Check Node version (requires Node 16+)
node --version
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All automated tests passing
- [ ] Validation script shows > 95% success
- [ ] Lighthouse scores all > 90
- [ ] Manual smoke test completed
- [ ] Accessibility verified
- [ ] SEO metadata verified
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Error handling verified
- [ ] Performance targets met

## Quick Commands Reference

```bash
# Run everything
npm test && node scripts/validate-insights-integration.js

# Watch mode for development
npm test -- --watch src/components/insights

# Run specific test file
npm test -- src/components/insights/ArticleCard/__tests__/ArticleCard.test.tsx

# Run with coverage
npm test -- --coverage src/components/insights

# Update snapshots (if using)
npm test -- -u

# Run in CI mode
CI=true npm test
```

## Resources

- **Full Testing Guide:** `docs/insights/TASK_22_INTEGRATION_TESTING.md`
- **Completion Summary:** `docs/insights/TASK_22_COMPLETION_SUMMARY.md`
- **Performance Guide:** `src/app/insights/PERFORMANCE_TESTING_GUIDE.md`
- **SEO Implementation:** `src/app/insights/SEO_IMPLEMENTATION.md`
- **Content Guide:** `docs/insights/CONTENT_FORMATTING_GUIDE.md`

## Support

For issues or questions:

1. Check troubleshooting section above
2. Review test output for specific errors
3. Check browser console for runtime errors
4. Review validation report for failed checks
5. Consult full testing documentation

---

**Last Updated:** 2025-11-20  
**Version:** 1.0.0
