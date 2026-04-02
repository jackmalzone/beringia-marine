#!/usr/bin/env node

/**
 * Fix Content Issues Script
 *
 * This script fixes:
 * 1. Duplicate testimonials block on homepage
 * 2. Missing serverSideSEO on pages
 * 3. Empty content arrays on pages
 *
 * Usage:
 *   node scripts/fix-content-issues.js
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

// Server-side SEO content for all pages
const serverSideSEOContent = {
  about: {
    h1: 'About Vital Ice - Our Story, Mission & Team',
    h2: ['Our Story', 'Our Values', 'Our Team'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices and modern recovery techniques.",
  },
  services: {
    h1: 'Wellness Services - Cold Plunge, Sauna & Recovery in San Francisco',
    h2: [
      'Comprehensive Recovery & Wellness Services',
      'Cold Therapy & Cryotherapy Services',
      'Heat Therapy & Sauna Services',
      'Light Therapy & Recovery Services',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna Sessions' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/contact', text: 'Contact Us' },
    ],
    content:
      "Vital Ice offers comprehensive wellness services in San Francisco's Marina District. Our services include cold plunge therapy for inflammation reduction and mental clarity, infrared sauna for detoxification and relaxation, traditional sauna for deep heat therapy, red light therapy for cellular health and skin benefits, compression boots for muscle recovery and circulation, and percussion massage for deep tissue relief.",
  },
  book: {
    h1: 'Book Your Recovery Session - Vital Ice San Francisco',
    h2: [
      'Schedule Your Wellness Session',
      'Recovery & Wellness Services Available',
      'Book Cold Therapy, Sauna & Recovery Sessions',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'View All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/contact', text: 'Contact Us' },
    ],
    content:
      "Book your recovery and wellness session at Vital Ice in San Francisco's Marina District. Schedule cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, or percussion massage sessions online.",
  },
  contact: {
    h1: 'Contact Vital Ice - San Francisco Wellness Center',
    h2: ['Visit Our Location', 'Get in Touch', 'Business Hours'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/book', text: 'Book Appointment' },
      { href: '/about', text: 'About Us' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Contact Vital Ice, San Francisco's premier wellness center. Visit us in the Marina District or reach out to book your session, ask questions, or learn more about our services.",
  },
  experience: {
    h1: 'Experience Vital Ice - State-of-the-Art Wellness Facility',
    h2: ['Our Facility', 'Premium Amenities', 'Wellness Experience'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/book', text: 'Book Your Visit' },
      { href: '/about', text: 'About Us' },
      { href: '/contact', text: 'Contact Us' },
    ],
    content:
      "Experience Vital Ice's state-of-the-art facility featuring cold plunge therapy, infrared sauna, traditional sauna, and recovery services in San Francisco's Marina District.",
  },
  'cold-plunge': {
    h1: 'Cold Plunge Therapy - Vital Ice San Francisco',
    h2: ['Cold Therapy Benefits', 'How It Works', 'Recovery & Wellness'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/book', text: 'Book Session' },
      { href: '/contact', text: 'Contact Us' },
    ],
    content:
      'Experience cold plunge therapy at Vital Ice. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery. Ancient practice, modern recovery.',
  },
  'infrared-sauna': {
    h1: 'Infrared Sauna Therapy - Vital Ice San Francisco',
    h2: ['Deep Tissue Heating', 'Detoxification Benefits', 'Relaxation & Recovery'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge' },
      { href: '/book', text: 'Book Session' },
    ],
    content:
      'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
  },
  'traditional-sauna': {
    h1: 'Traditional Sauna - Vital Ice San Francisco',
    h2: ['Nordic Heat Therapy', 'Cardiovascular Benefits', 'Deep Relaxation'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge' },
      { href: '/book', text: 'Book Session' },
    ],
    content:
      'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
  },
  'red-light-therapy': {
    h1: 'Red Light Therapy - Vital Ice San Francisco',
    h2: ['Cellular Regeneration', 'Skin Health Benefits', 'Pain Relief'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/book', text: 'Book Session' },
    ],
    content:
      'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
  },
  'compression-boots': {
    h1: 'Compression Boot Therapy - Vital Ice San Francisco',
    h2: ['Circulatory Support', 'Muscle Recovery', 'Lymphatic Drainage'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/book', text: 'Book Session' },
    ],
    content:
      'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
  },
  'percussion-massage': {
    h1: 'Percussion Massage Therapy - Vital Ice San Francisco',
    h2: ['Deep Tissue Relief', 'Muscle Recovery', 'Improved Mobility'],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/book', text: 'Book Session' },
    ],
    content:
      'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
  },
  faq: {
    h1: 'Frequently Asked Questions - Vital Ice San Francisco',
    h2: [
      'Common Questions About Our Services',
      'Booking & Appointment Information',
      'Wellness & Recovery Questions',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/book', text: 'Book Session' },
      { href: '/contact', text: 'Contact Us' },
    ],
    content:
      "Find answers to frequently asked questions about Vital Ice's services, booking, policies, and wellness programs in San Francisco.",
  },
};

// Fix duplicate testimonials on homepage
async function fixHomepageTestimonials() {
  console.log('🔧 Fixing duplicate testimonials on homepage...');

  try {
    const homepage = await client.fetch('*[_type == "page" && slug.current == "/"][0]');
    if (!homepage) {
      console.log('   ⚠️  Homepage not found');
      return false;
    }

    // Filter out the duplicate (keep only testimonials-block)
    const uniqueContent = homepage.content.filter(block => block._key === 'testimonials-block');

    if (uniqueContent.length === homepage.content.length) {
      console.log('   ✅ No duplicates found');
      return true;
    }

    await client.patch(homepage._id).set({ content: uniqueContent }).commit();
    console.log('   ✅ Removed duplicate testimonials block');
    return true;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Add serverSideSEO to pages
async function addServerSideSEO() {
  console.log('\n🔧 Adding serverSideSEO to pages...');

  let fixedCount = 0;

  for (const [slug, content] of Object.entries(serverSideSEOContent)) {
    try {
      const page = await client.fetch(`*[_type == "page" && slug.current == "${slug}"][0]`);
      if (!page) {
        console.log(`   ⚠️  Page ${slug} not found`);
        continue;
      }

      // Skip if already has serverSideSEO
      if (page.serverSideSEO) {
        console.log(`   ✓ Page ${slug} already has serverSideSEO`);
        continue;
      }

      const update = {
        serverSideSEO: {
          _type: 'object',
          h1: content.h1,
          h2: content.h2 || [],
          links: content.links
            ? content.links.map((link, index) => ({
                _key: `link-${index}`,
                _type: 'object',
                href: link.href,
                text: link.text,
              }))
            : [],
          content: content.content || '',
        },
      };

      await client.patch(page._id).set(update).commit();
      console.log(`   ✅ Added serverSideSEO to ${slug}`);
      fixedCount++;
    } catch (error) {
      console.error(`   ❌ Error updating ${slug}:`, error.message);
    }
  }

  console.log(`   ✅ Updated ${fixedCount} pages`);
  return fixedCount;
}

// Add basic content to empty pages
async function addBasicContent() {
  console.log('\n🔧 Adding basic content to empty pages...');

  const pagesNeedingContent = [
    {
      slug: 'services',
      title: 'Wellness Services',
      subtitle: 'Comprehensive recovery and wellness solutions',
    },
    {
      slug: 'book',
      title: 'Book Your Session',
      subtitle: 'Schedule your recovery and wellness experience',
    },
    { slug: 'contact', title: 'Contact Us', subtitle: 'Get in touch with Vital Ice' },
    {
      slug: 'experience',
      title: 'Experience Our Facility',
      subtitle: 'State-of-the-art wellness center',
    },
    {
      slug: 'cold-plunge',
      title: 'Cold Plunge Therapy',
      subtitle: 'Ancient practice, modern recovery',
    },
    { slug: 'infrared-sauna', title: 'Infrared Sauna', subtitle: 'Deep tissue heating therapy' },
    { slug: 'traditional-sauna', title: 'Traditional Sauna', subtitle: 'Nordic heat therapy' },
    {
      slug: 'red-light-therapy',
      title: 'Red Light Therapy',
      subtitle: 'Cellular regeneration therapy',
    },
    {
      slug: 'compression-boots',
      title: 'Compression Boots',
      subtitle: 'Sequential compression therapy',
    },
    {
      slug: 'percussion-massage',
      title: 'Percussion Massage',
      subtitle: 'Deep tissue percussion therapy',
    },
  ];

  let fixedCount = 0;

  for (const pageInfo of pagesNeedingContent) {
    try {
      const page = await client.fetch(
        `*[_type == "page" && slug.current == "${pageInfo.slug}"][0]`
      );
      if (!page) {
        console.log(`   ⚠️  Page ${pageInfo.slug} not found`);
        continue;
      }

      // Skip if already has content
      if (page.content && page.content.length > 0) {
        console.log(`   ✓ Page ${pageInfo.slug} already has content`);
        continue;
      }

      const content = [
        {
          _key: `${pageInfo.slug}-hero`,
          _type: 'hero',
          title: pageInfo.title,
          subtitle: pageInfo.subtitle,
        },
      ];

      await client.patch(page._id).set({ content }).commit();
      console.log(`   ✅ Added content to ${pageInfo.slug}`);
      fixedCount++;
    } catch (error) {
      console.error(`   ❌ Error updating ${pageInfo.slug}:`, error.message);
    }
  }

  console.log(`   ✅ Updated ${fixedCount} pages`);
  return fixedCount;
}

// Main function
async function main() {
  console.log('🚀 Starting content fixes...\n');

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
    const testimonialsFixed = await fixHomepageTestimonials();
    const seoFixed = await addServerSideSEO();
    const contentFixed = await addBasicContent();

    console.log('\n📊 Summary:');
    console.log(`   Homepage testimonials: ${testimonialsFixed ? 'Fixed' : 'Skipped'}`);
    console.log(`   Pages with serverSideSEO added: ${seoFixed}`);
    console.log(`   Pages with content added: ${contentFixed}`);
    console.log(`   Total fixes: ${(testimonialsFixed ? 1 : 0) + seoFixed + contentFixed}`);

    console.log('\n✅ Fixes completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
