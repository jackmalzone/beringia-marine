import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ArticleCard from '../ArticleCard';
import { ArticleData } from '@/types/insights';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('@/lib/motion', () => ({
  motion: {
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article {...props}>{children}</article>
    ),
  },
}));

describe('ArticleCard', () => {
  const mockPush = jest.fn();
  const mockArticle: ArticleData = {
    id: '1',
    title: 'Test Article Title',
    subtitle: 'Test Article Subtitle',
    abstract: 'This is a test abstract for the article card component.',
    category: 'Wellness Article',
    author: 'Test Author',
    publishDate: '2025-01-15',
    coverImage: 'https://example.com/test-image.jpg',
    tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4'],
    slug: 'test-article-title',
    content: '<p>Test content</p>',
    status: 'published',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  describe('Rendering', () => {
    it('renders article information correctly', () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
      expect(screen.getByText('Test Article Subtitle')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test abstract for the article card component.')
      ).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Wellness Article')).toBeInTheDocument();
    });

    it('displays formatted publish date', () => {
      render(<ArticleCard article={mockArticle} />);

      // Date formatting may vary by timezone, so check for the date element
      const dateElement = screen.getByText(/January \d+, 2025/);
      expect(dateElement).toBeInTheDocument();
    });

    it('displays cover image with correct alt text', () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByAltText('Test Article Title');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('displays first 3 tags only', () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
      expect(screen.getByText('Tag3')).toBeInTheDocument();
      expect(screen.queryByText('Tag4')).not.toBeInTheDocument();
    });

    it('displays category badge with correct color', () => {
      render(<ArticleCard article={mockArticle} />);

      const categoryBadge = screen.getByText('Wellness Article');
      expect(categoryBadge).toHaveStyle({ backgroundColor: '#00b7b5' });
    });

    it('handles author object correctly', () => {
      const articleWithAuthorObject: ArticleData = {
        ...mockArticle,
        author: {
          name: 'Dr. Jane Smith',
          bio: 'Expert in wellness',
          role: 'Wellness Coach',
        },
      };

      render(<ArticleCard article={articleWithAuthorObject} />);

      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to article page on click', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(mockPush).toHaveBeenCalledWith('/insights/test-article-title');
    });

    it('navigates on Enter key press', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/insights/test-article-title');
    });

    it('navigates on Space key press', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });

      expect(mockPush).toHaveBeenCalledWith('/insights/test-article-title');
    });

    it('does not navigate on other key presses', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Tab' });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'Read article: Test Article Title');
    });

    it('is keyboard focusable', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has button role for screen readers', () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles articles with no tags', () => {
      const articleWithoutTags: ArticleData = {
        ...mockArticle,
        tags: [],
      };

      render(<ArticleCard article={articleWithoutTags} />);

      expect(screen.queryByText('Tag1')).not.toBeInTheDocument();
    });

    it('handles articles with fewer than 3 tags', () => {
      const articleWithFewTags: ArticleData = {
        ...mockArticle,
        tags: ['OnlyTag'],
      };

      render(<ArticleCard article={articleWithFewTags} />);

      expect(screen.getByText('OnlyTag')).toBeInTheDocument();
    });

    it('handles different category colors', () => {
      const researchArticle: ArticleData = {
        ...mockArticle,
        category: 'Research Summary',
      };

      render(<ArticleCard article={researchArticle} />);

      const categoryBadge = screen.getByText('Research Summary');
      expect(categoryBadge).toHaveStyle({ backgroundColor: '#8B5CF6' });
    });
  });
});
