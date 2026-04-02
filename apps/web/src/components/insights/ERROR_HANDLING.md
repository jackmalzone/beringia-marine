# Error Handling in Insights Blog System

This document describes the comprehensive error handling implementation for the Insights blog system.

## Overview

The Insights blog system uses a multi-layered error handling approach that includes:

1. **Error Boundaries** - Catch React component errors
2. **Image Error Handling** - Graceful fallbacks for failed image loads
3. **Network Error Handling** - User-friendly messages for data fetching failures
4. **PII Masking** - Automatic removal of sensitive information from error reports
5. **Sentry Integration** - Centralized error monitoring and reporting

## Error Boundary Integration

### Using the Main ErrorBoundary

Instead of creating a custom error boundary, the Insights system uses the centralized `ErrorBoundary` component from `src/components/providers/ErrorBoundary.tsx`.

```tsx
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';

<ErrorBoundary level="page" componentName="ArticlePageClient">
  <ArticleContent />
</ErrorBoundary>;
```

### Error Boundary Levels

- **page**: Critical errors that affect the entire page
- **component**: Recoverable errors in specific components
- **widget**: Third-party widget errors (low severity)

## Image Error Handling

### ArticleCard Component

The `ArticleCard` component handles cover image load failures with a placeholder:

```tsx
const [imageError, setImageError] = useState(false);

const handleImageError = () => {
  setImageError(true);
  reportError(new Error(`Failed to load image: ${article.coverImage}`), {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.LOW,
    component: 'ArticleCard',
    action: 'imageLoad',
    metadata: {
      articleId: article.id,
      articleSlug: article.slug,
      imageUrl: article.coverImage,
    },
  });
};

{
  imageError ? (
    <div className={styles.card__imagePlaceholder}>{/* SVG placeholder icon */}</div>
  ) : (
    <img src={article.coverImage} onError={handleImageError} />
  );
}
```

### ArticleHero Component

The `ArticleHero` component handles author avatar load failures:

```tsx
const [avatarError, setAvatarError] = useState(false);

{
  author?.avatar && !avatarError ? (
    <Image src={author.avatar} onError={handleAvatarError} />
  ) : author?.avatar && avatarError ? (
    <div className={styles.hero__authorAvatarPlaceholder}>{/* User icon placeholder */}</div>
  ) : null;
}
```

## Network Error Handling

### InsightsPageClient

The listing page handles data fetching errors with retry functionality:

```tsx
const [error, setError] = useState<Error | null>(null);

try {
  const data = getAllArticles();
  setArticles(data);
} catch (err) {
  const error = err instanceof Error ? err : new Error('Failed to load articles');
  setError(error);
  reportNetworkError(error, '/insights', 0, {
    component: 'InsightsPageClient',
    action: 'fetchArticles',
    metadata: { selectedCategory },
  });
}

{error ? (
  <div className={styles.insights__error}>
    <h3>Unable to load articles</h3>
    <p>We're having trouble loading the content. Please try again.</p>
    <button onClick={handleRetry}>Try Again</button>
  </div>
) : (
  // Normal content
)}
```

## PII Masking

The error reporting utility automatically masks Personally Identifiable Information (PII) before sending to Sentry:

### Masked Data Types

- **Email addresses**: `user@example.com` → `[EMAIL]`
- **Phone numbers**: `(555) 123-4567` → `[PHONE]`
- **IP addresses**: `192.168.1.1` → `[IP]`
- **Credit cards**: `1234-5678-9012-3456` → `[CARD]`
- **SSN patterns**: `123-45-6789` → `[SSN]`
- **API tokens**: Long alphanumeric strings → `[TOKEN]`

### Sensitive Metadata Keys

The following metadata keys are automatically redacted:

- `password`
- `token`
- `apiKey`
- `secret`
- `authorization`
- `cookie`

### Example

```tsx
reportError(new Error('Failed to authenticate user@example.com'), {
  category: ErrorCategory.NETWORK,
  metadata: {
    email: 'user@example.com', // Masked to [EMAIL]
    password: 'secret123', // Redacted to [REDACTED]
    userId: '12345', // Preserved (not PII)
  },
});
```

## Error Reporting Functions

### reportError

General error reporting with automatic categorization:

```tsx
import { reportError, ErrorCategory, ErrorSeverity } from '@/lib/utils/errorReporting';

reportError(error, {
  category: ErrorCategory.NETWORK,
  severity: ErrorSeverity.MEDIUM,
  component: 'ComponentName',
  action: 'actionName',
  metadata: {
    // Additional context
  },
});
```

### reportNetworkError

Specialized function for network errors with retry tracking:

```tsx
import { reportNetworkError } from '@/lib/utils/errorReporting';

reportNetworkError(error, url, retryCount, {
  component: 'ComponentName',
  action: 'fetchData',
  metadata: {
    // Additional context
  },
});
```

## User-Friendly Error Messages

All error messages shown to users are:

1. **Clear and concise** - No technical jargon
2. **Actionable** - Provide next steps (retry, reload, go back)
3. **Reassuring** - Acknowledge the issue without alarming users

### Examples

❌ **Bad**: "TypeError: Cannot read property 'map' of undefined"

✅ **Good**: "We're having trouble loading the content. Please try again."

❌ **Bad**: "Network request failed with status 500"

✅ **Good**: "Unable to load articles. This might be a temporary issue."

## Accessibility

All error states include:

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** for retry buttons
- **Color contrast** meeting WCAG 2.1 AA standards
- **Reduced motion** support

## Testing

Run error handling tests:

```bash
npm test src/components/insights/__tests__/error-handling.test.tsx
```

## Best Practices

1. **Always use ErrorBoundary** - Wrap page-level and critical components
2. **Handle image errors** - Provide placeholders for failed image loads
3. **Mask PII** - Never log sensitive user information
4. **Provide retry options** - Let users recover from transient errors
5. **Log to Sentry** - Use centralized error reporting for monitoring
6. **Test error states** - Verify error handling in unit and integration tests

## Related Files

- `src/components/providers/ErrorBoundary.tsx` - Main error boundary component
- `src/lib/utils/errorReporting.ts` - Error reporting utilities with PII masking
- `src/app/insights/InsightsPageClient.tsx` - Network error handling example
- `src/components/insights/ArticleCard/ArticleCard.tsx` - Image error handling example
- `src/app/insights/[slug]/not-found.tsx` - 404 error page

## Future Enhancements

- [ ] Add error recovery strategies (exponential backoff for retries)
- [ ] Implement offline detection and messaging
- [ ] Add error analytics dashboard
- [ ] Create error boundary for individual article cards
- [ ] Add toast notifications for non-critical errors
