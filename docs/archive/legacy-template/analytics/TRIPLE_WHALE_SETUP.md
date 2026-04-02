# Triple Whale Setup Guide

## Overview

Triple Whale is an e-commerce analytics platform that helps track ad performance, revenue attribution, and customer behavior across marketing channels. This guide outlines the setup process for integrating Triple Whale tracking into the Vital Ice website.

## Prerequisites

- Triple Whale account created
- Triple Whale tracking codes/scripts obtained from Triple Whale dashboard
- Access to website deployment configuration

## Setup Steps

### 1. Obtain Tracking Codes

1. Log in to your Triple Whale dashboard
2. Navigate to **Settings** → **Tracking Setup** or **Integrations**
3. Copy the tracking script/code provided
4. Note any specific configuration options or customizations needed

### 2. Implementation Location

Tracking code should be added to the analytics loading component:

**File**: `apps/web/src/components/providers/DeferredAnalytics.tsx`

This component loads analytics scripts after page load for optimal performance.

### 3. Implementation Options

#### Option A: Standard Script Tag

If Triple Whale provides a standard script tag:

```typescript
// In DeferredAnalytics.tsx
useEffect(() => {
  const loadAnalytics = () => {
    // ... existing analytics code ...

    // Load Triple Whale
    const tripleWhaleScript = document.createElement('script');
    tripleWhaleScript.src = 'YOUR_TRIPLE_WHALE_SCRIPT_URL';
    tripleWhaleScript.async = true;
    document.head.appendChild(tripleWhaleScript);
  };

  // ... rest of loadAnalytics logic ...
}, []);
```

#### Option B: Next.js Script Component

For better optimization with Next.js:

```typescript
// In DeferredAnalytics.tsx or layout.tsx
import Script from 'next/script';

<Script
  id="triple-whale"
  strategy="afterInteractive"
  src="YOUR_TRIPLE_WHALE_SCRIPT_URL"
/>
```

#### Option C: Custom Configuration

If Triple Whale requires custom initialization:

```typescript
// In DeferredAnalytics.tsx
useEffect(() => {
  const loadAnalytics = () => {
    // ... existing analytics code ...

    // Triple Whale initialization
    if (typeof window !== 'undefined' && !window.tripleWhale) {
      window.tripleWhale = function () {
        (window.tripleWhale.q = window.tripleWhale.q || []).push(arguments);
      };

      // Load script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'YOUR_TRIPLE_WHALE_SCRIPT_URL';
      document.head.appendChild(script);

      // Initialize
      window.tripleWhale('init', {
        // Configuration options from Triple Whale dashboard
      });
    }
  };

  // ... rest of loadAnalytics logic ...
}, []);
```

### 4. Event Tracking (If Applicable)

If Triple Whale supports custom event tracking, add tracking functions:

```typescript
// In a new file: apps/web/src/lib/utils/tripleWhale.ts

export function trackTripleWhaleEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !window.tripleWhale) {
    return;
  }

  try {
    window.tripleWhale('track', eventName, properties);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Triple Whale tracking error:', error);
    }
  }
}
```

### 5. Environment Variables (If Needed)

If Triple Whale requires API keys or IDs:

1. Add to `.env.local`:

   ```
   NEXT_PUBLIC_TRIPLE_WHALE_ID=your_id_here
   ```

2. Use in code:
   ```typescript
   const tripleWhaleId = process.env.NEXT_PUBLIC_TRIPLE_WHALE_ID;
   ```

## Configuration Checklist

- [ ] Triple Whale account created
- [ ] Tracking codes obtained from dashboard
- [ ] Script added to `DeferredAnalytics.tsx`
- [ ] Tested in development environment
- [ ] Verified tracking in Triple Whale dashboard
- [ ] Tested in production environment
- [ ] Events configured (if applicable)

## Testing

1. **Development Testing**:
   - Add tracking code
   - Open browser DevTools → Network tab
   - Verify Triple Whale script loads
   - Check for any console errors

2. **Dashboard Verification**:
   - Log in to Triple Whale dashboard
   - Check if events/data are being received
   - Verify tracking is working correctly

3. **Production Testing**:
   - Deploy to production
   - Test on production website
   - Verify events in Triple Whale dashboard

## Common Issues

### Script Not Loading

- Check if script URL is correct
- Verify no Content Security Policy (CSP) blocking the script
- Check browser console for errors

### Events Not Tracking

- Verify initialization code is correct
- Check if events are configured in Triple Whale dashboard
- Ensure tracking functions are called at appropriate times

### Performance Impact

- Ensure script loads after page interactive (use `afterInteractive` strategy)
- Consider lazy loading for non-critical tracking
- Monitor Core Web Vitals to ensure no degradation

## Resources

- [Triple Whale Documentation](https://docs.triplewhale.com)
- [Triple Whale Support](https://triplewhale.com/support)

## Notes

- Tracking codes are pending from the user
- Implementation should follow the same pattern as Meta Pixel and GTM
- Deferred loading is important for performance

## Next Steps

1. **Wait for tracking codes** from Triple Whale dashboard
2. **Implement tracking script** in `DeferredAnalytics.tsx`
3. **Test thoroughly** in development
4. **Deploy to production** and verify
5. **Monitor dashboard** for data collection
