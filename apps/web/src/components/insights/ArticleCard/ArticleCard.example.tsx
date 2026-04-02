/**
 * ArticleCard Component Examples
 *
 * This file demonstrates various use cases of the ArticleCard component.
 * Use this for visual testing and documentation purposes.
 */

import ArticleCard from './ArticleCard';
import { ArticleData } from '@/types/insights';

// Example 1: Standard article with all fields
export const StandardArticle = () => {
  const article: ArticleData = {
    id: '1',
    title: 'The Science Behind Cold Plunge Therapy',
    subtitle: 'Understanding the physiological benefits of cold exposure',
    abstract:
      'Discover how cold plunge therapy triggers powerful physiological responses that enhance recovery, boost mental clarity, and build resilience.',
    category: 'Research Summary',
    author: 'Dr. Sarah Chen',
    publishDate: '2025-01-15',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Cold Therapy', 'Recovery', 'Science'],
    slug: 'science-behind-cold-plunge-therapy',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 2: Wellness Article category
export const WellnessArticle = () => {
  const article: ArticleData = {
    id: '2',
    title: 'Building Healthy Habits That Last',
    subtitle: 'A practical guide to sustainable wellness',
    abstract:
      'Learn evidence-based strategies for creating lasting healthy habits that fit your lifestyle and support long-term wellness goals.',
    category: 'Wellness Article',
    author: 'Marcus Thompson',
    publishDate: '2025-01-10',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Wellness', 'Habits', 'Lifestyle'],
    slug: 'building-healthy-habits',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 3: Recovery Guide category
export const RecoveryGuide = () => {
  const article: ArticleData = {
    id: '3',
    title: 'Complete Sauna Protocol for Athletes',
    subtitle: 'Optimize your recovery with heat therapy',
    abstract:
      'A comprehensive guide to using sauna therapy for athletic recovery, including timing, duration, and best practices.',
    category: 'Recovery Guide',
    author: 'Coach Alex Rivera',
    publishDate: '2025-01-08',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Sauna', 'Recovery', 'Athletes', 'Performance'],
    slug: 'sauna-protocol-athletes',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 4: Community Story category
export const CommunityStory = () => {
  const article: ArticleData = {
    id: '4',
    title: 'From Burnout to Balance: My Recovery Journey',
    subtitle: 'A member shares their transformation story',
    abstract:
      'After years of overtraining and chronic fatigue, discover how one member found balance through consistent recovery practices.',
    category: 'Community Story',
    author: 'Jamie Peterson',
    publishDate: '2025-01-05',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Member Story', 'Recovery', 'Transformation'],
    slug: 'burnout-to-balance',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 5: Article with Author object
export const ArticleWithAuthorObject = () => {
  const article: ArticleData = {
    id: '5',
    title: 'The Neuroscience of Cold Exposure',
    subtitle: 'How cold therapy affects your brain',
    abstract:
      'Explore the fascinating neurological changes that occur during cold exposure and their impact on mental health and cognitive function.',
    category: 'Research Summary',
    author: {
      name: 'Dr. Emily Rodriguez',
      bio: 'Neuroscientist specializing in environmental stress adaptation',
      role: 'Research Director',
      avatar: 'https://example.org/placeholder-media',
    },
    publishDate: '2025-01-12',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Neuroscience', 'Cold Therapy', 'Mental Health'],
    slug: 'neuroscience-cold-exposure',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 6: Article with minimal tags
export const ArticleWithFewTags = () => {
  const article: ArticleData = {
    id: '6',
    title: 'Quick Recovery Tips for Busy Professionals',
    subtitle: 'Maximize recovery in minimal time',
    abstract:
      'Short on time? These evidence-based recovery strategies can be completed in 15 minutes or less.',
    category: 'Wellness Article',
    author: 'Sarah Kim',
    publishDate: '2025-01-14',
    coverImage: 'https://example.org/placeholder-media',
    tags: ['Quick Tips'],
    slug: 'quick-recovery-tips',
    content: '<p>Full content...</p>',
    status: 'published',
  };

  return <ArticleCard article={article} />;
};

// Example 7: Grid layout demonstration
export const ArticleGrid = () => {
  const articles: ArticleData[] = [
    {
      id: '1',
      title: 'The Science Behind Cold Plunge Therapy',
      subtitle: 'Understanding the physiological benefits',
      abstract: 'Discover how cold plunge therapy triggers powerful responses...',
      category: 'Research Summary',
      author: 'Dr. Sarah Chen',
      publishDate: '2025-01-15',
      coverImage: 'https://example.org/placeholder-media',
      tags: ['Cold Therapy', 'Recovery', 'Science'],
      slug: 'science-behind-cold-plunge-therapy',
      content: '<p>Content</p>',
      status: 'published',
    },
    {
      id: '2',
      title: 'Building a Daily Sauna Practice',
      subtitle: 'A comprehensive guide to heat therapy',
      abstract: 'Learn how to establish a sustainable sauna practice...',
      category: 'Recovery Guide',
      author: 'Marcus Thompson',
      publishDate: '2025-01-10',
      coverImage: 'https://example.org/placeholder-media',
      tags: ['Sauna', 'Heat Therapy', 'Wellness'],
      slug: 'building-daily-sauna-practice',
      content: '<p>Content</p>',
      status: 'published',
    },
    {
      id: '3',
      title: 'My Journey to Recovery',
      subtitle: 'A member transformation story',
      abstract: 'After years of pushing through pain, I discovered Premium Service Business...',
      category: 'Community Story',
      author: 'Alex Rivera',
      publishDate: '2025-01-05',
      coverImage: 'https://example.org/placeholder-media',
      tags: ['Member Story', 'Recovery', 'Transformation'],
      slug: 'my-journey-to-recovery',
      content: '<p>Content</p>',
      status: 'published',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        padding: '24px',
        background: '#000',
      }}
    >
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
