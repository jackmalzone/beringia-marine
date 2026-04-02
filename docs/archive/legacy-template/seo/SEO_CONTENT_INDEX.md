# SEO Content Index - Complete Website Data Catalog

**Purpose:** Comprehensive index of all website content and data that SEO agencies would want to edit in Sanity Studio.

**Last Updated:** 2025-01-20  
**Status:** Pre-Migration Audit

---

## 📋 Executive Summary

This document catalogs **all hardcoded content** across the Vital Ice website that should be migrated to Sanity CMS for SEO agency editing. The content is organized by category and includes location references for easy migration.

**Total Content Items Identified:** 200+ individual content pieces across 15+ categories

---

## 1. 🏢 Business Information

**Location:** `apps/web/src/lib/config/business-info.ts`

### Basic Information

- ✅ Business name: "Vital Ice"
- ✅ Description: "Live Better — Together. Recovery and wellness through cold therapy..."
- ✅ Tagline: "Live Better — Together"
- ✅ Email: info@vitalicesf.com
- ✅ Website: https://www.vitalicesf.com
- ⚠️ Phone: (currently empty - placeholder)

### Location Data

- ✅ Street address: "2400 Chestnut St"
- ✅ City: "San Francisco"
- ✅ State: "CA"
- ✅ ZIP: "94123"
- ✅ Coordinates: 37.800111, -122.443048

### Operating Hours

- ✅ Monday-Friday: 06:00-22:00
- ✅ Saturday: 08:00-20:00
- ✅ Sunday: 08:00-20:00

### Services List

- ✅ Cold Plunge Therapy
- ✅ Infrared Sauna
- ✅ Traditional Sauna
- ✅ Red Light Therapy
- ✅ Compression Boot Therapy
- ✅ Percussion Massage

### SEO-Specific Data

- ✅ Business categories: Wellness Center, Spa, Health Club, Recovery Center, Cold Therapy Center, Sauna Facility
- ✅ Price range: "$$"
- ✅ Payment methods: Cash, Credit Card, Debit Card, Apple Pay, Google Pay
- ✅ Amenities: 9 items (Cold Plunge Pools, Infrared Sauna, etc.)
- ✅ Area served: 7 neighborhoods (San Francisco, Marina District, Pacific Heights, etc.)

### Social Media

- ✅ Instagram: https://www.instagram.com/vitalice
- ✅ Facebook: https://www.facebook.com/vitalice
- ✅ LinkedIn: https://www.linkedin.com/company/vitalice

### Additional Business Info

- ✅ Founded year: 2024
- ✅ Employee count: "2-10"

**Migration Status:** ✅ Ready (already in migration script)

---

## 2. 🎯 SEO Metadata (Page Titles & Descriptions)

**Location:** `apps/web/src/lib/seo/metadata.ts`

### Homepage (`/`)

- ✅ Title: "Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco"
- ✅ Description: "Cold plunge therapy, infrared sauna & red light therapy in San Francisco Marina District..."
- ✅ OG Title, Description, Images
- ✅ Twitter Card Title, Description, Images

### About Page (`/about`)

- ✅ Title: "About Vital Ice | Our Story & Mission"
- ✅ Description: "Learn about Vital Ice, San Francisco's premier wellness center..."
- ✅ OG/Twitter metadata

### Services Page (`/services`)

- ✅ Title: "Wellness Services | Cold Therapy, Sauna & Recovery"
- ✅ Description: "Cold plunge therapy, infrared sauna & red light therapy in San Francisco..."
- ✅ OG/Twitter metadata

### Individual Service Pages (6 services)

Each service has:

- ✅ Page title
- ✅ Meta description
- ✅ OG metadata
- ✅ Twitter card metadata
- ✅ Canonical URL

**Services:**

1. Cold Plunge (`/services/cold-plunge`)
2. Infrared Sauna (`/services/infrared-sauna`)
3. Traditional Sauna (`/services/traditional-sauna`)
4. Red Light Therapy (`/services/red-light-therapy`)
5. Compression Boots (`/services/compression-boots`)
6. Percussion Massage (`/services/percussion-massage`)

### Other Pages

- ✅ Book (`/book`)
- ✅ Contact (`/contact`)
- ✅ Experience (`/experience`)
- ✅ FAQ (`/faq`)
- ✅ Register (`/register`)

**Total:** 13 pages with complete SEO metadata

**Migration Status:** ✅ Ready (already in migration script)

---

## 3. 📝 Server-Side SEO Content (H1, H2, Links, Content)

**Location:** `apps/web/src/components/seo/ServerSideSEO.tsx`

### Homepage (`home`)

- ✅ H1: "Vital Ice - Cold Plunge, Red Light Therapy & Sauna in San Francisco"
- ✅ H2 headings (3): "Premier Wellness Center in San Francisco", "Cold Plunge Therapy Services", "Recovery and Wellness Programs"
- ✅ Internal links (12): Services, individual service pages, Experience, About, Book, Contact, FAQ
- ✅ Content paragraph: ~200 words describing services and location

### Services Page (`services`)

- ✅ H1: "Wellness Services - Cold Plunge, Sauna & Recovery in San Francisco"
- ✅ H2 headings (4): "Comprehensive Recovery & Wellness Services", etc.
- ✅ Internal links (12)
- ✅ Content paragraph: ~150 words

### Individual Service Pages (6 services)

Each has:

- ✅ Unique H1
- ✅ H2 headings (3 per page)
- ✅ Internal links (12 per page)
- ✅ Content paragraph (~150 words per page)

### Other Pages

- ✅ Book page: H1, H2s, links, content
- ✅ About page: H1, H2s, links, content
- ✅ Contact page: H1, H2s, links, content
- ✅ Experience page: H1, H2s, links, content
- ✅ FAQ page: H1, H2s, links, content
- ✅ Register page: H1, H2s, links, content

**Total:** 13 pages × ~4 content items each = **52 SEO content blocks**

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs to be added to Page schema

---

## 4. 🛎️ Service Content (Detailed Descriptions)

**Location:** `apps/web/src/lib/data/services.ts`

### Each Service Contains:

#### Cold Plunge

- ✅ Title: "Cold Plunge"
- ✅ Subtitle: "Controlled cold exposure for recovery & mental resilience"
- ✅ Description: ~200 words (ancient practice, temperature ranges, physiological responses)
- ✅ Tagline: "Step in cold. Step out clear."
- ✅ Benefits (4 items):
  - Nervous System Regulation
  - Muscle Recovery
  - Improved Circulation
  - Mental Clarity & Resilience
- ✅ Process Steps (4 items):
  - Preparation
  - Gradual Exposure
  - Breathing Focus
  - Recovery
- ✅ CTA Title: "Ready to Experience Cold Plunge?"
- ✅ CTA Text: "Book your first session and discover the transformative benefits..."
- ✅ Images: backgroundImage, heroImage, textureImage
- ✅ Accent color: #0040FF

#### Infrared Sauna

- ✅ Title, subtitle, description (~200 words)
- ✅ Tagline: "Release the strain. Welcome the repair."
- ✅ Benefits (4 items)
- ✅ Process steps (4 items)
- ✅ CTA content
- ✅ Images and colors

#### Traditional Sauna

- ✅ Complete service content
- ✅ Tagline: "Heat that heals. Sweat that restores."
- ✅ Benefits and process steps

#### Compression Boots

- ✅ Complete service content
- ✅ Tagline: "Compress. Recover. Perform."
- ✅ Benefits and process steps

#### Percussion Massage

- ✅ Complete service content
- ✅ Tagline: "Targeted relief. Deep recovery."
- ✅ Benefits and process steps

#### Red Light Therapy

- ✅ Complete service content
- ✅ Tagline: "Light that heals. Energy that restores."
- ✅ Benefits and process steps

**Total:** 6 services × ~15 content fields each = **90+ service content items**

**Migration Status:** ✅ Ready (already in migration script)

---

## 5. ❓ FAQ Content

**Location:** `apps/web/src/app/faq/FAQPageClient.tsx`

### FAQ Items (17 questions)

1. ✅ "How do I book a session?" - Answer with links
2. ✅ "What services does Vital Ice offer?" - Answer with service links
3. ✅ "What should I bring for my first visit?" - Answer
4. ✅ "Are there any health restrictions?" - Answer
5. ✅ "How long should I stay in the cold plunge?" - Answer with link
6. ✅ "What's the difference between traditional and infrared sauna?" - Answer with links
7. ✅ "Do you offer memberships?" - Answer
8. ✅ "Can I bring a guest?" - Answer
9. ✅ "What's your cancellation policy?" - Answer
10. ✅ "Do you offer gift cards?" - Answer
11. ✅ "Do your passes expire?" - Answer
12. ✅ "Is there an age requirement?" - Answer
13. ✅ "What are your hours of operation?" - Answer with formatted hours
14. ✅ "Do you provide towels and amenities?" - Answer
15. ✅ "Can I use the facilities if I'm not feeling well?" - Answer
16. ✅ "Do you offer corporate memberships?" - Answer
17. ✅ "Do you offer discounts for teams and clubs?" - Answer

**Total:** 17 FAQ items (34 content pieces: questions + answers)

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs FAQ schema

---

## 6. 📊 Structured Data (JSON-LD)

**Location:** `apps/web/src/lib/seo/structured-data.ts`

### FAQ Structured Data

- ✅ 10+ FAQ questions in JSON-LD format
- ✅ Questions include:
  - "What is cold plunge therapy?"
  - "How long should I stay in the cold plunge?"
  - "What are the benefits of infrared sauna?"
  - "Do I need to book in advance?"
  - And 6+ more questions

### Service Structured Data

- ✅ Service schemas for each service type
- ✅ Includes: name, description, provider, serviceType, category, areaServed, offers

### Organization Schema

- ✅ Business name, description, address, contact info

### LocalBusiness Schema

- ✅ Complete business information for local SEO

**Total:** ~20 structured data items

**Migration Status:** ⚠️ **PARTIALLY MIGRATED** - Some in schemas, FAQ needs migration

---

## 7. 👥 About Page Content

**Location:** `apps/web/src/app/about/AboutPageClient.tsx`

### Company Values (4 items)

1. ✅ **Contrast Therapy**
   - Title: "Contrast Therapy"
   - Description: "Every session leaves you feeling restored and focused..."
   - Color: #00b7b5

2. ✅ **Community**
   - Title: "Community"
   - Description: "We believe we live better, together..."
   - Color: #9ec7c5

3. ✅ **Wellness**
   - Title: "Wellness"
   - Description: "It's more than recovery..."
   - Color: #ebede5

4. ✅ **Integrity & Simplicity**
   - Title: "Integrity & Simplicity"
   - Description: "With thoughtfully chosen materials..."
   - Color: #7a9e9d

### Team/Founders (3 co-founders)

1. ✅ **Stephen** - Co-Founder
   - Full bio: ~200 words (Irish immigrant, hairstylist, fitness enthusiast)
   - Short bio: ~100 words
2. ✅ **Sean** - Co-Founder
   - Full bio: ~250 words (Chicago native, Electrical Engineer, Gaelic Football player)
   - Short bio: ~100 words
3. ✅ **Barry** - Co-Founder
   - Full bio: ~150 words (Irish immigrant, athlete, general contractor)
   - Short bio: ~100 words

### Story Content

- ✅ "Our Story" section with 2-3 paragraphs
- ✅ Mission statement content
- ✅ Company history/narrative

**Total:** ~10 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs About page schema

---

## 8. 📖 Testimonials

**Location:** `apps/web/src/components/sections/Testimonials/Testimonials.tsx`

### Testimonial Content (13 testimonials)

1. ✅ **Wim Hoff** - "Cold Water is merciless, but righteous." (The Iceman)
2. ✅ **Dr. Purvi Parikh** - "Sauna bathing is almost like walking on a treadmill..." (MD, Allergist & Immunologist)
3. ✅ **Joe Rogan** - "Conquer your inner bitch." (Podcast Host & Comedian)
4. ✅ **Paula Radcliffe** - "It's absolute agony, and I dread it..." (Triathlete & Long-Distance Runner)
5. ✅ **Dr. Andrew Huberman** - "A person grows by facing resistance..." (Neuroscientist)
6. ✅ **Tom Brady** - "True strength is in the recovery..." (NFL Quarterback)
7. ✅ **Dr. Tracy Zaslow** - "Building your tolerance to cold water..." (Sports Physician)
8. ✅ **Lebron James** - "Using the sauna regularly changed the way I recover..." (NBA Player)
9. ✅ **Dr. Jaime Seeman** - "With women's bodies, we need to support homeostasis..." (OB-GYN)
10. ✅ **Seamus Mullen** - "Sometimes you just gotta get a little comfortable..." (Chef & Wellness Advocate)
11. ✅ **Menopausal Swimmer** - "Cold water is phenomenal. It has saved my life..." (UCL Study Participant)
12. ✅ **Dr. Rhonda Patrick** - "Sauna bathing has been linked to improved mental health..." (Biomedical Scientist)
13. ✅ **Dr. Rhonda Patrick** - "Sauna sessions provide cardiovascular benefits..." (Biomedical Scientist)

### Each Testimonial Contains:

- ✅ Quote text
- ✅ Author name
- ✅ Author role
- ✅ Background image URL
- ✅ Accent color
- ✅ Background gradient

**Total:** 13 testimonials × 6 fields = **78 testimonial content items**

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Testimonials schema exists but content not migrated

---

## 9. 📅 Book/Registration Page Content

**Location:** `apps/web/src/app/book/BookPageClient.tsx`

### Page Content

- ✅ Hero title: "Book Your Recovery Session"
- ✅ Hero subtitle: "Experience transformative recovery through cold therapy..."
- ✅ Services section title: "Our Services"
- ✅ Services description: "Discover our comprehensive suite of recovery and wellness services..."
- ✅ Membership content
- ✅ Terms and conditions text
- ✅ Policy information

**Total:** ~10 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs Book page schema

---

## 10. 📄 Client Policy Content

**Location:** `apps/web/src/app/client-policy/ClientPolicyPageClient.tsx`

### Policy Sections

- ✅ Welcome section: "Welcome to Vital Ice" with description
- ✅ Liability Waiver content
- ✅ Terms of Service
- ✅ Privacy Policy
- ✅ Cancellation Policy
- ✅ Additional policy sections

**Total:** ~15+ policy content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - May not need CMS (legal content)

---

## 11. 🏢 Experience Page Content

**Location:** `apps/web/src/app/experience/ExperiencePageClient.tsx`

### Page Content

- ✅ Facility descriptions
- ✅ Service highlights
- ✅ Amenity descriptions
- ✅ Location information

**Total:** ~10 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs Experience page schema

---

## 12. 💼 Careers Page Content

**Location:** `apps/web/src/app/careers/CareersPageClient.tsx`

### Content

- ✅ Job listings
- ✅ Company culture descriptions
- ✅ Benefits information
- ✅ Application instructions

**Total:** ~5-10 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs Careers schema

---

## 13. 📧 Contact Page Content

**Location:** `apps/web/src/app/contact/ContactPageClient.tsx`

### Content

- ✅ Contact form labels
- ✅ Contact information display
- ✅ Location descriptions
- ✅ Hours display

**Total:** ~5 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs Contact page schema

---

## 14. 🎨 Homepage Content

**Location:** `apps/web/src/components/pages/HomePage/HomePage.tsx`

### Hero Section

- ✅ Hero title
- ✅ Hero subtitle/description
- ✅ CTA button text
- ✅ Hero image

### Mission Statement

- ✅ Mission text
- ✅ Values display

### Service Highlights

- ✅ Service preview content
- ✅ Service descriptions

**Total:** ~10 content blocks

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Needs Homepage schema

---

## 15. 📝 Insights/Blog Articles

**Location:** `apps/web/src/lib/data/insights.ts`

### Article Content (9+ articles)

Each article contains:

- ✅ Title
- ✅ Subtitle
- ✅ Abstract/Summary
- ✅ Full HTML content (with headings, paragraphs, lists, links, images)
- ✅ Category (Wellness Article, Recovery Guide, Research Summary, Community Story)
- ✅ Author (name, role, bio, avatar, social links)
- ✅ Publish date
- ✅ Status (published, draft, scheduled)
- ✅ Cover image
- ✅ Hero images (split or single)
- ✅ Tags (6+ per article)
- ✅ Slug/URL
- ✅ SEO metadata (title, description, OG image)
- ✅ Reading time
- ✅ PDF URL (if applicable)

**Sample Articles:**

1. ✅ "Red Light Therapy: Benefits, Side Effects & Uses" (Wellness Article)
2. ✅ "Why Recovery Is the New Happy Hour: The Social Side of Cold Plunging in San Francisco" (Community Story)
3. ✅ "Infrared vs. Traditional Sauna: Which One Fits Your Wellness Routine?" (Wellness Article)
4. ✅ "Black Friday Reset: Sauna, Stillness, and the Art of Slowing Down" (Wellness Article)
5. ✅ "The Science Behind Cold Plunge Therapy" (Research Summary)
6. ✅ "Building a Daily Sauna Practice" (Recovery Guide)
7. ✅ "My Journey to Recovery: A Member Story" (Community Story)
8. ✅ "Optimizing Your Pre-Workout Routine" (Wellness Article - Scheduled)
9. ✅ "Understanding Inflammation and Recovery" (Research Summary - Draft)

**Total:** 9+ articles × ~15 content fields each = **135+ article content items**

**Migration Status:** ⚠️ **NOT YET MIGRATED** - Requires TypeScript parser or manual extraction

**Note:** Articles are currently stored as mock data in TypeScript. Migration script infrastructure is ready, but parsing TypeScript arrays requires a proper parser or manual data extraction.

---

## 16. 📱 Open Graph & Social Media Content

**Location:** `apps/web/src/lib/seo/metadata.ts`

### OG Images

- ✅ Desktop images for each page (13 pages)
- ✅ Image URLs, dimensions, alt text
- ✅ Example: `https://media.vitalicesf.com/seo/desktop-home.png`

### OG Descriptions

- ✅ Unique descriptions for each page
- ✅ Optimized for social sharing

**Total:** 13 pages × 3 items (image URL, alt text, description) = **39 OG content items**

**Migration Status:** ✅ Ready (in metadata.ts, needs migration)

---

## 📊 Summary Statistics

| Category                           | Content Items | Migration Status        |
| ---------------------------------- | ------------- | ----------------------- |
| Business Information               | 30+           | ✅ Ready                |
| SEO Metadata (Titles/Descriptions) | 50+           | ✅ Ready                |
| Server-Side SEO (H1/H2/Links)      | 52            | ⚠️ Not Migrated         |
| Service Content                    | 90+           | ✅ Ready                |
| FAQ Content                        | 34            | ⚠️ Not Migrated         |
| Structured Data                    | 20+           | ⚠️ Partially Migrated   |
| About Page                         | 10+           | ⚠️ Not Migrated         |
| Testimonials                       | 78            | ⚠️ Not Migrated         |
| Book/Registration                  | 10+           | ⚠️ Not Migrated         |
| Client Policy                      | 15+           | ⚠️ Not Migrated (Legal) |
| Experience Page                    | 10+           | ⚠️ Not Migrated         |
| Careers Page                       | 5-10          | ⚠️ Not Migrated         |
| Contact Page                       | 5+            | ⚠️ Not Migrated         |
| Homepage Content                   | 10+           | ⚠️ Not Migrated         |
| Open Graph Content                 | 39            | ⚠️ Not Migrated         |
| Insights/Blog Articles             | 135+          | ⚠️ Not Migrated         |
| **TOTAL**                          | **635+**      | **~30% Migrated**       |

---

## 🎯 Priority Migration Recommendations

### High Priority (SEO Critical)

1. ✅ **Business Information** - Already in migration
2. ✅ **Service Content** - Already in migration
3. ✅ **SEO Metadata** - Already in migration
4. ⚠️ **Server-Side SEO Content** (H1/H2/Links) - **HIGH PRIORITY**
5. ⚠️ **FAQ Content** - **HIGH PRIORITY** (affects FAQ structured data)
6. ⚠️ **Insights/Blog Articles** - **HIGH PRIORITY** (blog content for SEO, thought leadership)

### Medium Priority

6. ⚠️ **About Page Content** - Important for brand
7. ⚠️ **Homepage Content** - Important for first impression
8. ⚠️ **Open Graph Content** - Important for social sharing

### Lower Priority

9. ⚠️ **Experience Page** - Less frequently updated
10. ⚠️ **Contact Page** - Mostly static
11. ⚠️ **Careers Page** - Infrequently updated
12. ⚠️ **Client Policy** - Legal content, may not need CMS

---

## 🔧 Schema Requirements

### Existing Schemas (✅ Ready)

- ✅ `globalSettings` - Business info
- ✅ `service` - Service content
- ✅ `page` - Basic page structure
- ✅ `seoSettings` - SEO metadata

### Needed Schemas (⚠️ To Create)

- ⚠️ `faq` - FAQ questions and answers (17 items)
- ⚠️ `testimonial` - Customer testimonials (13 items) - **Schema exists, content not migrated**
- ⚠️ `article` or `insight` - Blog/Insights articles (9+ articles) - **Can use `page` schema with article fields**
- ⚠️ `aboutPage` - About page content (values, team, story)
- ⚠️ `homePage` - Homepage hero and content blocks
- ⚠️ `experiencePage` - Facility descriptions
- ⚠️ `careersPage` - Job listings and culture

### Schema Enhancements Needed

- ⚠️ Enhance `page` schema to include:
  - Server-side H1/H2 headings
  - Internal link configurations
  - SEO content paragraphs
  - Open Graph image references

---

## 📝 Next Steps

1. **Complete Current Migration** - Run migration for services, business info, SEO metadata
2. **Create FAQ Schema** - Add FAQ document type to Sanity
3. **Enhance Page Schema** - Add server-side SEO fields to page schema
4. **Create Additional Page Schemas** - About, Homepage, Experience, etc.
5. **Migrate FAQ Content** - Move 17 FAQ items to Sanity
6. **Migrate Server-Side SEO** - Move H1/H2/Links content to page documents
7. **Migrate About Page** - Move values, team (3 co-founders), story content
8. **Migrate Testimonials** - Move 13 testimonials to Sanity (schema exists)
9. **Migrate Insights Articles** - Move 9+ blog articles to Sanity (requires TypeScript parser or manual extraction)
10. **Migrate FAQ Structured Data** - Sync FAQ page content with structured data (10 items in structured-data.ts vs 17 in FAQPageClient.tsx)

---

## 🔍 Files to Review for Complete Audit

- [ ] `apps/web/src/components/sections/Testimonials/Testimonials.tsx` - Check testimonial content
- [ ] `apps/web/src/app/partners/PartnersPageClient.tsx` - Check if partners page exists
- [ ] `apps/web/src/lib/data/insights.ts` - Check if blog/insights content exists
- [ ] Any other page components with hardcoded text

---

**Document Version:** 1.0  
**Last Audit:** 2025-01-20  
**Next Review:** After initial migration completion
