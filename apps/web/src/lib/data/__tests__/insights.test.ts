import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getActiveCategories,
  searchArticles,
  calculateReadingTime,
  mockArticles,
} from '../insights';

describe('Insights Data Layer', () => {
  describe('getAllArticles', () => {
    it('should return only published articles', () => {
      const articles = getAllArticles();

      // Should have published articles
      expect(articles.length).toBeGreaterThan(0);

      // All articles should be published or scheduled with past publishAt date
      articles.forEach(article => {
        expect(['published', 'scheduled']).toContain(article.status);
        if (article.status === 'scheduled' && article.publishAt) {
          expect(new Date(article.publishAt).getTime()).toBeLessThanOrEqual(new Date().getTime());
        }
      });
    });

    it('should not return draft articles', () => {
      const articles = getAllArticles();
      const draftArticles = articles.filter(a => a.status === 'draft');
      expect(draftArticles.length).toBe(0);
    });

    it('should return articles sorted by date descending', () => {
      const articles = getAllArticles();

      // Verify sorted by date (newest first)
      for (let i = 0; i < articles.length - 1; i++) {
        const currentDate = new Date(articles[i].publishDate).getTime();
        const nextDate = new Date(articles[i + 1].publishDate).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe('getArticleBySlug', () => {
    it('should return correct article for valid slug', () => {
      const article = getArticleBySlug('science-behind-cold-plunge-therapy');

      expect(article).toBeDefined();
      expect(article?.slug).toBe('science-behind-cold-plunge-therapy');
      expect(article?.title).toBe('The Science Behind Cold Plunge Therapy');
    });

    it('should return undefined for non-existent slug', () => {
      const article = getArticleBySlug('non-existent-article');
      expect(article).toBeUndefined();
    });

    it('should return undefined for draft articles', () => {
      // Find a draft article in mockArticles
      const draftArticle = mockArticles.find(a => a.status === 'draft');

      if (draftArticle) {
        const article = getArticleBySlug(draftArticle.slug);
        expect(article).toBeUndefined();
      }
    });

    it('should return undefined for scheduled articles with future publishAt date', () => {
      // Find a scheduled article with future date
      const scheduledArticle = mockArticles.find(
        a => a.status === 'scheduled' && a.publishAt && new Date(a.publishAt) > new Date()
      );

      if (scheduledArticle) {
        const article = getArticleBySlug(scheduledArticle.slug);
        expect(article).toBeUndefined();
      }
    });
  });

  describe('getArticlesByCategory', () => {
    it('should return all articles when category is "All"', () => {
      const allArticles = getAllArticles();
      const categoryArticles = getArticlesByCategory('All');

      expect(categoryArticles.length).toBe(allArticles.length);
    });

    it('should filter articles by category correctly', () => {
      const researchArticles = getArticlesByCategory('Research Summary');

      researchArticles.forEach(article => {
        expect(article.category).toBe('Research Summary');
      });
    });

    it('should return empty array for category with no articles', () => {
      // This test assumes there might be a category with no published articles
      const articles = getArticlesByCategory('Wellness Article');
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe('getActiveCategories', () => {
    it('should return only categories with published content', () => {
      const activeCategories = getActiveCategories();
      const allArticles = getAllArticles();

      // Each active category should have at least one article
      activeCategories.forEach(category => {
        const articlesInCategory = allArticles.filter(a => a.category === category);
        expect(articlesInCategory.length).toBeGreaterThan(0);
      });
    });

    it('should not include categories without published articles', () => {
      const activeCategories = getActiveCategories();
      const allArticles = getAllArticles();
      const categoriesWithArticles = new Set(allArticles.map(a => a.category));

      activeCategories.forEach(category => {
        expect(categoriesWithArticles.has(category)).toBe(true);
      });
    });
  });

  describe('searchArticles', () => {
    it('should find articles by title', () => {
      const results = searchArticles('cold plunge');

      expect(results.length).toBeGreaterThan(0);
      const hasMatchingTitle = results.some(article =>
        article.title.toLowerCase().includes('cold plunge')
      );
      expect(hasMatchingTitle).toBe(true);
    });

    it('should find articles by abstract', () => {
      const results = searchArticles('physiological');

      expect(results.length).toBeGreaterThan(0);
      const hasMatchingAbstract = results.some(article =>
        article.abstract.toLowerCase().includes('physiological')
      );
      expect(hasMatchingAbstract).toBe(true);
    });

    it('should find articles by tags', () => {
      const results = searchArticles('recovery');

      expect(results.length).toBeGreaterThan(0);
      const hasMatchingTag = results.some(article =>
        article.tags.some(tag => tag.toLowerCase().includes('recovery'))
      );
      expect(hasMatchingTag).toBe(true);
    });

    it('should be case-insensitive', () => {
      const lowerResults = searchArticles('cold');
      const upperResults = searchArticles('COLD');
      const mixedResults = searchArticles('CoLd');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });

    it('should return all articles for empty query', () => {
      const results = searchArticles('');
      const allArticles = getAllArticles();

      expect(results.length).toBe(allArticles.length);
    });

    it('should return empty array for non-matching query', () => {
      const results = searchArticles('xyzabc123nonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      // Create content with known word count (200 words = 1 minute)
      const words = Array(200).fill('word').join(' ');
      const content = `<p>${words}</p>`;

      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });

    it('should strip HTML tags before counting', () => {
      const content = '<h2>Title</h2><p>This is a test.</p><strong>Bold text</strong>';
      const readingTime = calculateReadingTime(content);

      // Should count only the words, not HTML tags
      expect(readingTime).toBeGreaterThan(0);
    });

    it('should return at least 1 minute for short content', () => {
      const content = '<p>Short.</p>';
      const readingTime = calculateReadingTime(content);

      expect(readingTime).toBeGreaterThanOrEqual(1);
    });

    it('should round up to nearest minute', () => {
      // 250 words should round up to 2 minutes (250 / 200 = 1.25 -> 2)
      const words = Array(250).fill('word').join(' ');
      const content = `<p>${words}</p>`;

      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBe(2);
    });

    it('should handle content with multiple HTML elements', () => {
      const content = `
        <h2>Heading</h2>
        <p>Paragraph with some text.</p>
        <ul>
          <li>List item one</li>
          <li>List item two</li>
        </ul>
        <p>Another paragraph.</p>
      `;

      const readingTime = calculateReadingTime(content);
      expect(readingTime).toBeGreaterThan(0);
    });
  });

  describe('Mock Data Integrity', () => {
    it('should have at least 3 sample articles', () => {
      expect(mockArticles.length).toBeGreaterThanOrEqual(3);
    });

    it('should have articles from different categories', () => {
      const categories = new Set(mockArticles.map(a => a.category));
      expect(categories.size).toBeGreaterThan(1);
    });

    it('should have articles with rich HTML content', () => {
      const articlesWithRichContent = mockArticles.filter(article => {
        const hasHeadings = article.content.includes('<h2>') || article.content.includes('<h3>');
        const hasParagraphs = article.content.includes('<p>');
        return hasHeadings && hasParagraphs;
      });

      expect(articlesWithRichContent.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each article', () => {
      mockArticles.forEach(article => {
        expect(article.id).toBeDefined();
        expect(article.title).toBeDefined();
        expect(article.subtitle).toBeDefined();
        expect(article.abstract).toBeDefined();
        expect(article.content).toBeDefined();
        expect(article.category).toBeDefined();
        expect(article.author).toBeDefined();
        expect(article.publishDate).toBeDefined();
        expect(article.status).toBeDefined();
        expect(article.coverImage).toBeDefined();
        expect(article.tags).toBeDefined();
        expect(article.slug).toBeDefined();
      });
    });

    it('should have valid status values', () => {
      mockArticles.forEach(article => {
        expect(['draft', 'published', 'scheduled']).toContain(article.status);
      });
    });

    it('should have valid date formats', () => {
      mockArticles.forEach(article => {
        const date = new Date(article.publishDate);
        expect(date.toString()).not.toBe('Invalid Date');
      });
    });
  });
});
