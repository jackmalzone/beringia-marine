# Meta Pixel Conversion Tracking Setup Guide

## Current Implementation Status

### Pixel Initialization

- **Pixel ID Source**: `globalSettings.analyticsSettings.facebookPixelId` (Sanity) with env fallback
- **Initialization Location**: `apps/web/src/components/providers/AnalyticsBoot.tsx`
- **Status**: ✅ Initialized on first client render when analytics is enabled
- **Automatic Events**: `PageView` is owned by route tracking in `MetaPageViewTracker.tsx`

### Currently Tracked Events

- ✅ **PageView** - Automatic on all pages
- ✅ **ViewContent** - Service pages (tracked in `ExperiencePageClient.tsx`)
- ✅ **InitiateCheckout** - Booking button clicks (tracked in `BookPageClient.tsx`)
- ✅ **Contact** - Phone/email clicks
- ✅ **Lead** - Contact form submissions (tracked via MutationObserver in `ContactPageClient.tsx`)

### Missing Conversion Events

- ❌ **Purchase** - Not automatically tracked (bookings via Mindbody widget)
- ❌ **Schedule** - Not automatically tracked (bookings via Mindbody widget)
- ❌ **CompleteRegistration** - Not tracked for membership signups

## Issue: Zero Conversions

### Root Cause Analysis

1. **Bookings happen through Mindbody widgets** - The booking flow uses embedded Mindbody widgets that don't expose success callbacks to our code
2. **No booking confirmation page** - There's no dedicated success/confirmation page where we can fire conversion events
3. **No API endpoint for booking completion** - Bookings are handled entirely by Mindbody's widget, not our API

### Current Booking Flow

```
User clicks "Book Now"
  → InitiateCheckout event fires ✅
  → Mindbody widget opens
  → User completes booking in widget
  → Widget redirects or shows confirmation
  → ❌ No Purchase/Schedule event fires
```

## Solutions to Implement

### Option 1: Booking Confirmation Page (Recommended)

Create a booking confirmation page that tracks conversion events:

1. **Create `/book/confirmation` page**
   - Query parameters: `?bookingId=XXX&service=XXX&value=XXX`
   - On page load, fire `trackMetaPixelPurchase()` or `trackMetaPixelSchedule()`
   - Work with Mindbody to redirect to this page after successful booking

### Mindbody Redirect Configuration (Operational Requirement)

To make Purchase/Schedule reliably measurable, Mindbody must redirect users to a first-party confirmation URL after a successful booking.

**Recommended redirect target**

- `/book/thank-you?bookingId=<mindbodyBookingId>`

**Optional query params** (temporary fallback if you cannot resolve server-side details yet)

- `service=<serviceSlug>`
- `value=<bookingValue>`

**Important implementation note**

- Prefer sending only `bookingId` and resolving service/value from trusted data when possible.
- If query params are used, sanitize and clamp values before firing events.

**Implementation Steps**:

```typescript
// apps/web/src/app/book/confirmation/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackMetaPixelPurchase, trackMetaPixelSchedule } from '@/lib/utils/metaPixel';

function ConfirmationContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    const service = searchParams.get('service');
    const value = searchParams.get('value');

    if (service && value) {
      // Track Purchase for paid bookings
      trackMetaPixelPurchase(service, parseFloat(value), bookingId || undefined);

      // Also track Schedule event
      trackMetaPixelSchedule(service, parseFloat(value));
    }
  }, [searchParams]);

  // ... confirmation UI
}
```

### Option 2: Mindbody Widget Callback Integration

If Mindbody widgets support post-booking callbacks:

1. **Check Mindbody widget documentation** for callback events
2. **Add event listener** to widget iframe messages
3. **Fire conversion events** when booking success message received

**Implementation**:

```typescript
// Listen for Mindbody widget messages
window.addEventListener('message', event => {
  if (event.origin !== 'https://widgets.mindbodyonline.com') return;

  if (event.data.type === 'booking-success') {
    trackMetaPixelPurchase(event.data.serviceName, event.data.value, event.data.bookingId);
  }
});
```

### Option 3: Server-Side Tracking via API

If we create booking API endpoints that proxy to Mindbody:

1. **Create `/api/mindbody/booking` endpoint**
2. **Track Purchase event server-side** using Meta Conversions API
3. **Return confirmation to client**

**Note**: This requires Meta Conversions API setup (server-side tracking)

## Verifying Events in Meta Events Manager

### Steps to Check

1. **Install Facebook Pixel Helper** (Chrome extension)
   - Visit: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
   - Navigate to website and check console for events

2. **Check Meta Events Manager**
   - Go to: https://business.facebook.com/events_manager2
   - Select Pixel: `1374688407654467`
   - View "Test Events" tab to see real-time events
   - Check "Overview" tab for event counts

3. **Test Current Events**
   - Visit any page → Should see `PageView`
   - Visit `/experience` → Should see `ViewContent`
   - Click booking button → Should see `InitiateCheckout`
   - Submit contact form → Should see `Lead`

4. **Test Conversion Events** (after implementation)
   - Complete a booking → Should see `Purchase` or `Schedule`
   - Sign up for membership → Should see `CompleteRegistration`

## Configuring Conversions in Meta Ads Manager

### Steps

1. **Go to Meta Ads Manager**
   - Navigate to: https://business.facebook.com/adsmanager
   - Select your ad account

2. **Set Up Conversion Event**
   - Go to "Events Manager" → "Aggregated Event Measurement"
   - Or: "Ad Sets" → Edit → "Optimization & Delivery" → "Conversions"

3. **Select Conversion Event**
   - For bookings: Choose `Purchase` or `Schedule`
   - For memberships: Choose `CompleteRegistration`
   - For leads: Choose `Lead` (already tracked)

4. **Verify Conversion Setup**
   - Ensure pixel ID matches: `1374688407654467`
   - Check that events are firing in Events Manager
   - Wait 24-48 hours for data to populate in Ads Manager

## Recommended Next Steps

1. ✅ **Verify current events are firing** - Use Pixel Helper and Events Manager
2. ⚠️ **Work with Mindbody** - Request booking confirmation redirect URL or callback
3. ⚠️ **Implement conversion tracking** - Choose one of the solutions above
4. ⚠️ **Test thoroughly** - Verify events fire correctly
5. ⚠️ **Configure in Ads Manager** - Set up conversion events for ad optimization

## Current Event Firing Locations

| Event                | Location                         | Status                          |
| -------------------- | -------------------------------- | ------------------------------- |
| PageView             | `DeferredAnalytics.tsx`          | ✅ Automatic                    |
| ViewContent          | `ExperiencePageClient.tsx:154`   | ✅ On experience page load      |
| InitiateCheckout     | `BookPageClient.tsx:511,571,786` | ✅ On booking button clicks     |
| Contact              | Various components               | ✅ On phone/email clicks        |
| Lead                 | `ContactPageClient.tsx:90`       | ✅ Via MutationObserver         |
| Purchase             | ❌ Not implemented               | Need booking confirmation       |
| Schedule             | ❌ Not implemented               | Need booking confirmation       |
| CompleteRegistration | ❌ Not implemented               | Need membership signup tracking |

## Additional Notes

- **Critical vs deferred split** - Meta init is critical and runs in `AnalyticsBoot.tsx`; GTM/Mixpanel remain deferred in `DeferredAnalytics.tsx`
- **Deduplication enabled** - Events are deduplicated within 1 second window
- **Queueing enabled** - Events queue briefly when `fbq` is not yet ready and flush automatically
- **Error handling** - Production avoids user impact; non-prod exposes queued/sent/skipped audit visibility

## Resources

- [Meta Pixel Events Documentation](https://www.facebook.com/business/help/402791146561655)
- [Standard Events Reference](https://www.facebook.com/business/help/402791146561655?id=1205376682832142)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
