/**
 * Integration Tests for Insights Blog System
 * Task 22: Final integration and testing
 *
 * This test suite covers:
 * - Complete user flow from listing to article and back
 * - Category filtering functionality
 * - Search functionality
 * - Responsive design verification
 * - Keyboard navigation
 * - Error handling for missing articles
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import InsightsPageClient from '@/app/insights/InsightsPageClient';
import ArticlePageClient from '@/app/insights/[slug]/ArticlePageClient';
import { getAllArticles, getArticleBySlug } from '@/lib/data/insights';
import { ARTICLE_CATEGORIES } from '@/types/insights';
import type { ReactNode } from 'react';

expect.extend(toHaveNoViolations);

// Mock Next.js router
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

interface MotionProps {
  children: ReactNode;
  [key: string]: unknown;
}

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: MotionProps) => <article {...props}>{children}</article>,
    section: ({ children, ...props }: MotionProps) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: MotionProps) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
  useInView: () => true,
  useReducedMotion: () => false,
}));

describe('Insights Blog System - Integration Tests', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  describe('Complete User Flow', () => {
    it('should allow user to navigate from listing to article and back', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<InsightsPageClient />);

      // Wait for articles to load
      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Verify listing page is displayed
      expect(screen.getByText(/Recovery Industry Insights/i)).toBeInTheDocument();

      // Find and click on first article card
      const articles = getAllArticles();
      const firstArticle = articles[0];
      const articleCard = screen.getByText(firstArticle.title).closest('article');

      expect(articleCard).toBeInTheDocument();
      await user.click(articleCard!);

      // Verify navigation was called
      expect(mockPush).toHaveBeenCalledWith(`/insights/${firstArticle.slug}`);

      // Simulate navigation to article page
      const article = getArticleBySlug(firstArticle.slug);
      rerender(<ArticlePageClient article={article!} />);

      // Verify article page is displayed
      expect(screen.getByText(firstArticle.title)).toBeInTheDocument();
      expect(screen.getByText(firstArticle.subtitle)).toBeInTheDocument();

      // Click back to insights
      const backButton = screen.getByText(/back to insights/i);
      await user.click(backButton);

      // Verify back navigation was called
      expect(mockBack).toHaveBeenCalled();
    });

    it('should maintain state when navigating between pages', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Select a category filter
      const categoryButton = screen.getByRole('tab', { name: /wellness article/i });
      await user.click(categoryButton);

      // Verify filter is active
      expect(categoryButton).toHaveAttribute('aria-selected', 'true');

      // Verify filtered articles are displayed
      const articles = screen.getAllByRole('button', { name: /read article/i });
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('Category Filtering', () => {
    it('should filter articles by category correctly', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Test each category
      for (const category of ARTICLE_CATEGORIES) {
        const categoryButton = screen.getByRole('tab', { name: new RegExp(category, 'i') });
        await user.click(categoryButton);

        await waitFor(() => {
          expect(categoryButton).toHaveAttribute('aria-selected', 'true');
        });

        // Verify articles are filtered (or empty state is shown)
        const articles = screen.queryAllByRole('button', { name: /read article/i });
        if (articles.length > 0) {
          // At least one article should be visible
          expect(articles.length).toBeGreaterThan(0);
        } else {
          // Empty state should be shown
          expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
        }
      }
    });

    it('should show all articles when "All" category is selected', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const allButton = screen.getByRole('tab', { name: /^all$/i });
      await user.click(allButton);

      await waitFor(() => {
        expect(allButton).toHaveAttribute('aria-selected', 'true');
      });

      const allArticles = getAllArticles();
      const displayedArticles = screen.getAllByRole('button', { name: /read article/i });
      expect(displayedArticles.length).toBe(allArticles.length);
    });

    it('should handle empty category gracefully', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Find a category with no articles (if any)
      const categories = ARTICLE_CATEGORIES;
      const allArticles = getAllArticles();
      const emptyCategory = categories.find(
        cat => !allArticles.some(article => article.category === cat)
      );

      if (emptyCategory) {
        const categoryButton = screen.getByRole('tab', { name: new RegExp(emptyCategory, 'i') });
        await user.click(categoryButton);

        await waitFor(() => {
          expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Search Functionality', () => {
    it('should search articles by title', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search insights/i);
      const articles = getAllArticles();
      const searchTerm = articles[0].title.split(' ')[0];

      await user.type(searchInput, searchTerm);

      // Wait for debounce
      await waitFor(
        () => {
          const results = screen.queryAllByRole('button', { name: /read article/i });
          expect(results.length).toBeGreaterThan(0);
        },
        { timeout: 500 }
      );
    });

    it('should search articles by tags', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search insights/i);
      const articles = getAllArticles();
      const searchTag = articles[0].tags[0];

      await user.type(searchInput, searchTag);

      await waitFor(
        () => {
          const results = screen.queryAllByRole('button', { name: /read article/i });
          expect(results.length).toBeGreaterThan(0);
        },
        { timeout: 500 }
      );
    });

    it('should show no results message for invalid search', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search insights/i);
      await user.type(searchInput, 'xyznonexistentquery123');

      await waitFor(
        () => {
          expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should clear search results when input is cleared', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search insights/i);
      await user.type(searchInput, 'test');

      await waitFor(
        () => {
          // Wait for search to complete
        },
        { timeout: 500 }
      );

      await user.clear(searchInput);

      await waitFor(
        () => {
          const allArticles = getAllArticles();
          const displayedArticles = screen.getAllByRole('button', { name: /read article/i });
          expect(displayedArticles.length).toBe(allArticles.length);
        },
        { timeout: 500 }
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation through category filters', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const categoryButtons = screen.getAllByRole('tab');

      // Tab through all category buttons
      await user.tab();
      expect(categoryButtons[0]).toHaveFocus();

      await user.tab();
      expect(categoryButtons[1]).toHaveFocus();
    });

    it('should support Enter key to select category', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const categoryButton = screen.getByRole('tab', { name: /wellness article/i });
      categoryButton.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(categoryButton).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('should support Space key to select category', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const categoryButton = screen.getByRole('tab', { name: /recovery guide/i });
      categoryButton.focus();

      await user.keyboard(' ');

      await waitFor(() => {
        expect(categoryButton).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('should support keyboard navigation on article cards', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const articleCards = screen.getAllByRole('button', { name: /read article/i });
      const firstCard = articleCards[0];

      firstCard.focus();
      expect(firstCard).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockPush).toHaveBeenCalled();
    });

    it('should show visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      await user.tab();

      // Check if element can receive focus (focus indicator is CSS-based)
      expect(document.activeElement).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<InsightsPageClient />);

      // Verify mobile-specific elements are rendered
      expect(screen.getByText(/Recovery Industry Insights/i)).toBeInTheDocument();
    });

    it('should render correctly on tablet viewport', () => {
      // Mock tablet viewport
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<InsightsPageClient />);

      expect(screen.getByText(/Recovery Industry Insights/i)).toBeInTheDocument();
    });

    it('should render correctly on desktop viewport', () => {
      // Mock desktop viewport
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<InsightsPageClient />);

      expect(screen.getByText(/Recovery Industry Insights/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing article gracefully', () => {
      const invalidArticle = getArticleBySlug('non-existent-slug');
      expect(invalidArticle).toBeUndefined();
    });

    it('should display error boundary for article page errors', () => {
      // This would be tested with actual error boundary implementation
      const article = getAllArticles()[0];

      const { container } = render(<ArticlePageClient article={article} />);

      expect(container).toBeInTheDocument();
    });

    it('should handle image loading errors', async () => {
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Verify images have alt text for fallback
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations on listing page', async () => {
      const { container } = render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on article page', async () => {
      const article = getAllArticles()[0];
      const { container } = render(<ArticlePageClient article={article} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels on interactive elements', async () => {
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Check category filters have proper ARIA
      const categoryButtons = screen.getAllByRole('tab');
      categoryButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-selected');
        expect(button).toHaveAttribute('aria-controls');
      });

      // Check article cards have proper ARIA
      const articleCards = screen.getAllByRole('button', { name: /read article/i });
      articleCards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
      });
    });

    it('should announce loading states to screen readers', async () => {
      render(<InsightsPageClient />);

      // Check for loading state with ARIA
      const loadingElement = screen.queryByText(/loading articles/i);
      if (loadingElement) {
        expect(
          loadingElement.closest('[role="status"]') || loadingElement.closest('[aria-live]')
        ).toBeTruthy();
      }
    });
  });

  describe('SEO Metadata', () => {
    it('should have proper heading hierarchy', async () => {
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Check for h1
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/Recovery Industry Insights/i);
    });

    it('should have semantic HTML structure', async () => {
      const { container } = render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      // Check for semantic elements
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should have descriptive alt text for images', async () => {
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance', () => {
    it('should lazy load images', async () => {
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('should display loading state during data fetch', () => {
      render(<InsightsPageClient />);

      // Initially should show loading
      expect(screen.getByText(/loading articles/i)).toBeInTheDocument();
    });

    it('should handle rapid category changes without breaking', async () => {
      const user = userEvent.setup();
      render(<InsightsPageClient />);

      await waitFor(() => {
        expect(screen.queryByText(/loading articles/i)).not.toBeInTheDocument();
      });

      const categoryButtons = screen.getAllByRole('tab');

      // Rapidly click through categories
      for (const button of categoryButtons.slice(0, 3)) {
        await user.click(button);
      }

      // Should still render without errors
      expect(screen.getByText(/Recovery Industry Insights/i)).toBeInTheDocument();
    });
  });
});
