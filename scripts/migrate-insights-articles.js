#!/usr/bin/env node

/**
 * Migrate Insights Articles Script
 *
 * This script migrates articles from the static mock data to Sanity.
 * Since the TypeScript file can't be easily parsed, we manually define
 * the articles to migrate based on the mockArticles array.
 *
 * Usage:
 *   node scripts/migrate-insights-articles.js [--dry-run]
 */

// Load environment variables
const envPaths = ['apps/web/.env.local', 'apps/studio/.env.local', '.env.local'];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath, override: true });
    if (process.env.SANITY_API_TOKEN) {
      break;
    }
  } catch (e) {
    // Continue to next path
  }
}

const { createClient } = require('@sanity/client');

// Configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.trim() : undefined,
  useCdn: false,
});

// Article data extracted from mockArticles
// Converting HTML content to Portable Text blocks is complex, so we'll store as plain text for now
// Editors can convert to Portable Text in Studio if needed
const articlesToMigrate = [
  {
    id: 'red-light-therapy-benefits-uses',
    title: 'Red Light Therapy: Benefits, Side Effects & Uses',
    subtitle:
      'Discover how red light therapy boosts skin, reduces inflammation, and speeds recovery',
    abstract:
      'Red light therapy uses specific wavelengths to support cellular repair, reduce inflammation, and improve skin health. Learn about the proven benefits, safety considerations, and what to expect from professional sessions.',
    category: 'Wellness Article',
    author: {
      name: 'Vital Ice Team',
      role: '',
      bio: '',
    },
    publishDate: '2025-01-25',
    status: 'published',
    slug: 'red-light-therapy-benefits-uses',
    tags: [
      'Red Light Therapy',
      'Recovery',
      'Skin Health',
      'Wellness',
      'Inflammation',
      'Recovery Tools',
    ],
    seo: {
      title: 'Red Light Therapy Benefits, Uses & Safety | Vital Ice Wellness',
      description:
        'Discover how red light therapy boosts skin, reduces inflammation, and speeds recovery. Learn benefits, safety, and what to expect from sessions at Vital Ice.',
    },
    readingTime: 8,
    // Note: HTML content will be stored as plain text - can be converted to Portable Text later
    contentHtml: `<h2>What Is Red Light Therapy?</h2>
<p>Red light therapy uses specific wavelengths of light to penetrate deep into tissues, stimulating mitochondria to produce more ATP energy. This cellular energy boost supports healing, reduces inflammation, improves skin appearance, and accelerates recovery.</p>
<h2>Proven Benefits</h2>
<p>Most people come in for one issue and end up noticing something else improving along the way. Red light therapy has been shown to improve skin health, reduce inflammation, support muscle recovery, and enhance overall wellness.</p>
<h2>Safety and Side Effects</h2>
<p>For most people, red light therapy is extremely safe. Side effects are rare and typically mild, such as temporary warmth or slight redness.</p>`,
  },
  {
    id: 'why-recovery-is-the-new-happy-hour',
    title: 'Why Recovery Is the New Happy Hour: The Social Side of Cold Plunging in San Francisco',
    subtitle: 'Cold plunging is redefining social life in San Francisco',
    abstract:
      "Cold plunging used to be something athletes did quietly after training, or something you'd see in a Nordic spa video and think, Wow, good for them. But if you live in San Francisco, you've probably noticed something different happening. What used to be a recovery tool is becoming a social activity.",
    category: 'Community Story',
    author: {
      name: 'Vital Ice Team',
      role: '',
      bio: '',
    },
    publishDate: '2025-01-22',
    status: 'published',
    slug: 'why-recovery-is-the-new-happy-hour',
    tags: ['Cold Therapy', 'Community', 'San Francisco', 'Wellness', 'Social'],
    seo: {
      title: 'Why Recovery Is the New Happy Hour in San Francisco | Vital Ice',
      description:
        'Cold plunging is redefining social life in San Francisco. Discover how recovery practices are becoming the new social activity.',
    },
    readingTime: 6,
    contentHtml: `<p>Cold plunging used to be something athletes did quietly after training. But if you live in San Francisco, you've probably noticed something different happening. What used to be a recovery tool is becoming a social activity.</p>
<h2>Why Cold Plunge Culture Is Growing</h2>
<p>Groups around the Bay are using cold plunges as a shared ritual. You show up, you breathe, you face the discomfort together. And that "together" part is honestly the whole point.</p>
<h2>The Social Wellness Movement in SF</h2>
<p>People are swapping alcohol-centered gatherings for sauna sessions, cold plunge meetups, and group breathwork. Studios around the city have become social hubs.</p>`,
  },
  {
    id: 'black-friday-wellness-reset',
    title: 'Black Friday Wellness Reset: Sauna, Stillness & Contrast Therapy',
    subtitle: 'Skip the Black Friday chaos and reset with intentional recovery',
    abstract:
      'Skip the Black Friday chaos and reset with sauna heat, mindful stillness, and contrast therapy. Discover how to slow down, breathe deeper, and restore your energy.',
    category: 'Wellness Article',
    author: {
      name: 'Vital Ice Team',
      role: '',
      bio: '',
    },
    publishDate: '2025-01-20',
    status: 'published',
    slug: 'black-friday-wellness-reset',
    tags: ['Wellness', 'Sauna', 'Mindfulness', 'Stress Relief', 'Contrast Therapy'],
    seo: {
      title: 'Black Friday Wellness Reset | Sauna, Stillness & Contrast Therapy',
      description:
        'Skip the Black Friday chaos and reset with sauna heat, mindful stillness, and contrast therapy. Discover how to slow down, breathe deeper, and restore your energy.',
    },
    readingTime: 10,
    contentHtml: `<h2>Why Black Friday Feels So Overwhelming</h2>
<p>The pressure isn't just about crowds or deals. It's the speed. Everything moves a little faster, and the nervous system reads that as a demand to stay alert.</p>
<h2>The Case for a Black Friday Reset</h2>
<p>A reset isn't complicated. It's a simple decision to move at a pace that feels healthy rather than reactive. Even an hour of intentional recovery can change how you show up for the rest of the season.</p>
<h2>Sauna Therapy: The Ancient Practice for Modern Stress</h2>
<p>Heat has always been a tool for recovery and relaxation. Inside the heat, thoughts begin to settle. Muscles let go. Your breathing deepens naturally.</p>`,
  },
  {
    id: 'science-behind-cold-plunge-therapy',
    title: 'The Science Behind Cold Plunge Therapy',
    subtitle: 'Understanding the physiological benefits of cold exposure',
    abstract:
      'Discover how cold plunge therapy triggers powerful physiological responses that enhance recovery, boost mental clarity, and build resilience. Learn about the science-backed benefits of controlled cold exposure.',
    category: 'Research Summary',
    author: {
      name: 'Dr. Sarah Chen',
      role: 'Sports Medicine Specialist',
      bio: 'Dr. Chen specializes in recovery science and has published over 30 peer-reviewed papers on cold therapy and athletic performance.',
    },
    publishDate: '2025-01-15',
    status: 'published',
    slug: 'science-behind-cold-plunge-therapy',
    tags: ['Cold Therapy', 'Recovery', 'Science', 'Mental Health'],
    seo: {
      title: 'The Science Behind Cold Plunge Therapy | Vital Ice Insights',
      description:
        'Discover the physiological benefits of cold plunge therapy backed by scientific research. Learn how cold exposure enhances recovery and mental resilience.',
    },
    readingTime: 7,
    contentHtml: `<h2>Introduction to Cold Therapy</h2>
<p>Cold plunge therapy has been used for centuries across various cultures, from Nordic ice baths to Japanese misogi practices. Modern science is now validating what ancient practitioners knew intuitively: controlled cold exposure offers profound benefits for both body and mind.</p>
<h2>The Physiological Response</h2>
<p>When you immerse yourself in cold water, your body initiates a cascade of physiological responses. The initial shock triggers vasoconstriction, where blood vessels near the skin's surface constrict to preserve core body temperature.</p>
<h2>Hormonal Benefits</h2>
<p>Cold exposure stimulates the release of norepinephrine, a hormone and neurotransmitter that plays a crucial role in focus and attention. Studies have shown that cold water immersion can increase norepinephrine levels by up to 530%.</p>`,
  },
  {
    id: 'building-daily-sauna-practice',
    title: 'Building a Daily Sauna Practice',
    subtitle: 'A comprehensive guide to incorporating heat therapy into your routine',
    abstract:
      'Learn how to establish a sustainable sauna practice that fits your lifestyle. This guide covers optimal timing, duration, hydration strategies, and how to maximize the cardiovascular and detoxification benefits of regular heat exposure.',
    category: 'Recovery Guide',
    author: {
      name: 'Marcus Thompson',
      role: '',
      bio: '',
    },
    publishDate: '2025-01-10',
    status: 'published',
    slug: 'building-daily-sauna-practice',
    tags: ['Sauna', 'Heat Therapy', 'Wellness Routine', 'Recovery'],
    readingTime: 8,
    contentHtml: `<h2>Why Establish a Sauna Routine?</h2>
<p>Regular sauna use is one of the most accessible and effective wellness practices you can adopt. Research from Finland, where sauna culture is deeply embedded, shows that frequent sauna users experience lower rates of cardiovascular disease, improved longevity, and enhanced overall well-being.</p>
<h2>Getting Started: Your First Week</h2>
<p>If you're new to sauna therapy, start conservatively. Begin with 10-15 minute sessions at moderate temperatures (150-160°F for traditional saunas, 120-140°F for infrared).</p>
<h2>Optimal Timing and Frequency</h2>
<p>The best time for sauna use depends on your goals and schedule. Morning sessions can energize your day and improve circulation, while evening sessions promote relaxation and better sleep quality.</p>`,
  },
  {
    id: 'my-journey-to-recovery-member-story',
    title: 'My Journey to Recovery: A Member Story',
    subtitle: 'How Vital Ice transformed my approach to wellness and performance',
    abstract:
      'After years of pushing through pain and ignoring recovery, I discovered Vital Ice. This is my story of transformation—from chronic fatigue and injury to renewed energy, strength, and a sustainable approach to fitness and life.',
    category: 'Community Story',
    author: {
      name: 'Alex Rivera',
      role: '',
      bio: '',
    },
    publishDate: '2025-01-05',
    status: 'published',
    slug: 'my-journey-to-recovery-member-story',
    tags: ['Member Story', 'Recovery', 'Transformation', 'Wellness Journey'],
    readingTime: 10,
    contentHtml: `<h2>The Breaking Point</h2>
<p>Three years ago, I was the definition of overtraining. As a competitive runner and CrossFit enthusiast, I believed that more was always better. Rest days felt like weakness. Recovery was something I'd worry about "later."</p>
<h2>Discovering Vital Ice</h2>
<p>A training partner mentioned Vital Ice, describing it as a "recovery sanctuary." I was skeptical—how could sitting in a sauna or taking a cold plunge make a real difference? But I was desperate enough to try anything.</p>
<h2>Month Three: The Transformation</h2>
<p>By month three, the changes were undeniable: pain reduction, performance gains, mental clarity, and better stress management. The discipline of showing up for recovery taught me patience.</p>`,
  },
];

// Convert HTML to simple Portable Text blocks
// This is a simplified conversion - full HTML to PT would require a proper parser
function htmlToSimplePortableText(html) {
  if (!html) return [];

  // Split by block-level elements and create simple text blocks
  const blocks = [];
  const lines = html
    .replace(/<h2>/g, '\n<h2>')
    .replace(/<h3>/g, '\n<h3>')
    .replace(/<\/h2>/g, '</h2>\n')
    .replace(/<\/h3>/g, '</h3>\n')
    .replace(/<p>/g, '\n<p>')
    .replace(/<\/p>/g, '</p>\n')
    .split('\n')
    .filter(line => line.trim());

  let blockIndex = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Extract text content (remove HTML tags)
    const text = trimmed.replace(/<[^>]+>/g, '').trim();

    if (!text) continue;

    // Determine style based on HTML tag
    let style = 'normal';
    if (trimmed.includes('<h2>')) {
      style = 'h2';
    } else if (trimmed.includes('<h3>')) {
      style = 'h3';
    }

    blocks.push({
      _type: 'block',
      _key: `block-${blockIndex++}`,
      style: style,
      children: [
        {
          _type: 'span',
          _key: `span-${blockIndex}`,
          text: text,
          marks: [],
        },
      ],
      markDefs: [],
    });
  }

  return blocks.length > 0
    ? blocks
    : [
        {
          _type: 'block',
          _key: 'block-0',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-0',
              text:
                html.replace(/<[^>]+>/g, '').trim() ||
                'Content needs to be converted to Portable Text',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ];
}

// Migrate articles
async function migrateArticles(dryRun = false) {
  console.log('📰 Migrating Insights Articles...\n');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}\n`);

  const results = [];

  for (const article of articlesToMigrate) {
    try {
      // Convert HTML content to Portable Text
      const content = htmlToSimplePortableText(article.contentHtml);

      // Build the article document
      const articleDoc = {
        _type: 'article',
        _id: `article-${article.id}`,
        title: article.title,
        slug: {
          _type: 'slug',
          current: article.slug,
        },
        subtitle: article.subtitle || '',
        abstract: article.abstract || '',
        content: content,
        category: article.category,
        author: {
          _type: 'object',
          name: article.author.name,
          role: article.author.role || '',
          bio: article.author.bio || '',
        },
        tags: article.tags || [],
        status: article.status,
        publishDate: article.publishDate,
        readingTime: article.readingTime || null,
        seo: article.seo
          ? {
              _type: 'seoSettings',
              title: article.seo.title || article.title,
              description: article.seo.description || article.abstract,
              keywords: article.tags || [],
            }
          : undefined,
        featured: false,
        orderRank: article.id, // For ordering
      };

      if (dryRun) {
        console.log(`   ✓ Would create article: ${article.title} (${article.slug})`);
        console.log(`     Category: ${article.category}`);
        results.push({ success: true, id: article.slug, action: 'would-create' });
      } else {
        const result = await client.createOrReplace(articleDoc);
        console.log(`   ✅ Created article: ${article.title} (${result._id})`);
        console.log(`     Category: ${article.category}`);
        results.push({ success: true, id: result._id, action: 'created' });
      }
    } catch (error) {
      console.error(`   ❌ Failed to create article ${article.title}:`, error.message);
      results.push({ success: false, id: article.slug, error: error.message });
    }
  }

  console.log(
    `\n   📊 Summary: ${results.filter(r => r.success).length}/${results.length} articles ${dryRun ? 'would be' : ''} migrated`
  );

  return results;
}

// Main function
async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🚀 Starting Insights Articles Migration...\n');

  // Validate environment
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN in environment variables');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables');
    process.exit(1);
  }

  try {
    const results = await migrateArticles(dryRun);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n📊 Final Summary:');
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${results.length}`);

    if (failed > 0) {
      console.log('\n⚠️  Some articles failed to migrate. Check the errors above.');
      process.exit(1);
    }

    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
