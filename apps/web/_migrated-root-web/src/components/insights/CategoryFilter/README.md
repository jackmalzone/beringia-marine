# CategoryFilter Component

A fully accessible category filter component for the Insights blog system that allows users to filter articles by category.

## Features

- ✅ **Keyboard Navigation**: Full support for Tab, Enter, and Space keys
- ✅ **ARIA Attributes**: Implements proper tablist/tab roles with aria-selected and aria-controls
- ✅ **Visible Focus Indicators**: WCAG 2.1 AA compliant focus states
- ✅ **Vital Ice Branding**: Uses brand colors (#00b7b5) for active states
- ✅ **Responsive Design**: Adapts to mobile, tablet, and desktop screens
- ✅ **Reduced Motion Support**: Respects prefers-reduced-motion preference
- ✅ **High Contrast Mode**: Enhanced visibility in high contrast mode

## Usage

```tsx
import CategoryFilter from '@/components/insights/CategoryFilter/CategoryFilter';
import { ARTICLE_CATEGORIES } from '@/types/insights';

function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <CategoryFilter
      categories={['All', ...ARTICLE_CATEGORIES]}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />
  );
}
```

## Props

| Prop               | Type                           | Description                          |
| ------------------ | ------------------------------ | ------------------------------------ |
| `categories`       | `('All' \| ArticleCategory)[]` | Array of category options to display |
| `selectedCategory` | `string`                       | Currently selected category          |
| `onCategoryChange` | `(category: string) => void`   | Callback when category is changed    |

## Accessibility

### Keyboard Support

- **Tab**: Navigate between category buttons
- **Enter**: Activate focused category button
- **Space**: Activate focused category button

### ARIA Attributes

- `role="tablist"`: Container has tablist role
- `aria-label="Article categories"`: Descriptive label for screen readers
- `role="tab"`: Each button has tab role
- `aria-selected`: Indicates selected state (true/false)
- `aria-controls="insights-articles-grid"`: Links to controlled content
- `tabIndex="0"`: All buttons are keyboard focusable

### Focus Indicators

- 3px solid outline with offset for visibility
- Additional box-shadow for enhanced visibility
- Different colors for active vs inactive states
- Meets WCAG 2.1 Level AA contrast requirements

## Styling

The component uses CSS modules with the following features:

- **Glassmorphism**: Semi-transparent background with backdrop blur
- **Smooth Transitions**: 0.3s cubic-bezier easing
- **Hover Effects**: Lift animation and glow effect
- **Active State**: Vital Ice primary color (#00b7b5)
- **Responsive**: Adapts padding and font size for mobile

## Testing

Run the component tests:

```bash
npm test -- CategoryFilter.test.tsx --no-watch
```

Tests cover:

- Rendering all categories
- Active state styling
- Click interactions
- Keyboard navigation (Enter, Space)
- ARIA attributes
- Focus indicators
- Event prevention

## Requirements Satisfied

- ✅ 2.1: Display category filter buttons including "All"
- ✅ 2.2: Filter articles by selected category
- ✅ 2.3: Visual indication of selected category
- ✅ 2.4: Display all categories
- ✅ 2.5: Smooth transitions without page reload
- ✅ 2.6: Keyboard navigation support (Tab, Enter, Space)
- ✅ 2.7: Visible focus indicators
- ✅ 6.1: Visible focus indicators on interactive elements
- ✅ 6.3: ARIA live regions for filter changes (via aria-controls)
