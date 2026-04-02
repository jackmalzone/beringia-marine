# ArticleCardSkeleton Component

## Overview

The `ArticleCardSkeleton` component provides a loading state placeholder that matches the layout of the `ArticleCard` component. It displays animated skeleton elements during data fetching to improve perceived performance and user experience.

## Features

- **Layout Matching**: Skeleton structure mirrors the ArticleCard component exactly
- **Pulsing Animation**: Smooth opacity animation creates a loading effect
- **Staggered Delays**: Different elements animate with slight delays for visual interest
- **Glassmorphism**: Maintains the same visual style as the actual cards
- **Accessibility**: Includes proper ARIA labels for screen readers
- **Responsive**: Adapts to different screen sizes
- **Reduced Motion**: Respects user's motion preferences

## Usage

### In Listing Page

```tsx
import ArticleCardSkeleton from '@/components/insights/ArticleCardSkeleton/ArticleCardSkeleton';

// Display multiple skeletons during loading
{
  isLoading ? (
    <>
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </>
  ) : (
    articles.map(article => <ArticleCard key={article.id} article={article} />)
  );
}
```

### In Route-Level Loading

```tsx
// src/app/insights/loading.tsx
import ArticleCardSkeleton from '@/components/insights/ArticleCardSkeleton/ArticleCardSkeleton';

export default function InsightsLoading() {
  return (
    <div className={styles.loading__grid}>
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </div>
  );
}
```

## Component Structure

The skeleton includes placeholders for:

1. **Cover Image**: Full-width image container with aspect ratio
2. **Category Badge**: Positioned in top-left corner
3. **Title**: Large heading placeholder
4. **Subtitle**: Secondary heading placeholder
5. **Abstract**: Three lines of text placeholders
6. **Meta Information**: Author and date placeholders
7. **Tags**: Three tag placeholders

## Animation

The component uses a CSS `pulse` animation that:

- Animates opacity from 1 → 0.5 → 1
- Duration: 1.5 seconds
- Easing: ease-in-out
- Infinite loop
- Staggered delays for each element (0.1s - 1.1s)

## Accessibility

- Includes `aria-label="Loading article"` for screen readers
- Respects `prefers-reduced-motion` media query
- When reduced motion is preferred, animations are disabled and opacity is set to 0.7

## Styling

The skeleton uses the same glassmorphism effect as ArticleCard:

- Semi-transparent background: `rgba(255, 255, 255, 0.05)`
- Backdrop blur: `blur(20px) saturate(180%)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Box shadow for depth
- Border radius: 16px

## Performance

- Lightweight CSS animations (GPU-accelerated)
- No JavaScript required for animation
- Minimal DOM elements
- Efficient rendering in grid layouts

## Requirements Satisfied

- **1.7**: Display loading spinner with appropriate ARIA labels
- **3.7**: Display loading state until content is ready
- **7.1**: Achieve Lighthouse performance score above 90

## Related Components

- `ArticleCard`: The actual card component this skeleton represents
- `InsightsPageClient`: Uses skeletons during data fetching
- `loading.tsx`: Route-level loading states

## Browser Support

Works in all modern browsers that support:

- CSS Grid
- CSS Animations
- Backdrop Filter (with graceful degradation)
- CSS Custom Properties
