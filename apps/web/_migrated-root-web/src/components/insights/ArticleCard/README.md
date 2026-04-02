# ArticleCard Component

A glassmorphism-styled card component for displaying article previews in the Insights blog system.

## Features

- **Glassmorphism Design**: Semi-transparent background with backdrop blur for modern aesthetic
- **Layered Shadows**: Multiple box-shadows create depth and elevation
- **Hover Animations**: Smooth lift, scale, and glow effects using Framer Motion
- **Shimmer Effect**: Gradient overlay animation on hover
- **Category Badges**: Color-coded badges using CATEGORY_METADATA
- **Keyboard Navigation**: Full support for Enter and Space keys
- **Accessibility**: ARIA labels, focus indicators, and reduced motion support
- **Responsive**: Optimized layouts for mobile, tablet, and desktop

## Usage

```tsx
import ArticleCard from '@/components/insights/ArticleCard/ArticleCard';
import { ArticleData } from '@/types/insights';

const article: ArticleData = {
  id: '1',
  title: 'The Science Behind Cold Plunge Therapy',
  subtitle: 'Understanding the physiological benefits',
  abstract: 'Discover how cold plunge therapy triggers...',
  category: 'Research Summary',
  author: 'Dr. Sarah Chen',
  publishDate: '2025-01-15',
  coverImage: 'https://example.com/image.jpg',
  tags: ['Cold Therapy', 'Recovery', 'Science'],
  slug: 'science-behind-cold-plunge-therapy',
  content: '<p>Full content...</p>',
  status: 'published',
};

<ArticleCard article={article} />;
```

## Props

| Prop    | Type        | Required | Description                                            |
| ------- | ----------- | -------- | ------------------------------------------------------ |
| article | ArticleData | Yes      | Article data object containing all article information |

## Styling

The component uses CSS modules with the following key features:

- **Glassmorphism**: `backdrop-filter: blur(20px)` with semi-transparent background
- **Shadows**: Layered box-shadows for depth perception
- **Hover State**: Enhanced shadows, border glow, and image zoom
- **Focus State**: Visible outline for keyboard navigation
- **Animations**: Framer Motion spring animations with smooth easing

## Accessibility

- **Keyboard Navigation**: Supports Enter and Space keys
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Indicators**: Visible focus states for keyboard users
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Semantic HTML**: Uses `<article>` element with proper role

## Performance

- **Lazy Loading**: Images use `loading="lazy"` attribute
- **GPU Acceleration**: Uses `transform: translateZ(0)` and `will-change`
- **Optimized Animations**: Spring physics for natural motion

## Future Enhancements

- Replace `<img>` with Next.js `<Image>` component for automatic optimization
- Add skeleton loading state
- Support for video cover media
- Reading time display
- Bookmark/save functionality
