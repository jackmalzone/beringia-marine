import { ArticleData, ArticleCategory, ARTICLE_CATEGORIES } from '@/types/insights';
import { templateRaster } from '@/lib/config/template-assets';
import {
  fetchAllArticles,
  fetchArticleBySlug,
  fetchArticlesByCategory,
  searchArticles as searchArticlesFromSanity,
} from '@/lib/sanity/queries/articles';
import { transformArticle, transformArticles } from '@/lib/sanity/transformers/articles';
import { sanitizeCmsHtml } from '@/lib/utils/sanitizeHtml';

function sanitizeArticleContent(article: ArticleData): ArticleData {
  const content = sanitizeCmsHtml(article.content || '');
  if (content === article.content) {
    return article;
  }
  return {
    ...article,
    content,
  };
}

function sanitizeArticleList(articles: ArticleData[]): ArticleData[] {
  return articles.map(sanitizeArticleContent);
}

// Mock article data
export const mockArticles: ArticleData[] = [
  {
    id: '9',
    title: 'Service One in Depth: What Clients Notice First',
    subtitle:
      'From the first greeting to the final follow-up, small signals add up to a premium impression.',
    abstract:
      'This template article walks through how a modern service studio can choreograph intake, pacing, and communication so every visit feels intentional—without relying on industry-specific jargon.',
    content: `
      <h2>Why the first five minutes matter</h2>
      <p>Clients decide whether a studio feels trustworthy long before anyone mentions a service menu. Lighting, sound, the way a host makes eye contact, and whether directions are crystal clear all send a signal: we are prepared, and you are in good hands.</p>

      <h2>Designing a calm intake</h2>
      <p>Strong teams treat intake as a conversation, not a form. They confirm goals, note constraints, and set expectations for time and flow. When questions feel relevant instead of generic, clients relax—and staff get the context they need to deliver consistently.</p>

      <ul>
        <li>Repeat the client's name once, naturally, early in the visit.</li>
        <li>Offer a single next step at a time so decisions feel light.</li>
        <li>Explain wait times or transitions before they happen.</li>
      </ul>

      <h2>Service One as a flagship</h2>
      <p>Even when you offer six distinct experiences, one offering usually anchors your reputation. Treat that flagship as the reference standard: training scripts, room setup, and follow-up should all ladder up to the same promise. <a href="/solutions">flagship program overview</a> is a useful placeholder in this template for that anchor experience.</p>

      <h2>Closing the loop</h2>
      <p>Premium service businesses win on memory. A short recap after the visit—what happened, what to expect next, and how to reach a human—reduces anxiety and builds habit. Pair that with an easy path to rebook and you turn a single visit into a relationship.</p>

      <h2>FAQs</h2>
      <h3>How long should onboarding copy be?</h3>
      <p>Short enough to scan, detailed enough to remove doubt. If clients still ask the same three questions at the front desk, your digital copy is probably too thin.</p>

      <h3>Should we personalize everything?</h3>
      <p>Personalize the moments that reduce risk: health notes, timing, preferences. Keep policy language consistent so teams do not improvise compliance.</p>

      <h3>What belongs on the website versus in person?</h3>
      <p>Use the site to set expectations and answer logistics. Save nuanced coaching for trained staff who can read the room.</p>
    `,
    category: 'Wellness Article',
    author: 'Editorial Team',
    publishDate: '2025-01-25',
    status: 'published',
    coverImage: templateRaster(20),
    tags: ['Client Experience', 'Operations', 'Service Design', 'Onboarding', 'Premium Brand'],
    slug: 'red-light-therapy-benefits-uses',
    seo: {
      title: 'Service One Spotlight: Premium Client Experience | Template Site',
      description:
        'Template guidance on intake, pacing, and follow-up for a high-end service studio—neutral copy you can adapt to any vertical.',
      ogImage: templateRaster(20),
    },
    readingTime: 8,
  },
  {
    id: '8',
    title: 'Building a Local Following Around a Modern Studio',
    subtitle: 'Community grows when shared rituals feel welcoming, not exclusive.',
    abstract:
      'Riverton clients gravitate toward studios that blend clear standards with neighborly warmth. This template story explains how to nurture regulars, welcome newcomers, and keep the room feeling premium.',
    content: `
      <h2>Start with a repeatable welcome</h2>
      <p>Community is not an accident; it is the product of a thousand small repeats. When every guest hears the same safety overview, sees the same tidy rooms, and knows exactly where to stash their things, the social energy can shine instead of splintering into confusion.</p>

      <h2>Create room for both solitude and serendipity</h2>
      <p>Some clients want quiet focus. Others want to nod hello between sessions. Layout and signage should protect both modes. Semi-private zones, gentle acoustics, and staff who read the room keep the tone elevated.</p>

      <h2>Host low-pressure touchpoints</h2>
      <ul>
        <li>Monthly office hours for questions about memberships or packages.</li>
        <li>Short guided tours for first-time visitors.</li>
        <li>Partner spotlights that highlight complementary local businesses.</li>
      </ul>

      <h2>Let digital tools echo the in-person vibe</h2>
      <p>Your site and confirmation emails should sound like your front desk: confident, warm, precise. When <a href="/solutions">your solutions narrative</a> mirrors what people actually feel onsite, trust compounds.</p>

      <h2>Measure community health lightly</h2>
      <p>Track return visits, referral mentions, and unsolicited compliments to staff. Those qualitative signals often arrive before revenue charts move.</p>

      <h2>FAQs</h2>
      <h3>Do we need a formal membership to build community?</h3>
      <p>No. Consistency matters more than contracts. A thoughtful drop-in experience can still create regulars.</p>

      <h3>How do we keep the studio from feeling cliquey?</h3>
      <p>Rotate introductions, train staff to include newcomers in group cues, and publish clear house rules that favor kindness over performance.</p>
    `,
    category: 'Community Story',
    author: 'Editorial Team',
    publishDate: '2025-01-23',
    status: 'published',
    coverImage: templateRaster(21),
    heroImageSplit: {
      left: templateRaster(22),
      right: templateRaster(23),
    },
    tags: ['Community', 'Riverton', 'Local Business', 'Hospitality', 'Retention'],
    slug: 'san-francisco-cold-plunge-community',
    seo: {
      title: 'Community-Led Growth for a Modern Studio | Template Site',
      description:
        'Template notes on welcoming rituals, inclusive spaces, and digital touchpoints that reinforce a premium neighborhood studio.',
      ogImage: templateRaster(21),
    },
    readingTime: 9,
  },
  {
    id: '7',
    title: 'Two Ways to Deliver Core Offerings: A Practical Comparison',
    subtitle:
      'Compare high-touch guided sessions with flexible self-directed visits—without locking into one industry metaphor.',
    abstract:
      'Every service business eventually chooses between tightly guided journeys and client-led exploration. This template article outlines trade-offs in staffing, throughput, and perceived value.',
    content: `
      <h2>Guided sessions: clarity at scale</h2>
      <p>When a specialist leads each visit, you control pacing, education, and risk. Clients feel looked after, and teams can standardize excellence. The trade-off is capacity: great guidance does not cheaply clone itself.</p>

      <h2>Self-directed visits: freedom with guardrails</h2>
      <p>Self-directed models ask clients to navigate more independently. Clear signage, intuitive equipment, and vigilant floor staff keep quality high. The upside is elasticity—more people can move through in the same footprint if the experience is designed well.</p>

      <h2>Environmental cues matter in both models</h2>
      <ul>
        <li>Temperature, lighting, and sound should match the promise on your marketing page.</li>
        <li>Recovery or transition spaces belong in the plan, not as an afterthought.</li>
        <li>Digital booking should reflect real availability so front desks are not firefighting.</li>
      </ul>

      <h2>Pricing psychology</h2>
      <p>Guided sessions often justify premium pricing because time is explicit. Self-directed visits can win on membership math if the facility feels abundant and well maintained. Pick the story that matches your operations—not the trend you saw online.</p>

      <h2>Choosing a lane</h2>
      <p>Most studios blend both: anchor offerings stay guided, while supporting services stay flexible. <a href="/solutions/advanced-navigation">Advanced Navigation</a> and <a href="/solutions/anchor-bot">Anchor Bot Marine</a> links illustrate routing to solution detail pages; replace labels when you ship your own catalog.</p>

      <h2>References</h2>
      <ul>
        <li>Internal playbook: training checklists for each modality.</li>
        <li>Client surveys: post-visit clarity and perceived wait time.</li>
        <li>Staffing model: coverage ratios during peak blocks.</li>
      </ul>
    `,
    category: 'Research Summary',
    author: 'Editorial Team',
    publishDate: '2025-01-22',
    status: 'published',
    coverImage:
      'https://pub-3fd38cef83ec4139b038b229662d7717.r2.dev/high-angle-view-couple-relaxing-with-eyes-closed-while-being-sauna-health-spa.jpg',
    heroImage: templateRaster(24),
    tags: ['Operations', 'Service Model', 'Pricing', 'Client Journey', 'Capacity Planning'],
    slug: 'infrared-vs-traditional-sauna',
    seo: {
      title: 'Guided vs. Self-Directed Service Models | Template Site',
      description:
        'Template comparison for studios weighing specialist-led sessions against flexible client-led visits.',
      ogImage:
        'https://pub-3fd38cef83ec4139b038b229662d7717.r2.dev/high-angle-view-couple-relaxing-with-eyes-closed-while-being-sauna-health-spa.jpg',
    },
    readingTime: 11,
  },
  {
    id: '6',
    title: 'Peak Season Without the Panic: Calm Operations for Busy Weeks',
    subtitle: 'When demand spikes, systems—not slogans—keep the experience premium.',
    abstract:
      'Retail holidays and local events can flood a studio with first-time visitors. This template guide outlines how to protect staff energy, set kind boundaries, and communicate clearly.',
    content: `
      <h2>Why busy weeks feel personal</h2>
      <p>Clients bring their own stress through the door. If your team mirrors that chaos, the brand feels fragile. If your team stays steady, the same rush reads as energy.</p>

      <h2>Front-load the basics</h2>
      <ul>
        <li>Pre-write SMS and email snippets for delays, sold-out slots, and parking reminders.</li>
        <li>Stage extra supplies where staff can reach them without leaving the floor.</li>
        <li>Assign a single decision-maker for exceptions so front desk and managers stay aligned.</li>
      </ul>

      <h2>Protect the flagship experience</h2>
      <p>When time is tight, shrink optional flourishes—not safety or cleanliness. If a usually chatty moment needs to be brief, script a graceful line so it still feels caring.</p>

      <h2>Offer a dignified opt-out</h2>
      <p>Some guests will realize mid-week that they need rest instead of another appointment. Make rescheduling kind and fast; it pays back in trust.</p>

      <h2>After the rush</h2>
      <p>Debrief with three questions: what broke, what saved us, and what will we automate before the next spike? <a href="/solutions">Program and offering pages</a> should be updated if anything material changed in flow or hours.</p>

      <figure>
        <img src="${templateRaster(25)}" alt="Calm studio interior placeholder image" />
        <figcaption>Quiet systems behind the scenes let public spaces stay composed.</figcaption>
      </figure>
    `,
    category: 'Wellness Article',
    author: 'Editorial Team',
    publishDate: '2025-01-20',
    status: 'published',
    coverImage: templateRaster(26),
    heroImageSplit: {
      left: templateRaster(27),
      right: templateRaster(28),
    },
    tags: ['Operations', 'Peak Season', 'Communication', 'Staffing', 'Client Care'],
    slug: 'black-friday-wellness-reset',
    seo: {
      title: 'High-Demand Weeks: Operations Playbook | Template Site',
      description:
        'Template strategies for busy periods—scripts, staging, and service recovery without sacrificing a premium feel.',
      ogImage: templateRaster(26),
    },
    readingTime: 7,
  },
];

/**
 * Get all published articles from Sanity, sorted by publish date (newest first)
 * Falls back to mock data if Sanity fetch fails
 * @returns Array of articles and metadata about data source
 */
export async function getAllArticles(): Promise<ArticleData[]> {
  const { articles: sanityArticles, fromSanity } = await fetchAllArticles();
  
  if (fromSanity && sanityArticles.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Using Sanity data: ${sanityArticles.length} articles`);
    }
    return transformArticles(sanityArticles);
  }

  // Fallback to mock data
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Using mock data fallback (Sanity unavailable or returned no articles)');
  }
  
  const now = new Date();
  return sanitizeArticleList(
    mockArticles
      .filter(article => {
      // Only show published articles or scheduled articles past their publishAt date
        if (article.status === 'draft') return false;
        if (article.status === 'scheduled' && article.publishAt) {
          return new Date(article.publishAt) <= now;
        }
        return article.status === 'published';
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  );
}

/**
 * Synchronous version for backward compatibility (uses mock data)
 * @deprecated Use async getAllArticles() instead
 */
export function getAllArticlesSync(): ArticleData[] {
  const now = new Date();
  return sanitizeArticleList(
    mockArticles
      .filter(article => {
        if (article.status === 'draft') return false;
        if (article.status === 'scheduled' && article.publishAt) {
          return new Date(article.publishAt) <= now;
        }
        return article.status === 'published';
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  );
}

/**
 * Get a single article by its slug from Sanity
 * Falls back to mock data if Sanity fetch fails
 */
export async function getArticleBySlug(slug: string): Promise<ArticleData | undefined> {
  const { article: sanityArticle, fromSanity } = await fetchArticleBySlug(slug);
  
  if (fromSanity && sanityArticle) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Using Sanity data for article: ${slug}`);
    }
    return transformArticle(sanityArticle);
  }

  // Fallback to mock data
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Using mock data fallback for article: ${slug}`);
  }
  
  const article = mockArticles.find(article => article.slug === slug);
  if (!article || article.status === 'draft') return undefined;

  // Check if scheduled article is ready to publish
  if (article.status === 'scheduled' && article.publishAt) {
    if (new Date(article.publishAt) > new Date()) return undefined;
  }

  return sanitizeArticleContent(article);
}

/**
 * Synchronous version for backward compatibility (uses mock data)
 * @deprecated Use async getArticleBySlug() instead
 */
export function getArticleBySlugSync(slug: string): ArticleData | undefined {
  const article = mockArticles.find(article => article.slug === slug);
  if (!article || article.status === 'draft') return undefined;

  if (article.status === 'scheduled' && article.publishAt) {
    if (new Date(article.publishAt) > new Date()) return undefined;
  }

  return sanitizeArticleContent(article);
}

/**
 * Get articles filtered by category from Sanity
 * Returns all published articles if category is "All"
 */
export async function getArticlesByCategory(category: string): Promise<ArticleData[]> {
  if (category === 'All') {
    return getAllArticles();
  }

  const { articles: sanityArticles, fromSanity } = await fetchArticlesByCategory(category);
  
  if (fromSanity && sanityArticles.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Using Sanity data for category: ${category} (${sanityArticles.length} articles)`);
    }
    return transformArticles(sanityArticles);
  }

  // Fallback to mock data
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Using mock data fallback for category: ${category}`);
  }
  
  const allArticles = await getAllArticles();
  return allArticles.filter(article => article.category === category);
}

/**
 * Synchronous version for backward compatibility (uses mock data)
 * @deprecated Use async getArticlesByCategory() instead
 */
export function getArticlesByCategorySync(category: string): ArticleData[] {
  if (category === 'All') return getAllArticlesSync();
  return getAllArticlesSync().filter(article => article.category === category);
}

/**
 * Get only categories that have published articles from Sanity
 * Useful for dynamically showing only relevant category filters
 */
export async function getActiveCategories(): Promise<ArticleCategory[]> {
  const articles = await getAllArticles();
  const categoriesWithContent = new Set(articles.map(a => a.category));
  return ARTICLE_CATEGORIES.filter((cat: ArticleCategory) => categoriesWithContent.has(cat));
}

/**
 * Synchronous version for backward compatibility (uses mock data)
 * @deprecated Use async getActiveCategories() instead
 */
export function getActiveCategoriesSync(): ArticleCategory[] {
  const articles = getAllArticlesSync();
  const categoriesWithContent = new Set(articles.map(a => a.category));
  return ARTICLE_CATEGORIES.filter((cat: ArticleCategory) => categoriesWithContent.has(cat));
}

/**
 * Search articles by title, abstract, or tags from Sanity
 * Only searches through published articles
 */
export async function searchArticles(query: string): Promise<ArticleData[]> {
  if (!query.trim()) {
    return getAllArticles();
  }

  const { articles: sanityArticles, fromSanity } = await searchArticlesFromSanity(query);
  
  if (fromSanity && sanityArticles.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Using Sanity search results: ${sanityArticles.length} articles for "${query}"`);
    }
    return transformArticles(sanityArticles);
  }

  // Fallback to mock data
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Using mock data fallback for search: "${query}"`);
  }
  
  const allArticles = await getAllArticles();
  const lowerQuery = query.toLowerCase().trim();
  return allArticles.filter(
    article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.abstract.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Synchronous version for backward compatibility (uses mock data)
 * @deprecated Use async searchArticles() instead
 */
export function searchArticlesSync(query: string): ArticleData[] {
  if (!query.trim()) return getAllArticlesSync();

  const lowerQuery = query.toLowerCase().trim();
  return getAllArticlesSync().filter(
    article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.abstract.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Calculate estimated reading time based on content word count
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // Strip HTML tags to get plain text
  const textContent = content.replace(/<[^>]*>/g, '');
  // Count words (split by whitespace)
  const wordCount = textContent.trim().split(/\s+/).length;
  // Calculate minutes, minimum 1 minute
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
