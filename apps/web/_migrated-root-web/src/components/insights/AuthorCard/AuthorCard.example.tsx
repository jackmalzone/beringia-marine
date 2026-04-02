/**
 * AuthorCard Component Examples
 *
 * This file demonstrates various usage patterns for the AuthorCard component.
 */

import AuthorCard from './AuthorCard';
import { Author } from '@/types/insights';

// Example 1: Simple string author
export function SimpleAuthorExample() {
  return (
    <div>
      <h3>Simple String Author</h3>
      <AuthorCard author="Vital Ice Team" />
    </div>
  );
}

// Example 2: Full author with all details
export function FullAuthorExample() {
  const author: Author = {
    name: 'Dr. Sarah Chen',
    role: 'Sports Medicine Specialist',
    bio: 'Dr. Chen specializes in recovery science and has published over 30 peer-reviewed papers on cold therapy and athletic performance.',
    avatar: 'https://media.vitalicesf.com/insights/authors/sarah-chen.jpg',
    social: {
      twitter: 'https://twitter.com/drsarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen-md',
      website: 'https://sarahchenmd.com',
    },
  };

  return (
    <div>
      <h3>Full Author Object</h3>
      <AuthorCard author={author} />
    </div>
  );
}

// Example 3: Author with avatar but no social links
export function AuthorWithAvatarExample() {
  const author: Author = {
    name: 'Michael Rodriguez',
    role: 'Certified Recovery Coach',
    bio: 'Michael has over 15 years of experience helping athletes optimize their recovery protocols.',
    avatar: 'https://media.vitalicesf.com/insights/authors/michael-rodriguez.jpg',
  };

  return (
    <div>
      <h3>Author with Avatar (No Social Links)</h3>
      <AuthorCard author={author} />
    </div>
  );
}

// Example 4: Author with minimal information
export function MinimalAuthorExample() {
  const author: Author = {
    name: 'Emma Thompson',
    role: 'Wellness Writer',
  };

  return (
    <div>
      <h3>Minimal Author Information</h3>
      <AuthorCard author={author} />
    </div>
  );
}

// Example 5: Author with only Twitter
export function AuthorWithTwitterExample() {
  const author: Author = {
    name: 'Alex Kim',
    role: 'Fitness Enthusiast',
    bio: 'Sharing my journey with cold therapy and recovery.',
    social: {
      twitter: 'https://twitter.com/alexkim',
    },
  };

  return (
    <div>
      <h3>Author with Twitter Only</h3>
      <AuthorCard author={author} />
    </div>
  );
}

// Example 6: Author with custom styling
export function CustomStyledAuthorExample() {
  const author: Author = {
    name: 'Dr. Lisa Martinez',
    role: 'Neuroscience Researcher',
    bio: 'Exploring the cognitive benefits of thermal therapy.',
    avatar: 'https://media.vitalicesf.com/insights/authors/lisa-martinez.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/lisamartinez-phd',
      website: 'https://lisamartinez.com',
    },
  };

  return (
    <div>
      <h3>Custom Styled Author Card</h3>
      <AuthorCard author={author} className="my-custom-class" />
    </div>
  );
}

// Example 7: Multiple authors in a grid
export function MultipleAuthorsExample() {
  const authors = [
    'Vital Ice Team',
    {
      name: 'Dr. Sarah Chen',
      role: 'Sports Medicine Specialist',
      avatar: 'https://media.vitalicesf.com/insights/authors/sarah-chen.jpg',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Recovery Coach',
      bio: 'Helping athletes optimize recovery.',
    },
  ];

  return (
    <div>
      <h3>Multiple Authors</h3>
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {authors.map((author, index) => (
          <AuthorCard key={index} author={author} />
        ))}
      </div>
    </div>
  );
}

// Example 8: Integration with ArticleData
export function ArticleIntegrationExample() {
  const article = {
    id: '1',
    title: 'The Science Behind Cold Plunge Therapy',
    author: {
      name: 'Dr. Sarah Chen',
      role: 'Sports Medicine Specialist',
      bio: 'Dr. Chen specializes in recovery science and has published over 30 peer-reviewed papers.',
      avatar: 'https://media.vitalicesf.com/insights/authors/sarah-chen.jpg',
      social: {
        twitter: 'https://twitter.com/drsarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen-md',
      },
    } as Author,
    // ... other article fields
  };

  return (
    <div>
      <h3>Article Integration</h3>
      <h1>{article.title}</h1>
      <AuthorCard author={article.author} />
    </div>
  );
}

// Example 9: Responsive layout
export function ResponsiveLayoutExample() {
  const author: Author = {
    name: 'Dr. James Wilson',
    role: 'Exercise Physiologist',
    bio: 'Researching the intersection of heat therapy and cardiovascular health.',
    avatar: 'https://media.vitalicesf.com/insights/authors/james-wilson.jpg',
    social: {
      twitter: 'https://twitter.com/drjameswilson',
      linkedin: 'https://linkedin.com/in/jameswilson-phd',
      website: 'https://jameswilsonphd.com',
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3>Responsive Layout (Resize to see mobile view)</h3>
      <AuthorCard author={author} />
    </div>
  );
}

// Example 10: Error handling (avatar fails to load)
export function ErrorHandlingExample() {
  const author: Author = {
    name: 'Dr. Rachel Green',
    role: 'Wellness Expert',
    bio: 'Passionate about holistic health and recovery.',
    avatar: 'https://invalid-url.com/nonexistent-avatar.jpg', // This will fail to load
    social: {
      website: 'https://rachelgreen.com',
    },
  };

  return (
    <div>
      <h3>Error Handling (Avatar fails to load)</h3>
      <p>The avatar will fail to load and show a placeholder icon instead.</p>
      <AuthorCard author={author} />
    </div>
  );
}
