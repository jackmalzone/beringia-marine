# Sanity CMS Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the Vital Ice Insights blog system from mock data to Sanity CMS. The migration enables content managers to create, edit, and publish articles through Sanity Studio without requiring code changes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Sanity Setup](#sanity-setup)
3. [Schema Definitions](#schema-definitions)
4. [GROQ Queries](#groq-queries)
5. [Image Handling](#image-handling)
6. [Webhook Configuration](#webhook-configuration)
7. [Environment Variables](#environment-variables)
8. [Migration Steps](#migration-steps)
9. [Testing](#testing)
10. [Rollback Plan](#rollback-plan)

## Prerequisites

Before starting the migration, ensure you have:

- Node.js 18+ installed
- Access to Sanity.io account (create at https://www.sanity.io)
- Cloudflare R2 bucket configured (for image CDN)
- Vercel deployment access (for webhook configuration)
- Basic understanding of GROQ query language

## Sanity Setup

### 1. Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### 2. Initialize Sanity Project

```bash
# Create a new Sanity project
cd vital-ice-website
sanity init

# Follow prompts:
# - Project name: Vital Ice Insights
# - Dataset: production
# - Output path: ./sanity
# - Schema template: Clean project
```

### 3. Install Required Packages

```bash
npm install @sanity/client @sanity/image-url next-sanity
npm install --save-dev @sanity/types
```

## Schema Definitions

### Article Schema

Create `sanity/schemas/article.ts`:

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(100),
      description: 'Article title (max 100 characters)',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: Rule => Rule.required().max(150),
      description: 'Brief subtitle (max 150 characters)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly identifier (auto-generated from title)',
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(300),
      description: 'Short description for listing page (2-3 sentences, max 300 characters)',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          type: 'code',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
            ],
          },
        },
      ],
      validation: Rule => Rule.required(),
      description: 'Full article content with rich text formatting',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required(),
      description: 'Article category',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: Rule => Rule.required(),
      description: 'Article author',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: Rule => Rule.required(),
      description: 'Date when article was/will be published',
    }),
    defineField({
      name: 'publishAt',
      title: 'Scheduled Publish Date',
      type: 'datetime',
      description: 'Optional: Schedule article to be published at a specific date/time',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Scheduled', value: 'scheduled' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
      description: 'Article publication status',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required(),
      description: 'Main cover image (recommended: 1200x630px)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: Rule => Rule.required().min(1).max(10),
      description: 'Topic tags for filtering and SEO (1-10 tags)',
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF Download URL',
      type: 'url',
      description: 'Optional: Link to downloadable PDF version',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          validation: Rule => Rule.max(60),
          description: 'Custom title for search engines (max 60 characters)',
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160),
          description: 'Custom description for search engines (max 160 characters)',
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Custom image for social media sharing (1200x630px)',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'SEO keywords',
        },
      ],
      description: 'Custom SEO metadata (optional, falls back to article data)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
      status: 'status',
      category: 'category.name',
    },
    prepare({ title, subtitle, media, status, category }) {
      return {
        title,
        subtitle: `${status} • ${category} • ${subtitle}`,
        media,
      };
    },
  },
});
```

### Author Schema

Create `sanity/schemas/author.ts`:

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Author full name',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly identifier',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.max(500),
      description: 'Author biography (max 500 characters)',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Author role or title (e.g., "Wellness Expert", "Content Manager")',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: Rule => Rule.required(),
        },
      ],
      description: 'Author profile photo (recommended: 400x400px)',
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
          description: 'Twitter profile URL',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          description: 'LinkedIn profile URL',
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url',
          description: 'Personal website URL',
        },
      ],
      description: 'Social media links',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
});
```

### Category Schema

Create `sanity/schemas/category.ts`:

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule =>
        Rule.required().custom((name: string) => {
          const validCategories = [
            'Wellness Article',
            'Recovery Guide',
            'Research Summary',
            'Community Story',
          ];
          return validCategories.includes(name)
            ? true
            : `Category must be one of: ${validCategories.join(', ')}`;
        }),
      description: 'Category name (must match predefined categories)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly identifier',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Heart', value: 'heart' },
          { title: 'Refresh', value: 'refresh' },
          { title: 'Microscope', value: 'microscope' },
          { title: 'Users', value: 'users' },
        ],
      },
      validation: Rule => Rule.required(),
      description: 'Icon identifier for visual distinction',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      validation: Rule =>
        Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
          name: 'hex color',
          invert: false,
        }),
      description: 'Brand-aligned color (hex format, e.g., #00b7b5)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required().max(200),
      description: 'Category description (max 200 characters)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
});
```

### Schema Index

Create `sanity/schemas/index.ts`:

```typescript
import article from './article';
import author from './author';
import category from './category';

export const schemaTypes = [article, author, category];
```

Update `sanity/sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'vital-ice-insights',
  title: 'Vital Ice Insights',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
```

## GROQ Queries

### Sanity Client Setup

Create `src/lib/sanity/client.ts`:

```typescript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only needed for mutations
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

### Query Functions

Create `src/lib/sanity/queries.ts`:

```typescript
import { sanityClient } from './client';
import type { ArticleData, Author, ArticleCategory } from '@/types/insights';

/**
 * GROQ query for fetching all published articles
 */
const ALL_ARTICLES_QUERY = `
  *[_type == "article" && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    },
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    tags,
    "slug": slug.current,
    pdfUrl,
    seo {
      title,
      description,
      "ogImage": ogImage.asset->url,
      keywords
    }
  }
`;

/**
 * GROQ query for fetching a single article by slug
 */
const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )][0] {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    },
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    tags,
    "slug": slug.current,
    pdfUrl,
    seo {
      title,
      description,
      "ogImage": ogImage.asset->url,
      keywords
    }
  }
`;

/**
 * GROQ query for fetching articles by category
 */
const ARTICLES_BY_CATEGORY_QUERY = `
  *[_type == "article" && category->name == $category && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    content,
    "category": category->name,
    "author": author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    },
    publishDate,
    publishAt,
    status,
    "coverImage": coverImage.asset->url,
    tags,
    "slug": slug.current,
    pdfUrl,
    seo {
      title,
      description,
      "ogImage": ogImage.asset->url,
      keywords
    }
  }
`;

/**
 * GROQ query for fetching all categories with article counts
 */
const ACTIVE_CATEGORIES_QUERY = `
  *[_type == "category"] {
    name,
    icon,
    color,
    description,
    "articleCount": count(*[_type == "article" && references(^._id) && (
      status == "published" || 
      (status == "scheduled" && publishAt <= now())
    )])
  }[articleCount > 0]
`;

/**
 * GROQ query for searching articles
 */
const SEARCH_ARTICLES_QUERY = `
  *[_type == "article" && (
    title match $query || 
    abstract match $query || 
    $query in tags
  ) && (
    status == "published" || 
    (status == "scheduled" && publishAt <= now())
  )] | order(publishDate desc) {
    _id,
    title,
    subtitle,
    abstract,
    "category": category->name,
    "author": author->{
      name,
      bio,
      role,
      "avatar": avatar.asset->url,
      social
    },
    publishDate,
    "coverImage": coverImage.asset->url,
    tags,
    "slug": slug.current
  }
`;

/**
 * Fetch all published articles
 */
export async function getAllArticles(): Promise<ArticleData[]> {
  try {
    const articles = await sanityClient.fetch(ALL_ARTICLES_QUERY);
    return articles.map(transformArticle);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleData | null> {
  try {
    const article = await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug });
    return article ? transformArticle(article) : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(category: string): Promise<ArticleData[]> {
  try {
    const articles = await sanityClient.fetch(ARTICLES_BY_CATEGORY_QUERY, { category });
    return articles.map(transformArticle);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

/**
 * Fetch active categories (categories with published articles)
 */
export async function getActiveCategories(): Promise<ArticleCategory[]> {
  try {
    const categories = await sanityClient.fetch(ACTIVE_CATEGORIES_QUERY);
    return categories.map((cat: any) => cat.name);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<ArticleData[]> {
  try {
    const articles = await sanityClient.fetch(SEARCH_ARTICLES_QUERY, {
      query: `*${query}*`,
    });
    return articles.map(transformArticle);
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

/**
 * Transform Sanity article data to ArticleData format
 */
function transformArticle(article: any): ArticleData {
  return {
    id: article._id,
    title: article.title,
    subtitle: article.subtitle,
    abstract: article.abstract,
    content: portableTextToHtml(article.content),
    category: article.category,
    author: article.author,
    publishDate: article.publishDate,
    publishAt: article.publishAt,
    status: article.status,
    coverImage: article.coverImage,
    tags: article.tags,
    slug: article.slug,
    pdfUrl: article.pdfUrl,
    readingTime: calculateReadingTime(article.content),
    seo: article.seo,
  };
}

/**
 * Convert Portable Text to HTML
 * Note: Use @portabletext/react for production
 */
function portableTextToHtml(portableText: any[]): string {
  // Simplified conversion - use @portabletext/react in production
  return portableText
    .map(block => {
      if (block._type === 'block') {
        const text = block.children.map((child: any) => child.text).join('');
        return `<p>${text}</p>`;
      }
      return '';
    })
    .join('\n');
}

/**
 * Calculate reading time based on content
 */
function calculateReadingTime(content: any[]): number {
  const wordsPerMinute = 200;
  const textContent = content
    .filter(block => block._type === 'block')
    .map(block => block.children.map((child: any) => child.text).join(' '))
    .join(' ');
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

## Image Handling

### Sanity Image CDN

Sanity provides a powerful image CDN with automatic optimization. Here's how to use it:

#### Image URL Builder

```typescript
import { urlFor } from '@/lib/sanity/client';

// Basic usage
const imageUrl = urlFor(article.coverImage).url();

// With transformations
const optimizedUrl = urlFor(article.coverImage)
  .width(1200)
  .height(630)
  .quality(90)
  .format('webp')
  .url();

// Responsive images
const srcSet = [
  urlFor(article.coverImage).width(400).url() + ' 400w',
  urlFor(article.coverImage).width(800).url() + ' 800w',
  urlFor(article.coverImage).width(1200).url() + ' 1200w',
].join(', ');
```

#### Image Component Integration

Update `src/components/insights/ArticleCard/ArticleCard.tsx`:

```typescript
import { urlFor } from '@/lib/sanity/client';

export default function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = urlFor(article.coverImage)
    .width(800)
    .height(450)
    .quality(85)
    .format('webp')
    .url();

  return (
    <article className={styles.card}>
      <div className={styles.card__imageContainer}>
        <img
          src={imageUrl}
          alt={article.title}
          className={styles.card__image}
          loading="lazy"
          width={800}
          height={450}
        />
        {/* ... rest of component */}
      </div>
    </article>
  );
}
```

#### Portable Text Image Rendering

Install required package:

```bash
npm install @portabletext/react
```

Create `src/lib/sanity/portableText.tsx`:

```typescript
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { urlFor } from './client';

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)
        .width(1200)
        .quality(90)
        .format('webp')
        .url();

      return (
        <figure>
          <img
            src={imageUrl}
            alt={value.alt || 'Article image'}
            loading="lazy"
            width={1200}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }) => {
      return (
        <pre>
          <code className={`language-${value.language}`}>
            {value.code}
          </code>
        </pre>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} target={value.blank ? '_blank' : undefined}>
          {children}
        </a>
      );
    },
  },
};

// Usage in ArticleContent component
export function renderPortableText(content: any) {
  return <PortableText value={content} components={portableTextComponents} />;
}
```

### Image Upload Best Practices

1. **Recommended Dimensions:**
   - Cover images: 1200x630px (Open Graph standard)
   - Author avatars: 400x400px
   - Content images: Max width 1200px

2. **File Formats:**
   - Upload: JPEG or PNG
   - Delivery: WebP (automatic via Sanity CDN)

3. **Alt Text:**
   - Always required for accessibility
   - Descriptive and concise

4. **Hotspot:**
   - Enable hotspot for cover images
   - Ensures proper cropping on different aspect ratios

## Webhook Configuration

### On-Demand Revalidation

Set up webhooks to trigger Next.js revalidation when content changes in Sanity.

#### 1. Create Revalidation API Route

Create `src/app/api/revalidate/route.ts`:

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.SANITY_REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Revalidate based on document type
    if (_type === 'article') {
      // Revalidate listing page
      revalidatePath('/insights');

      // Revalidate specific article page if slug exists
      if (slug?.current) {
        revalidatePath(`/insights/${slug.current}`);
      }

      console.log(`Revalidated: /insights and /insights/${slug?.current}`);
    }

    if (_type === 'category' || _type === 'author') {
      // Revalidate all insights pages
      revalidatePath('/insights');
      console.log('Revalidated: /insights');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}
```

#### 2. Configure Sanity Webhook

1. Go to Sanity Management Console: https://www.sanity.io/manage
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name:** Vercel Revalidation
   - **URL:** `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - **Dataset:** production
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type == "article" || _type == "category" || _type == "author"`
   - **Projection:** `{ _type, "slug": slug }`
   - **HTTP method:** POST
   - **API version:** v2021-03-25

6. Save webhook

#### 3. Test Webhook

```bash
# Test revalidation endpoint
curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type":"article","slug":{"current":"test-article"}}'
```

### Alternative: Time-Based Revalidation

If webhooks are not feasible, use ISR with time-based revalidation:

```typescript
// src/app/insights/page.tsx
export const revalidate = 3600; // Revalidate every hour

// src/app/insights/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

## Environment Variables

### Required Environment Variables

Add the following to your `.env.local` file:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
SANITY_REVALIDATION_SECRET=your_webhook_secret

# Optional: Sanity Studio URL
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```

### Getting Sanity Credentials

#### 1. Project ID and Dataset

```bash
# Run in your sanity directory
cd sanity
sanity manage

# Or find in sanity.config.ts
```

#### 2. API Token

1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Configure:
   - **Name:** Next.js Production
   - **Permissions:** Viewer (read-only) or Editor (if mutations needed)
6. Copy token immediately (shown only once)

#### 3. Revalidation Secret

Generate a secure random string:

```bash
# Generate random secret
openssl rand -base64 32
```

### Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable for Production, Preview, and Development
4. Redeploy to apply changes

### Local Development

Create `.env.local` in project root:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

**Important:** Never commit `.env.local` to version control!

## Migration Steps

### Phase 1: Setup (1-2 hours)

#### Step 1: Initialize Sanity Project

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Initialize Sanity in your project
cd vital-ice-website
sanity init

# Follow prompts:
# - Create new project: Yes
# - Project name: Vital Ice Insights
# - Dataset: production
# - Output path: ./sanity
# - Schema template: Clean project
```

#### Step 2: Install Dependencies

```bash
# Install Sanity packages
npm install @sanity/client @sanity/image-url next-sanity @portabletext/react

# Install dev dependencies
npm install --save-dev @sanity/types
```

#### Step 3: Create Schema Files

Create the schema files as documented in the [Schema Definitions](#schema-definitions) section:

1. `sanity/schemas/article.ts`
2. `sanity/schemas/author.ts`
3. `sanity/schemas/category.ts`
4. `sanity/schemas/index.ts`
5. Update `sanity/sanity.config.ts`

#### Step 4: Deploy Sanity Studio

```bash
cd sanity
sanity deploy

# Choose a studio hostname (e.g., vital-ice-insights)
# Studio will be available at: https://vital-ice-insights.sanity.studio
```

### Phase 2: Data Migration (2-3 hours)

#### Step 5: Seed Initial Data

Create `sanity/scripts/seed.ts`:

```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your_project_id',
  dataset: 'production',
  token: 'your_api_token',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function seedData() {
  // Create categories
  const categories = [
    {
      _type: 'category',
      name: 'Wellness Article',
      slug: { current: 'wellness-article' },
      icon: 'heart',
      color: '#00b7b5',
      description: 'General wellness insights and lifestyle tips',
    },
    {
      _type: 'category',
      name: 'Recovery Guide',
      slug: { current: 'recovery-guide' },
      icon: 'refresh',
      color: '#2ECC71',
      description: 'Step-by-step recovery protocols and techniques',
    },
    {
      _type: 'category',
      name: 'Research Summary',
      slug: { current: 'research-summary' },
      icon: 'microscope',
      color: '#8B5CF6',
      description: 'Science-backed research and studies',
    },
    {
      _type: 'category',
      name: 'Community Story',
      slug: { current: 'community-story' },
      icon: 'users',
      color: '#F39C12',
      description: 'Member experiences and testimonials',
    },
  ];

  for (const category of categories) {
    await client.create(category);
    console.log(`Created category: ${category.name}`);
  }

  // Create default author
  const author = {
    _type: 'author',
    name: 'Vital Ice Team',
    slug: { current: 'vital-ice-team' },
    bio: 'The Vital Ice team is dedicated to sharing wellness insights and recovery research.',
    role: 'Content Team',
  };

  await client.create(author);
  console.log('Created default author');

  console.log('Seed data complete!');
}

seedData().catch(console.error);
```

Run the seed script:

```bash
cd sanity
npx tsx scripts/seed.ts
```

#### Step 6: Migrate Existing Articles

1. Open Sanity Studio: `https://your-project.sanity.studio`
2. Manually create articles from `src/lib/data/insights.ts`
3. Or create a migration script to automate the process

### Phase 3: Code Integration (3-4 hours)

#### Step 7: Create Sanity Client and Queries

Create the files as documented in the [GROQ Queries](#groq-queries) section:

1. `src/lib/sanity/client.ts`
2. `src/lib/sanity/queries.ts`
3. `src/lib/sanity/portableText.tsx`

#### Step 8: Update Data Layer

Replace mock data imports with Sanity queries:

**Before:**

```typescript
// src/app/insights/page.tsx
import { getAllArticles } from '@/lib/data/insights';
```

**After:**

```typescript
// src/app/insights/page.tsx
import { getAllArticles } from '@/lib/sanity/queries';
```

Update all files that import from `@/lib/data/insights`:

- `src/app/insights/page.tsx`
- `src/app/insights/InsightsPageClient.tsx`
- `src/app/insights/[slug]/page.tsx`

#### Step 9: Update Image Handling

Replace static image URLs with Sanity image URLs:

```typescript
// Before
<img src={article.coverImage} alt={article.title} />

// After
import { urlFor } from '@/lib/sanity/client';

<img
  src={urlFor(article.coverImage).width(800).format('webp').url()}
  alt={article.title}
/>
```

#### Step 10: Update Content Rendering

Replace HTML content rendering with Portable Text:

```typescript
// Before
<div dangerouslySetInnerHTML={{ __html: article.content }} />

// After
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/lib/sanity/portableText';

<PortableText value={article.content} components={portableTextComponents} />
```

### Phase 4: Webhook Setup (1 hour)

#### Step 11: Create Revalidation API Route

Create `src/app/api/revalidate/route.ts` as documented in [Webhook Configuration](#webhook-configuration).

#### Step 12: Configure Sanity Webhook

Follow the steps in [Webhook Configuration](#webhook-configuration) to set up the webhook in Sanity.

#### Step 13: Test Webhook

1. Create a test article in Sanity Studio
2. Verify webhook fires in Sanity dashboard
3. Check Next.js logs for revalidation
4. Verify article appears on website

### Phase 5: Testing and Validation (2-3 hours)

#### Step 14: Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- src/lib/sanity
npm test -- src/components/insights
```

#### Step 15: Manual Testing Checklist

- [ ] Create new article in Sanity Studio
- [ ] Verify article appears on listing page
- [ ] Verify article detail page renders correctly
- [ ] Test category filtering
- [ ] Test search functionality
- [ ] Verify images load correctly
- [ ] Test PDF downloads
- [ ] Verify SEO metadata
- [ ] Test on mobile devices
- [ ] Test with screen reader
- [ ] Verify webhook triggers revalidation

#### Step 16: Performance Testing

```bash
# Run Lighthouse audit
npm run lighthouse:audit

# Check bundle size
npm run build
npm run analyze
```

### Phase 6: Deployment (1 hour)

#### Step 17: Update Environment Variables

Add Sanity environment variables to Vercel:

1. Go to Vercel dashboard
2. Select project
3. Navigate to Settings → Environment Variables
4. Add all Sanity variables
5. Redeploy

#### Step 18: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: migrate insights to Sanity CMS"
git push origin main

# Vercel will auto-deploy
```

#### Step 19: Verify Production

1. Visit production site
2. Verify all articles load
3. Test creating new article in Sanity
4. Verify webhook revalidation works
5. Monitor Sentry for errors

### Phase 7: Cleanup (30 minutes)

#### Step 20: Remove Mock Data

Once Sanity is working in production:

```bash
# Backup mock data
mv src/lib/data/insights.ts src/lib/data/insights.backup.ts

# Or delete if no longer needed
rm src/lib/data/insights.ts
```

#### Step 21: Update Documentation

Update project README and documentation to reflect Sanity integration.

## Testing

### Unit Tests

Create `src/lib/sanity/__tests__/queries.test.ts`:

```typescript
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from '../queries';
import { sanityClient } from '../client';

jest.mock('../client', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

describe('Sanity Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllArticles', () => {
    it('should fetch and transform articles', async () => {
      const mockArticles = [
        {
          _id: '1',
          title: 'Test Article',
          slug: 'test-article',
          // ... other fields
        },
      ];

      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockArticles);

      const articles = await getAllArticles();

      expect(sanityClient.fetch).toHaveBeenCalledTimes(1);
      expect(articles).toHaveLength(1);
      expect(articles[0].id).toBe('1');
    });

    it('should handle fetch errors gracefully', async () => {
      (sanityClient.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const articles = await getAllArticles();

      expect(articles).toEqual([]);
    });
  });

  describe('getArticleBySlug', () => {
    it('should fetch article by slug', async () => {
      const mockArticle = {
        _id: '1',
        title: 'Test Article',
        slug: 'test-article',
      };

      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockArticle);

      const article = await getArticleBySlug('test-article');

      expect(sanityClient.fetch).toHaveBeenCalledWith(expect.any(String), { slug: 'test-article' });
      expect(article?.id).toBe('1');
    });

    it('should return null for non-existent article', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValue(null);

      const article = await getArticleBySlug('non-existent');

      expect(article).toBeNull();
    });
  });
});
```

### Integration Tests

Create `src/app/api/revalidate/__tests__/route.test.ts`:

```typescript
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('Revalidation API', () => {
  it('should reject requests without valid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate?secret=invalid');
    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('should revalidate on valid request', async () => {
    const request = new NextRequest(
      `http://localhost:3000/api/revalidate?secret=${process.env.SANITY_REVALIDATION_SECRET}`
    );

    // Mock request body
    jest.spyOn(request, 'json').mockResolvedValue({
      _type: 'article',
      slug: { current: 'test-article' },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.revalidated).toBe(true);
  });
});
```

### Manual Testing Checklist

#### Content Management

- [ ] Create new article in Sanity Studio
- [ ] Edit existing article
- [ ] Delete article
- [ ] Upload and crop cover image
- [ ] Add author with avatar
- [ ] Create category
- [ ] Schedule article for future publish
- [ ] Save article as draft

#### Frontend Display

- [ ] Articles appear on listing page
- [ ] Article detail page renders correctly
- [ ] Images load with proper optimization
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Pagination works (if implemented)
- [ ] Loading states display correctly
- [ ] Error states display correctly

#### SEO and Performance

- [ ] Meta tags are correct
- [ ] Open Graph images work
- [ ] Structured data validates
- [ ] Images are optimized (WebP)
- [ ] Lighthouse score > 90
- [ ] ISR/revalidation works

#### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] Color contrast meets WCAG AA

### Load Testing

Test Sanity API performance:

```bash
# Install k6 for load testing
brew install k6

# Create load test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://your-domain.com/insights');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
EOF

# Run load test
k6 run load-test.js
```

## Rollback Plan

### If Issues Occur During Migration

#### Option 1: Quick Rollback (5 minutes)

If critical issues occur, quickly revert to mock data:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or restore backup
git checkout main~1 -- src/lib/data/insights.ts
git commit -m "rollback: restore mock data"
git push origin main
```

#### Option 2: Feature Flag (Recommended)

Implement a feature flag to toggle between mock and Sanity data:

```typescript
// src/lib/config/features.ts
export const USE_SANITY_CMS = process.env.NEXT_PUBLIC_USE_SANITY === 'true';

// src/lib/data/insights-adapter.ts
import { USE_SANITY_CMS } from '@/lib/config/features';
import * as mockData from './insights';
import * as sanityData from '../sanity/queries';

export const getAllArticles = USE_SANITY_CMS ? sanityData.getAllArticles : mockData.getAllArticles;

export const getArticleBySlug = USE_SANITY_CMS
  ? sanityData.getArticleBySlug
  : mockData.getArticleBySlug;

// ... other functions
```

Toggle via environment variable:

```bash
# Enable Sanity
NEXT_PUBLIC_USE_SANITY=true

# Disable Sanity (use mock data)
NEXT_PUBLIC_USE_SANITY=false
```

#### Option 3: Gradual Migration

Migrate one page at a time:

1. Start with listing page only
2. Test thoroughly
3. Migrate article detail pages
4. Test thoroughly
5. Remove mock data

### Monitoring After Migration

#### 1. Set Up Alerts

Configure Sentry alerts for:

- Sanity API errors
- Image loading failures
- Revalidation failures
- High error rates

#### 2. Monitor Performance

Track key metrics:

- Page load time
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

#### 3. Check Logs

Monitor logs for:

- Sanity API rate limits
- Failed revalidations
- Image optimization errors
- GROQ query errors

### Common Issues and Solutions

#### Issue: Images Not Loading

**Cause:** Incorrect Sanity CDN URL or missing image asset

**Solution:**

```typescript
// Add fallback image
const imageUrl = article.coverImage
  ? urlFor(article.coverImage).url()
  : '/images/default-cover.jpg';
```

#### Issue: Webhook Not Triggering

**Cause:** Incorrect webhook URL or secret

**Solution:**

1. Verify webhook URL in Sanity dashboard
2. Check secret matches environment variable
3. Test webhook manually with curl
4. Check Vercel function logs

#### Issue: Slow Query Performance

**Cause:** Complex GROQ queries or large datasets

**Solution:**

1. Add indexes in Sanity
2. Optimize GROQ queries
3. Implement pagination
4. Use CDN caching

#### Issue: Content Not Updating

**Cause:** ISR cache not invalidating

**Solution:**

1. Verify webhook is firing
2. Check revalidation API logs
3. Manually trigger revalidation
4. Clear CDN cache if using one

### Emergency Contacts

- **Sanity Support:** support@sanity.io
- **Sanity Slack:** https://slack.sanity.io
- **Documentation:** https://www.sanity.io/docs
- **Status Page:** https://status.sanity.io

## Additional Resources

### Sanity Documentation

- **Getting Started:** https://www.sanity.io/docs/getting-started
- **GROQ Reference:** https://www.sanity.io/docs/groq
- **Image URLs:** https://www.sanity.io/docs/image-url
- **Webhooks:** https://www.sanity.io/docs/webhooks
- **Next.js Integration:** https://www.sanity.io/plugins/next-sanity

### Useful Sanity Plugins

```bash
# Install useful plugins
npm install @sanity/code-input
npm install @sanity/dashboard
npm install sanity-plugin-media
```

**Code Input:** Syntax-highlighted code blocks

```typescript
import { codeInput } from '@sanity/code-input';

export default defineConfig({
  plugins: [codeInput()],
});
```

**Media Library:** Better image management

```typescript
import { media } from 'sanity-plugin-media';

export default defineConfig({
  plugins: [media()],
});
```

### GROQ Playground

Test GROQ queries in the browser:

- https://www.sanity.io/docs/groq-playground
- Or use Vision plugin in Sanity Studio

### Example GROQ Queries

**Get articles with author and category:**

```groq
*[_type == "article"] {
  ...,
  "author": author->{name, bio, avatar},
  "category": category->{name, color, icon}
}
```

**Search with fuzzy matching:**

```groq
*[_type == "article" && [title, abstract] match $query]
```

**Get related articles:**

```groq
*[_type == "article" && category._ref == $categoryRef && _id != $currentId][0...3]
```

**Count articles by category:**

```groq
*[_type == "category"] {
  name,
  "count": count(*[_type == "article" && references(^._id)])
}
```

### Performance Optimization Tips

1. **Use CDN for Sanity API:**

   ```typescript
   const client = createClient({
     useCdn: true, // Enable for production
   });
   ```

2. **Implement Request Deduplication:**

   ```typescript
   import { cache } from 'react';

   export const getAllArticles = cache(async () => {
     return sanityClient.fetch(ALL_ARTICLES_QUERY);
   });
   ```

3. **Use Projection to Limit Data:**

   ```groq
   *[_type == "article"] {
     title,
     slug,
     coverImage,
     // Only fetch needed fields
   }
   ```

4. **Implement Pagination:**
   ```groq
   *[_type == "article"][0...10] // First 10 articles
   *[_type == "article"][10...20] // Next 10 articles
   ```

### Troubleshooting Commands

```bash
# Check Sanity CLI version
sanity --version

# List all datasets
sanity dataset list

# Export dataset
sanity dataset export production backup.tar.gz

# Import dataset
sanity dataset import backup.tar.gz production

# Check project info
sanity projects list

# Validate schema
sanity schema validate

# Clear local cache
rm -rf node_modules/.cache
```

### Migration Checklist Summary

- [ ] Sanity project initialized
- [ ] Schemas created and deployed
- [ ] Categories seeded
- [ ] Authors created
- [ ] Articles migrated
- [ ] Sanity client configured
- [ ] GROQ queries implemented
- [ ] Image handling updated
- [ ] Portable Text rendering implemented
- [ ] Revalidation API created
- [ ] Webhook configured
- [ ] Environment variables set
- [ ] Tests passing
- [ ] Manual testing complete
- [ ] Performance validated
- [ ] Deployed to production
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Mock data removed/archived

## Conclusion

This migration guide provides a comprehensive path from mock data to Sanity CMS. The migration enables:

- **Content Management:** Non-technical users can create and edit articles
- **Real-time Updates:** Webhooks trigger instant revalidation
- **Image Optimization:** Automatic image processing via Sanity CDN
- **Scalability:** Handle thousands of articles without code changes
- **Flexibility:** Rich content editing with Portable Text
- **Performance:** ISR and CDN caching for fast page loads

For questions or issues during migration, refer to the [Troubleshooting](#common-issues-and-solutions) section or contact the development team.

---

**Last Updated:** 2025-01-20  
**Version:** 1.0  
**Maintained By:** Vital Ice Development Team
