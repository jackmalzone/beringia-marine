# Google Tag Manager Setup

Google Tag Manager (GTM) has been successfully installed on the Vital Ice website. This document provides information about the implementation and how to use the tracking features.

## Installation Details

### GTM Container ID

- **Container ID**: `GTM-MFQGZL94`
- **Installation Date**: Current
- **Status**: ✅ Active

### Implementation Location

The GTM code has been installed in the Next.js root layout (`src/app/layout.tsx`):

1. **GTM Script**: Added in the `<head>` section as high as possible
2. **Noscript Fallback**: Added immediately after the opening `<body>` tag

This ensures GTM loads on every page of the website automatically.

## Available Tracking Functions

### Basic GTM Functions (`src/lib/utils/gtm.ts`)

```typescript
import { gtmPushEvent, gtmTrackPageView, gtmTrackEvent } from '@/lib/utils/gtm';

// Push custom events
gtmPushEvent('custom_event', { parameter: 'value' });

// Track page views (automatic in most cases)
gtmTrackPageView('/page-path', 'Page Title');

// Track custom events
gtmTrackEvent('event_name', 'category', 'label', 123);
```

### React Hook (`src/hooks/useGTM.ts`)

For React components, use the `useGTM` hook:

```typescript
import { useGTM } from '@/hooks/useGTM';

function MyComponent() {
  const { trackEvent, trackButtonClick, trackFormSubmission } = useGTM();

  const handleClick = () => {
    trackButtonClick('cta_button', 'hero_section');
  };

  const handleFormSubmit = () => {
    trackFormSubmission('contact_form', 'footer');
  };

  return (
    <button onClick={handleClick}>Click Me</button>
  );
}
```

## Pre-configured Tracking Events

The following events are already being tracked:

### 1. Page Views

- **Event**: `page_view`
- **Trigger**: Automatic on route changes
- **Data**: `page_path`, `page_title`

### 2. Booking Attempts

- **Event**: `booking_attempt`
- **Trigger**: When users click booking buttons
- **Data**: `service`, `location`
- **Example**: Rolling book button clicks

### 3. Form Submissions

- **Event**: `form_submit`
- **Trigger**: When forms are submitted
- **Data**: `form_name`, `form_type`

### 4. Button Clicks

- **Event**: `button_click`
- **Trigger**: Important button interactions
- **Data**: `button_name`, `button_location`

### 5. Email Interactions

- **Event**: `email_interaction`
- **Trigger**: Email-related actions
- **Data**: `email_action`, `email_type`

## Adding Custom Tracking

### Method 1: Using the GTM Hook

```typescript
import { useGTM } from '@/hooks/useGTM';

function ContactForm() {
  const { trackFormSubmission, trackEvent } = useGTM();

  const handleSubmit = () => {
    trackFormSubmission('contact_form', 'hero');
    trackEvent('lead_generation', 'form', 'contact', 1);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Method 2: Direct GTM Push

```typescript
import { gtmPushEvent } from '@/lib/utils/gtm';

// Custom conversion tracking
gtmPushEvent('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      item_id: 'membership_founding',
      item_name: 'Founding Membership',
      category: 'membership',
      quantity: 1,
      price: 99.99,
    },
  ],
});
```

## Recommended GTM Tags to Set Up

### 1. Google Analytics 4 (GA4)

- **Tag Type**: Google Analytics: GA4 Configuration
- **Measurement ID**: Your GA4 measurement ID
- **Trigger**: All Pages

### 2. Google Ads Conversion Tracking

- **Tag Type**: Google Ads Conversion Tracking
- **Conversion ID**: Your Google Ads conversion ID
- **Trigger**: Custom events (booking_attempt, form_submit, etc.)

### 3. Facebook Pixel

- **Tag Type**: Custom HTML
- **Trigger**: All Pages + Custom Events

### 4. Enhanced Ecommerce (if applicable)

- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: purchase, add_to_cart, etc.
- **Trigger**: Custom ecommerce events

## Testing GTM Implementation

### 1. GTM Preview Mode

1. Go to your GTM container
2. Click "Preview"
3. Enter your website URL
4. Test events and data layer pushes

### 2. Browser Developer Tools

```javascript
// Check if GTM is loaded
console.log(window.dataLayer);

// Check recent events
console.log(window.dataLayer.slice(-5));
```

### 3. GTM Debug Extension

Install the "Google Tag Manager Debug" Chrome extension for easier debugging.

## Data Layer Structure

The data layer follows this structure:

```javascript
window.dataLayer = [
  {
    event: 'page_view',
    page_path: '/services',
    page_title: 'Services - Vital Ice',
  },
  {
    event: 'button_click',
    button_name: 'book_now',
    button_location: 'hero_section',
  },
  {
    event: 'booking_attempt',
    service: 'cold_plunge',
    location: 'homepage',
  },
];
```

## Common GTM Variables to Create

### Built-in Variables (Enable these)

- Page URL
- Page Title
- Page Path
- Referrer
- Click Element
- Click Text
- Form Element

### Custom Variables

- User ID (if available)
- Service Type
- Membership Status
- Page Category

## Conversion Tracking Setup

### Example: Booking Conversion

1. **Trigger**: Custom Event = `booking_attempt`
2. **Tag**: Google Ads Conversion Tracking
3. **Conversion Action**: "Book Session"
4. **Value**: Dynamic or static value

### Example: Form Lead

1. **Trigger**: Custom Event = `form_submit`
2. **Tag**: Google Ads Conversion Tracking
3. **Conversion Action**: "Contact Form"
4. **Conditions**: `form_type` equals `contact`

## Support and Maintenance

### Files to Monitor

- `src/app/layout.tsx` - GTM installation
- `src/lib/utils/gtm.ts` - GTM utility functions
- `src/hooks/useGTM.ts` - React GTM hook

### Adding New Events

1. Add the event to `src/lib/utils/gtm.ts` if it's a common pattern
2. Use the `useGTM` hook in React components
3. Test in GTM Preview mode
4. Set up corresponding tags in GTM

### Troubleshooting

- Check browser console for GTM errors
- Verify GTM container is published
- Ensure events are firing in Preview mode
- Check data layer structure matches expectations

## Contact

For technical questions about the GTM implementation, contact the development team.
For GTM configuration and tag setup, work with your SEO/marketing team.
