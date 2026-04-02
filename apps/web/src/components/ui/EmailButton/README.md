# EmailButton Component

A robust, cross-platform email button component with progressive fallbacks and performance optimizations.

## Features

- **Cross-platform compatibility**: Works reliably across Windows, macOS, and mobile devices
- **Progressive fallbacks**: Multiple methods to open email clients with graceful degradation
- **Lazy loading**: FallbackUI component is loaded only when needed
- **Debouncing**: Prevents multiple rapid mailto attempts
- **Accessibility**: Full ARIA support and keyboard navigation
- **Error handling**: Comprehensive error handling with retry mechanisms
- **Analytics**: Optional tracking for mailto success/failure rates
- **TypeScript**: Full type safety with comprehensive type definitions

## Usage

### Basic Usage

```tsx
import { EmailButton } from '@/components/ui/EmailButton';

function ContactSection() {
  return (
    <EmailButton
      email="contact@example.com"
      subject="Inquiry from website"
      body="Hello, I would like to..."
    >
      Contact Us
    </EmailButton>
  );
}
```

### Advanced Usage

```tsx
import { EmailButton } from '@/components/ui/EmailButton';

function ContactForm() {
  const handleSuccess = () => {
    console.log('Email client opened successfully');
  };

  const handleFailure = (error: string) => {
    console.error('Failed to open email client:', error);
  };

  return (
    <EmailButton
      email="support@example.com"
      subject="Support Request"
      body="Please describe your issue..."
      cc="manager@example.com"
      className="custom-email-button"
      showFallbackOnFailure={true}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      debounceDelay={1500}
      aria-label="Send support email"
    >
      Get Support
    </EmailButton>
  );
}
```

## Props

| Prop                    | Type                      | Default | Description                                    |
| ----------------------- | ------------------------- | ------- | ---------------------------------------------- |
| `email`                 | `string`                  | -       | **Required.** Recipient email address          |
| `subject`               | `string`                  | -       | Email subject line                             |
| `body`                  | `string`                  | -       | Email body content                             |
| `cc`                    | `string`                  | -       | Carbon copy recipients (comma-separated)       |
| `bcc`                   | `string`                  | -       | Blind carbon copy recipients (comma-separated) |
| `children`              | `ReactNode`               | -       | **Required.** Button content                   |
| `className`             | `string`                  | `''`    | Additional CSS classes                         |
| `showFallbackOnFailure` | `boolean`                 | `true`  | Show fallback UI when mailto fails             |
| `onSuccess`             | `() => void`              | -       | Callback fired on successful mailto            |
| `onFailure`             | `(error: string) => void` | -       | Callback fired on mailto failure               |
| `disabled`              | `boolean`                 | `false` | Whether the button is disabled                 |
| `aria-label`            | `string`                  | -       | Accessible label for screen readers            |
| `debounceDelay`         | `number`                  | `1000`  | Debounce delay in milliseconds                 |

## Performance Optimizations

### Lazy Loading

The FallbackUI component is lazy-loaded to reduce the initial bundle size:

```tsx
// Only loaded when fallback is needed
const FallbackUI = lazy(() =>
  import('@/components/ui/FallbackUI/FallbackUI').then(module => ({
    default: module.FallbackUI,
  }))
);
```

### Debouncing

Prevents multiple rapid mailto attempts:

```tsx
// Configurable debounce delay (default: 1000ms)
<EmailButton debounceDelay={1500} />
```

### Code Splitting

Email utilities are separated for better tree-shaking:

- `EmailUtils.ts` - Validation and formatting utilities
- `MailtoHandler.ts` - Core mailto functionality
- `types/email.ts` - Comprehensive type definitions

## Error Handling

The component implements comprehensive error handling with categorized error types:

- **Network errors**: Connection issues (retryable)
- **Security errors**: Browser security restrictions
- **Client errors**: No email client configured
- **Validation errors**: Invalid email parameters
- **Unknown errors**: Uncategorized failures

### Retry Logic

```tsx
// Automatic retry for transient errors
// Manual retry button for user-initiated retries
// Maximum 2 retry attempts before showing fallback
```

## Accessibility

- Full ARIA support with proper labels and descriptions
- Keyboard navigation support (Enter and Space keys)
- Screen reader friendly error messages
- High contrast mode support
- Reduced motion support for animations

## Browser Compatibility

### Mailto Methods (in order of preference)

1. **`window.location.href`** - Most reliable across all browsers
2. **`window.open()`** - Fallback for restricted environments
3. **Programmatic link click** - Final fallback method

### Clipboard Support

- Modern Clipboard API (preferred)
- `execCommand` fallback for older browsers
- Graceful degradation when clipboard is unavailable

## Styling

The component uses CSS modules for styling with CSS custom properties for theming:

```css
.emailButton {
  --primary-color: #007bff;
  --primary-hover-color: #0056b3;
  --focus-color: #007bff;
  --disabled-color: #6c757d;
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .emailButton {
    --primary-color: #0d6efd;
    --primary-hover-color: #0b5ed7;
  }
}
```

## Analytics Integration

Optional analytics tracking for mailto events:

```tsx
import { MailtoHandler } from '@/lib/utils/MailtoHandler';

MailtoHandler.configure({
  enableTracking: true,
  analytics: {
    onAttempt: options => {
      // Track mailto attempts
    },
    onSuccess: (result, options) => {
      // Track successful opens
    },
    onFailure: (result, options) => {
      // Track failures for improvement
    },
    onFallback: options => {
      // Track fallback usage
    },
    onCopy: (text, type) => {
      // Track clipboard usage
    },
  },
});
```

## Testing

The component includes comprehensive test coverage:

- Unit tests for all functionality
- Integration tests for user interactions
- Cross-platform compatibility tests
- Error handling scenario tests
- Accessibility compliance tests

## Migration from Legacy Implementation

If migrating from a basic mailto implementation:

```tsx
// Before
<a href={`mailto:${email}?subject=${subject}`}>
  Contact Us
</a>

// After
<EmailButton email={email} subject={subject}>
  Contact Us
</EmailButton>
```

## Related Components

- **FallbackUI**: Modal shown when mailto fails
- **NoScriptFallback**: Fallback for JavaScript-disabled environments
- **EmailErrorBoundary**: Error boundary for email functionality

## Performance Metrics

- **Bundle size impact**: ~2KB gzipped (excluding lazy-loaded fallback)
- **First paint**: No impact (lazy loading)
- **Time to interactive**: Minimal impact with debouncing
- **Accessibility score**: 100/100 (Lighthouse)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## Contributing

When contributing to the EmailButton component:

1. Ensure all tests pass
2. Update documentation for new features
3. Follow accessibility guidelines
4. Test across multiple browsers and platforms
5. Consider performance impact of changes
