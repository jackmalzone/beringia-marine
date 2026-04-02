# SearchBar Component

## Overview

The `SearchBar` component provides a search interface for filtering insights articles by title, abstract, or tags. It features debounced search input, loading states, and accessible ARIA labels.

## Features

- **Debounced Search**: 300ms delay to prevent excessive searches while typing
- **Real-time Results**: Displays search results count and "no results" message
- **Loading State**: Shows spinner during search operations
- **Clear Functionality**: Button to clear search and return to category view
- **Accessibility**: Full ARIA labels, keyboard navigation, and screen reader support
- **Glassmorphism Design**: Matches the Vital Ice design system with backdrop blur effects

## Usage

```tsx
import SearchBar from '@/components/insights/SearchBar/SearchBar';

function MyComponent() {
  const handleSearchResults = (results: ArticleData[], query: string) => {
    // Handle search results
    setArticles(results);
  };

  const handleSearchClear = () => {
    // Handle search clear
    setArticles(getAllArticles());
  };

  return <SearchBar onSearchResults={handleSearchResults} onSearchClear={handleSearchClear} />;
}
```

## Props

| Prop              | Type                                              | Required | Description                                      |
| ----------------- | ------------------------------------------------- | -------- | ------------------------------------------------ |
| `onSearchResults` | `(results: ArticleData[], query: string) => void` | Yes      | Callback fired when search results are available |
| `onSearchClear`   | `() => void`                                      | Yes      | Callback fired when search is cleared            |

## Behavior

### Search Flow

1. User types in search input
2. Component waits 300ms after last keystroke (debounce)
3. Calls `searchArticles()` helper function
4. Displays loading spinner during search
5. Shows results count or "no results" message
6. Fires `onSearchResults` callback with results

### Clear Flow

1. User clicks clear button (X icon)
2. Clears input field
3. Resets results count
4. Fires `onSearchClear` callback

## Accessibility

- **ARIA Labels**: Search input has `aria-label="Search articles"`
- **ARIA Live Region**: Results status announced to screen readers with `aria-live="polite"`
- **ARIA Described By**: Input linked to results status with `aria-describedby`
- **Keyboard Support**: Full keyboard navigation with Tab, Enter, and Escape keys
- **Focus Indicators**: Visible focus outline on all interactive elements
- **Screen Reader Status**: Loading and results states announced automatically

## Styling

The component uses CSS modules with the following key features:

- Glassmorphism effect with `backdrop-filter: blur(20px)`
- Smooth transitions and hover states
- Responsive design for mobile, tablet, and desktop
- High contrast mode support
- Reduced motion support for accessibility

## Integration

The SearchBar is integrated into the `InsightsPageClient` component and positioned in the hero section below the category filter. When search is active, it overrides category filtering.

## Requirements Satisfied

- **1.1**: Search functionality for browsing insights
- **6.1**: Keyboard navigation support
- **6.2**: ARIA labels for accessibility
