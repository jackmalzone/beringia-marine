# Insights Blog System - Test Coverage Suite

## Overview

This directory contains comprehensive test coverage for the Insights blog system. The test suite is organized to cover unit tests, component tests, integration tests, and accessibility tests.

## Test Structure

```
src/
├── lib/
│   └── data/
│       └── __tests__/
│           └── insights.test.ts          # Data layer unit tests
│
├── components/
│   └── insights/
│       ├── __tests__/
│       │   ├── integration.test.tsx      # Integration tests
│       │   ├── error-handling.test.tsx   # Error handling tests
│       │   └── README.md                 # This file
│       │
│       ├── ArticleCard/
│       │   └── __tests__/
│       │       └── ArticleCard.test.tsx  # ArticleCard component tests
│       │
│       ├── CategoryFilter/
│       │   └── __tests__/
│       │       └── CategoryFilter.test.tsx # CategoryFilter component tests
│       │
│       ├── SearchBar/
│       │   └── __tests__/
│       │       └── SearchBar.test.tsx    # SearchBar component tests
│       │
│       └── AuthorCard/
│           └── __tests__/
│               └── AuthorCard.test.tsx   # AuthorCard component tests
│
└── lib/
    └── seo/
        └── __tests__/
            └── insights-seo.test.ts      # SEO metadata tests
```

## Test Categories

### 1. Data Layer Tests (`src/lib/data/__tests__/insights.test.ts`)

Tests for the core data layer functionality:

- **getAllArticles()**: Verifies article filtering, status handling, and date sorting
- **getArticleBySlug()**: Tests article retrieval and draft/scheduled status checks
- **getArticlesByCategory()**: Validates category filtering logic
- **getActiveCategories()**: Ensures only categories with published content are returned
- **searchArticles()**: Tests fuzzy search by title, abstract, and tags
- **calculateReadingTime()**: Validates reading time calculation
- **Mock Data Integrity**: Ensures sample data meets requirements

**Requirements Covered**: 8.1, 8.2, 8.6, 8.7

### 2. Component Tests

#### ArticleCard (`src/components/insights/ArticleCard/__tests__/ArticleCard.test.tsx`)

Tests for the article card component:

- **Rendering**: Verifies all article information is displayed correctly
- **Navigation**: Tests click and keyboard navigation (Enter, Space)
- **Accessibility**: Validates ARIA labels, focus management, and keyboard support
- **Edge Cases**: Handles missing tags, author objects, and different categories

**Requirements Covered**: 1.3, 1.4, 1.5, 5.5, 6.1, 6.2, 6.4, 7.2, 9.3, 9.4

#### CategoryFilter (`src/components/insights/CategoryFilter/__tests__/CategoryFilter.test.tsx`)

Tests for the category filter component:

- **Rendering**: Ensures all category buttons are displayed
- **Selection**: Tests category selection and active state styling
- **Keyboard Navigation**: Validates Tab, Enter, and Space key support
- **Accessibility**: Verifies ARIA attributes (role, aria-selected, aria-controls)

**Requirements Covered**: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.1, 6.3

#### SearchBar (`src/components/insights/SearchBar/__tests__/SearchBar.test.tsx`)

Tests for the search functionality:

- **Search Input**: Tests debouncing and search query handling
- **Results Display**: Validates search results count and empty states
- **Accessibility**: Ensures proper ARIA labels and keyboard support

**Requirements Covered**: 1.1, 6.1, 6.2

#### AuthorCard (`src/components/insights/AuthorCard/__tests__/AuthorCard.test.tsx`)

Tests for the author card component:

- **Rendering**: Verifies author information display
- **Social Links**: Tests social media link rendering
- **Edge Cases**: Handles missing avatar, bio, and social links

**Requirements Covered**: 8.1, 8.6

### 3. Integration Tests (`src/components/insights/__tests__/integration.test.tsx`)

Comprehensive end-to-end tests covering:

- **Complete User Flow**: Navigation from listing to article and back
- **Category Filtering**: All category filters work correctly
- **Search Functionality**: Search by title, abstract, and tags
- **Responsive Design**: Mobile, tablet, and desktop viewports
- **Keyboard Navigation**: Full keyboard accessibility
- **Error Handling**: Missing articles and image loading errors
- **Accessibility**: No axe violations, proper ARIA labels
- **SEO Metadata**: Heading hierarchy and semantic HTML
- **Performance**: Lazy loading and loading states

**Requirements Covered**: All requirements (comprehensive integration)

### 4. Error Handling Tests (`src/components/insights/__tests__/error-handling.test.tsx`)

Tests for error boundaries and error states:

- **Error Boundaries**: Validates error boundary behavior
- **404 Handling**: Tests missing article pages
- **Network Errors**: Ensures graceful error handling
- **Image Errors**: Tests image fallback behavior

**Requirements Covered**: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8

### 5. SEO Tests (`src/lib/seo/__tests__/insights-seo.test.ts`)

Tests for SEO metadata and structured data:

- **Metadata Generation**: Validates Open Graph and Twitter Card tags
- **Structured Data**: Tests Article schema JSON-LD generation
- **Custom SEO Fields**: Ensures custom fields override defaults

**Requirements Covered**: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Data layer tests
npm test insights.test.ts

# Component tests
npm test ArticleCard.test.tsx
npm test CategoryFilter.test.tsx

# Integration tests
npm test integration.test.tsx

# Error handling tests
npm test error-handling.test.tsx
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

## Test Coverage Goals

The test suite aims for the following coverage:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Accessibility Testing

All component and integration tests include accessibility checks:

- **jest-axe**: Automated accessibility violation detection
- **ARIA Attributes**: Manual verification of ARIA labels and roles
- **Keyboard Navigation**: Tests for Tab, Enter, Space key support
- **Focus Management**: Ensures visible focus indicators
- **Screen Reader Support**: Validates semantic HTML and ARIA live regions

## Mocking Strategy

### Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
```

### Framer Motion

```typescript
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
```

### Lenis Smooth Scrolling

```typescript
jest.mock('@studio-freight/lenis', () => ({
  default: jest.fn(),
}));
```

## Best Practices

1. **Arrange-Act-Assert**: Follow AAA pattern for test structure
2. **Descriptive Names**: Use clear, descriptive test names
3. **Single Responsibility**: Each test should verify one behavior
4. **Avoid Implementation Details**: Test behavior, not implementation
5. **Use Testing Library Queries**: Prefer `getByRole` over `getByTestId`
6. **Async Handling**: Use `waitFor` for async operations
7. **Cleanup**: Tests should not affect each other (use `beforeEach`)

## Continuous Integration

Tests are automatically run on:

- **Pull Requests**: All tests must pass before merging
- **Pre-commit**: Husky runs tests on staged files
- **CI/CD Pipeline**: GitHub Actions runs full test suite

## Troubleshooting

### Common Issues

**Issue**: Tests timeout
**Solution**: Increase timeout or check for unresolved promises

**Issue**: Framer Motion errors
**Solution**: Ensure Framer Motion is properly mocked

**Issue**: Router navigation not working
**Solution**: Verify `useRouter` mock is set up correctly

**Issue**: Accessibility violations
**Solution**: Run `axe` locally and fix violations before committing

## Future Enhancements

- [ ] Visual regression testing with Percy or Chromatic
- [ ] Performance testing with Lighthouse CI
- [ ] E2E tests with Playwright or Cypress
- [ ] Snapshot testing for component rendering
- [ ] Mutation testing with Stryker

## Resources

- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Maintenance

This test suite should be updated whenever:

- New components are added
- Existing components are modified
- New features are implemented
- Requirements change
- Accessibility standards are updated

Last Updated: 2025-01-20
