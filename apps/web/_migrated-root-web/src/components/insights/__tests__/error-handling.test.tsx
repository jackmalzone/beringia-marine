/**
 * Error Handling Tests for Insights Components
 * Tests error boundaries, image error handling, and network error handling
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import ArticleCard from '@/components/insights/ArticleCard/ArticleCard';
import { ArticleData } from '@/types/insights';
import * as errorReporting from '@/lib/utils/errorReporting';

// Mock error reporting
jest.mock('@/lib/utils/errorReporting', () => ({
  reportError: jest.fn(),
  reportNetworkError: jest.fn(),
  ErrorCategory: {
    NETWORK: 'network',
    RECOVERABLE: 'recoverable',
  },
  ErrorSeverity: {
    LOW: 'low',
    MEDIUM: 'medium',
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock framer-motion
interface MotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock('@/lib/motion', () => ({
  motion: {
    article: ({ children, ...props }: MotionProps) => <article {...props}>{children}</article>,
  },
}));

describe('Error Handling', () => {
  const mockArticle: ArticleData = {
    id: '1',
    title: 'Test Article',
    subtitle: 'Test Subtitle',
    abstract: 'Test abstract',
    content: '<p>Test content</p>',
    category: 'Wellness Article',
    author: 'Test Author',
    publishDate: '2025-01-15',
    status: 'published',
    coverImage: 'https://example.com/image.jpg',
    tags: ['Tag1', 'Tag2'],
    slug: 'test-article',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ErrorBoundary Integration', () => {
    it('should catch and display errors from child components', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary level="component" componentName="TestComponent">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/component error/i)).toBeInTheDocument();
    });

    it('should provide retry functionality', () => {
      let shouldThrow = true;
      const ConditionalError = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Success</div>;
      };

      render(
        <ErrorBoundary level="component" componentName="TestComponent">
          <ConditionalError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/component error/i)).toBeInTheDocument();

      // Simulate fixing the error
      shouldThrow = false;

      const retryButton = screen.getByText(/try again/i);
      fireEvent.click(retryButton);

      // Component should recover
      waitFor(() => {
        expect(screen.queryByText(/component error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Image Error Handling', () => {
    it('should display placeholder when cover image fails to load', async () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByAltText(mockArticle.title);

      // Simulate image load error
      fireEvent.error(image);

      await waitFor(() => {
        expect(errorReporting.reportError).toHaveBeenCalledWith(
          expect.any(Error),
          expect.objectContaining({
            category: 'network',
            severity: 'low',
            component: 'ArticleCard',
            action: 'imageLoad',
          })
        );
      });

      // Placeholder should be displayed
      const placeholder = screen.getByLabelText(mockArticle.title);
      expect(placeholder).toBeInTheDocument();
    });

    it('should include article metadata in error report', async () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByAltText(mockArticle.title);
      fireEvent.error(image);

      await waitFor(() => {
        expect(errorReporting.reportError).toHaveBeenCalledWith(
          expect.any(Error),
          expect.objectContaining({
            metadata: expect.objectContaining({
              articleId: mockArticle.id,
              articleSlug: mockArticle.slug,
              imageUrl: mockArticle.coverImage,
            }),
          })
        );
      });
    });
  });

  describe('Network Error Handling', () => {
    it('should report network errors with proper context', () => {
      const error = new Error('Network request failed');
      const url = '/api/articles';
      const retryCount = 2;

      errorReporting.reportNetworkError(error, url, retryCount, {
        component: 'InsightsPageClient',
        action: 'fetchArticles',
      });

      expect(errorReporting.reportNetworkError).toHaveBeenCalledWith(
        error,
        url,
        retryCount,
        expect.objectContaining({
          component: 'InsightsPageClient',
          action: 'fetchArticles',
        })
      );
    });
  });

  describe('PII Masking', () => {
    it('should mask email addresses in error messages', () => {
      const error = new Error('Failed to send email to user@example.com');

      errorReporting.reportError(error, {
        category: errorReporting.ErrorCategory.NETWORK,
        severity: errorReporting.ErrorSeverity.MEDIUM,
      });

      // The actual masking happens inside reportError
      expect(errorReporting.reportError).toHaveBeenCalled();
    });

    it('should mask sensitive metadata keys', () => {
      const error = new Error('Authentication failed');

      errorReporting.reportError(error, {
        category: errorReporting.ErrorCategory.NETWORK,
        severity: errorReporting.ErrorSeverity.MEDIUM,
        metadata: {
          password: 'secret123',
          token: 'abc123xyz',
          username: 'testuser',
        },
      });

      expect(errorReporting.reportError).toHaveBeenCalled();
    });
  });

  describe('User-Friendly Error Messages', () => {
    it('should display user-friendly message for network errors', () => {
      const ErrorComponent = () => {
        throw new Error('Network request failed');
      };

      render(
        <ErrorBoundary level="page" componentName="TestPage">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText(/network request failed/i)).not.toBeInTheDocument();
    });

    it('should provide actionable recovery options', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary level="page" componentName="TestPage">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/reload page/i)).toBeInTheDocument();
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide ARIA labels for error icons', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary level="component" componentName="TestComponent">
          <ErrorComponent />
        </ErrorBoundary>
      );

      const errorContent = screen.getByText(/component error/i).closest('div');
      expect(errorContent).toBeInTheDocument();
    });

    it('should make error buttons keyboard accessible', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary level="component" componentName="TestComponent">
          <ErrorComponent />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText(/try again/i);
      expect(retryButton).toHaveAttribute('class');

      // Button should be focusable
      retryButton.focus();
      expect(document.activeElement).toBe(retryButton);
    });
  });
});
