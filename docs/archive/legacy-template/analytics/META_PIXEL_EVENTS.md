# Meta Pixel Event Tracking Guide

This guide explains how to use Meta Pixel event tracking in the Vital Ice website.

## Overview

Meta Pixel events allow you to track specific user actions beyond page views. This helps you:
- Measure conversions
- Optimize Facebook/Instagram ads
- Create custom audiences
- Track ROI on ad campaigns

## Event Code Examples

### Basic Event Tracking

The simplest way to track an event is using the utility functions:

```typescript
import { trackMetaPixelEvent, trackMetaPixelSchedule } from '@/lib/utils/metaPixel';

// Track a schedule event (when user books an appointment)
trackMetaPixelSchedule('Cold Plunge Session', 50.00);
```

### Standard Events

Facebook recognizes these standard events (pre-defined):

#### 1. **PageView** (automatic)
Already tracked automatically on all pages.

#### 2. **ViewContent** - User views a service page
```typescript
import { trackMetaPixelViewContent } from '@/lib/utils/metaPixel';

// On a service page (e.g., /services/cold-plunge)
trackMetaPixelViewContent('Cold Plunge Therapy', 'cold-plunge');
```

#### 3. **InitiateCheckout** - User starts booking process
```typescript
import { trackMetaPixelInitiateCheckout } from '@/lib/utils/metaPixel';

// When user clicks "Book Now" or opens booking widget
trackMetaPixelInitiateCheckout('Cold Plunge Session', 50.00);
```

#### 4. **Schedule** - User schedules an appointment
```typescript
import { trackMetaPixelSchedule } from '@/lib/utils/metaPixel';

// After successful appointment booking
trackMetaPixelSchedule('Infrared Sauna Session', 45.00);
```

#### 5. **Purchase** - User completes a purchase/booking
```typescript
import { trackMetaPixelPurchase } from '@/lib/utils/metaPixel';

// After confirmed booking
trackMetaPixelPurchase('Cold Plunge Session', 50.00, 'booking-12345');
```

#### 6. **Lead** - User submits a lead form
```typescript
import { trackMetaPixelLead } from '@/lib/utils/metaPixel';

// After contact form submission
trackMetaPixelLead('Contact Form', 0);
```

#### 7. **Contact** - User contacts the business
```typescript
import { trackMetaPixelContact } from '@/lib/utils/metaPixel';

// When user clicks phone number or email
trackMetaPixelContact('phone');
// or
trackMetaPixelContact('email');
```

#### 8. **CompleteRegistration** - User signs up for membership
```typescript
import { trackMetaPixelCompleteRegistration } from '@/lib/utils/metaPixel';

// After membership signup
trackMetaPixelCompleteRegistration('Monthly Membership', 99.00);
```

#### 9. **Search** - User searches for services
```typescript
import { trackMetaPixelSearch } from '@/lib/utils/metaPixel';

// When user searches
trackMetaPixelSearch('cold plunge');
```

### Custom Events

For actions not covered by standard events:

```typescript
import { trackMetaPixelCustomEvent } from '@/lib/utils/metaPixel';

// Track a custom event
trackMetaPixelCustomEvent('ServiceInquiry', {
  service_name: 'Cold Plunge',
  inquiry_type: 'pricing',
});
```

## Implementation Examples

### Example 1: Track Service Page View

In a service page component (e.g., `/services/cold-plunge/page.tsx`):

```typescript
'use client';

import { useEffect } from 'react';
import { trackMetaPixelViewContent } from '@/lib/utils/metaPixel';

export default function ColdPlungePage() {
  useEffect(() => {
    // Track that user viewed this service
    trackMetaPixelViewContent('Cold Plunge Therapy', 'cold-plunge');
  }, []);

  return (
    // ... page content
  );
}
```

### Example 2: Track Booking Initiation

In a booking button component:

```typescript
'use client';

import { trackMetaPixelInitiateCheckout } from '@/lib/utils/metaPixel';

export function BookButton({ serviceName, price }: { serviceName: string; price: number }) {
  const handleClick = () => {
    // Track that user started booking
    trackMetaPixelInitiateCheckout(serviceName, price);
    
    // Open booking widget
    // ... your booking logic
  };

  return <button onClick={handleClick}>Book Now</button>;
}
```

### Example 3: Track Successful Booking

After a successful booking confirmation:

```typescript
import { trackMetaPixelSchedule } from '@/lib/utils/metaPixel';

// In your booking success handler
function handleBookingSuccess(booking: Booking) {
  trackMetaPixelSchedule(booking.serviceName, booking.price);
  
  // Show success message
  // ...
}
```

### Example 4: Track Contact Form Submission

In a contact form component:

```typescript
'use client';

import { trackMetaPixelLead } from '@/lib/utils/metaPixel';

export function ContactForm() {
  const handleSubmit = async (data: FormData) => {
    // Submit form
    const response = await submitForm(data);
    
    if (response.success) {
      // Track lead generation
      trackMetaPixelLead('Contact Form');
    }
  };

  return (
    // ... form JSX
  );
}
```

### Example 5: Track Phone/Email Clicks

```typescript
'use client';

import { trackMetaPixelContact } from '@/lib/utils/metaPixel';

export function ContactInfo() {
  const handlePhoneClick = () => {
    trackMetaPixelContact('phone');
    window.location.href = 'tel:+14155551234';
  };

  const handleEmailClick = () => {
    trackMetaPixelContact('email');
    window.location.href = 'mailto:info@vitalicesf.com';
  };

  return (
    <>
      <a onClick={handlePhoneClick} href="tel:+14155551234">
        (415) 555-1234
      </a>
      <a onClick={handleEmailClick} href="mailto:info@vitalicesf.com">
        info@vitalicesf.com
      </a>
    </>
  );
}
```

## Direct fbq() Usage

If you need to use `fbq()` directly (not recommended, but possible):

```typescript
// Check if fbq is available
if (typeof window !== 'undefined' && window.fbq) {
  // Standard event
  window.fbq('track', 'Purchase', {
    value: 50.00,
    currency: 'USD',
    content_name: 'Cold Plunge Session',
  });

  // Custom event
  window.fbq('trackCustom', 'ServiceInquiry', {
    service_name: 'Cold Plunge',
  });
}
```

## Event Parameters

Common parameters you can include:

- `value` - Monetary value (number)
- `currency` - Currency code (e.g., 'USD')
- `content_name` - Name of the content/service
- `content_ids` - Array of IDs (e.g., ['service-123'])
- `content_type` - Type of content (e.g., 'service', 'product')
- `content_category` - Category (e.g., 'wellness', 'recovery')

## Best Practices

1. **Track meaningful actions**: Only track events that indicate user intent or conversion
2. **Include value when possible**: Helps measure ROI
3. **Use standard events first**: They're optimized by Facebook's algorithm
4. **Test events**: Use Facebook's Events Manager to verify events are firing
5. **Don't over-track**: Too many events can dilute signal quality

## Testing

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit your website and perform actions
3. Check that events fire correctly
4. Verify in Meta Events Manager

## Common Use Cases for Vital Ice

### Booking Flow
1. **ViewContent** - User views service page
2. **InitiateCheckout** - User clicks "Book Now"
3. **Schedule** - User completes booking

### Contact Flow
1. **Contact** - User clicks phone/email
2. **Lead** - User submits contact form

### Membership Flow
1. **ViewContent** - User views membership page
2. **CompleteRegistration** - User signs up for membership

## Resources

- [Meta Pixel Events Documentation](https://www.facebook.com/business/help/402791146561655)
- [Standard Events Reference](https://www.facebook.com/business/help/402791146561655?id=1205376682832142)
- [Custom Events Guide](https://www.facebook.com/business/help/402791146561655?id=1205376682832142)




