#!/usr/bin/env node

/**
 * Sanity Content Migration Script
 *
 * This script migrates existing content from hardcoded data structures to Sanity CMS.
 * It handles services data, business information, and SEO metadata migration.
 *
 * Usage:
 *   node scripts/migrate-to-sanity.js [--dry-run] [--type=services|business|seo|all]
 *
 * Options:
 *   --dry-run    Show what would be migrated without actually creating documents
 *   --type       Specify which content type to migrate (default: all)
 *   --help       Show this help message
 */

// Load environment variables from .env.local
// Try multiple locations: root, apps/studio, apps/web
const envPaths = ['apps/web/.env.local', 'apps/studio/.env.local', '.env.local'];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath, override: true });
    // If we successfully loaded a token, break
    if (process.env.SANITY_API_TOKEN) {
      // Trim the token to remove any whitespace
      process.env.SANITY_API_TOKEN = process.env.SANITY_API_TOKEN.trim();
      break;
    }
  } catch (e) {
    // Continue to next path
  }
}

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration
const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.trim() : undefined,
  useCdn: false,
};

// Validate environment variables
function validateEnvironment() {
  const required = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env.local file');
    process.exit(1);
  }

  // Debug: Verify token is loaded (without exposing it)
  if (process.env.SANITY_API_TOKEN) {
    console.log(`✓ Token loaded (length: ${process.env.SANITY_API_TOKEN.length} chars)`);
  }
}

// Initialize Sanity client
function createSanityClient() {
  return createClient(SANITY_CONFIG);
}

// Import existing data
function loadExistingData() {
  try {
    // Try new monorepo structure first, then fall back to old structure
    const possiblePaths = {
      services: [
        path.join(process.cwd(), 'apps/web/src/lib/data/services.ts'),
        path.join(process.cwd(), 'src/lib/data/services.ts'),
      ],
      businessInfo: [
        path.join(process.cwd(), 'apps/web/src/lib/config/business-info.ts'),
        path.join(process.cwd(), 'src/lib/config/business-info.ts'),
      ],
      metadata: [
        path.join(process.cwd(), 'apps/web/src/lib/seo/metadata.ts'),
        path.join(process.cwd(), 'src/lib/seo/metadata.ts'),
      ],
    };

    // Load services data
    let servicesContent;
    for (const servicesPath of possiblePaths.services) {
      if (fs.existsSync(servicesPath)) {
        servicesContent = fs.readFileSync(servicesPath, 'utf8');
        console.log(`✓ Found services data at: ${servicesPath}`);
        break;
      }
    }
    if (!servicesContent) {
      throw new Error(`Could not find services.ts in any of: ${possiblePaths.services.join(', ')}`);
    }

    // Load business info
    let businessInfoContent;
    for (const businessInfoPath of possiblePaths.businessInfo) {
      if (fs.existsSync(businessInfoPath)) {
        businessInfoContent = fs.readFileSync(businessInfoPath, 'utf8');
        console.log(`✓ Found business info at: ${businessInfoPath}`);
        break;
      }
    }
    if (!businessInfoContent) {
      throw new Error(
        `Could not find business-info.ts in any of: ${possiblePaths.businessInfo.join(', ')}`
      );
    }

    // Load SEO metadata
    let metadataContent;
    for (const metadataPath of possiblePaths.metadata) {
      if (fs.existsSync(metadataPath)) {
        metadataContent = fs.readFileSync(metadataPath, 'utf8');
        console.log(`✓ Found SEO metadata at: ${metadataPath}`);
        break;
      }
    }
    if (!metadataContent) {
      throw new Error(`Could not find metadata.ts in any of: ${possiblePaths.metadata.join(', ')}`);
    }

    // Load additional content files
    const additionalPaths = {
      faq: [
        path.join(process.cwd(), 'apps/web/src/app/faq/FAQPageClient.tsx'),
        path.join(process.cwd(), 'src/app/faq/FAQPageClient.tsx'),
      ],
      testimonials: [
        path.join(process.cwd(), 'apps/web/src/components/sections/Testimonials/Testimonials.tsx'),
        path.join(process.cwd(), 'src/components/sections/Testimonials/Testimonials.tsx'),
      ],
      about: [
        path.join(process.cwd(), 'apps/web/src/app/about/AboutPageClient.tsx'),
        path.join(process.cwd(), 'src/app/about/AboutPageClient.tsx'),
      ],
      serverSideSEO: [
        path.join(process.cwd(), 'apps/web/src/components/seo/ServerSideSEO.tsx'),
        path.join(process.cwd(), 'src/components/seo/ServerSideSEO.tsx'),
      ],
      structuredData: [
        path.join(process.cwd(), 'apps/web/src/lib/seo/structured-data.ts'),
        path.join(process.cwd(), 'src/lib/seo/structured-data.ts'),
      ],
      insights: [
        path.join(process.cwd(), 'apps/web/src/lib/data/insights.ts'),
        path.join(process.cwd(), 'src/lib/data/insights.ts'),
      ],
    };

    // Load FAQ content
    let faqContent = null;
    for (const faqPath of additionalPaths.faq) {
      if (fs.existsSync(faqPath)) {
        faqContent = fs.readFileSync(faqPath, 'utf8');
        console.log(`✓ Found FAQ content at: ${faqPath}`);
        break;
      }
    }

    // Load testimonials content
    let testimonialsContent = null;
    for (const testimonialsPath of additionalPaths.testimonials) {
      if (fs.existsSync(testimonialsPath)) {
        testimonialsContent = fs.readFileSync(testimonialsPath, 'utf8');
        console.log(`✓ Found testimonials at: ${testimonialsPath}`);
        break;
      }
    }

    // Load about page content
    let aboutContent = null;
    for (const aboutPath of additionalPaths.about) {
      if (fs.existsSync(aboutPath)) {
        aboutContent = fs.readFileSync(aboutPath, 'utf8');
        console.log(`✓ Found about page at: ${aboutPath}`);
        break;
      }
    }

    // Load server-side SEO content
    let serverSideSEOContent = null;
    for (const seoPath of additionalPaths.serverSideSEO) {
      if (fs.existsSync(seoPath)) {
        serverSideSEOContent = fs.readFileSync(seoPath, 'utf8');
        console.log(`✓ Found server-side SEO at: ${seoPath}`);
        break;
      }
    }

    // Load structured data
    let structuredDataContent = null;
    for (const sdPath of additionalPaths.structuredData) {
      if (fs.existsSync(sdPath)) {
        structuredDataContent = fs.readFileSync(sdPath, 'utf8');
        console.log(`✓ Found structured data at: ${sdPath}`);
        break;
      }
    }

    // Load insights/blog articles
    let insightsContent = null;
    for (const insightsPath of additionalPaths.insights) {
      if (fs.existsSync(insightsPath)) {
        insightsContent = fs.readFileSync(insightsPath, 'utf8');
        console.log(`✓ Found insights articles at: ${insightsPath}`);
        break;
      }
    }

    return {
      services: servicesContent,
      businessInfo: businessInfoContent,
      metadata: metadataContent,
      faq: faqContent,
      testimonials: testimonialsContent,
      about: aboutContent,
      serverSideSEO: serverSideSEOContent,
      structuredData: structuredDataContent,
      insights: insightsContent,
    };
  } catch (error) {
    console.error('❌ Error loading existing data files:', error.message);
    process.exit(1);
  }
}

// Parse services data from TypeScript file
function parseServicesData(content) {
  try {
    // Extract the servicesData object using regex
    const match = content.match(
      /export const servicesData: Record<string, ServiceData> = ({[\s\S]*?});/
    );
    if (!match) {
      throw new Error('Could not find servicesData export');
    }

    // Use eval to parse the object (in a real scenario, you'd want a proper TS parser)
    // For now, we'll manually extract the data
    const services = [
      {
        id: 'cold-plunge',
        title: 'Cold Plunge',
        subtitle: 'Controlled cold exposure for recovery & mental resilience',
        description:
          'An ancient practice, reimagined for modern recovery. Historic traditions from Nordic cultures and Japanese onsen, cold water immersion has been used for centuries to promote resilience, healing, and longevity. Cold plunging involves submerging the body in water typically between 39-55°F for a short duration (1-10 minutes at a time). The cold stimulates the nervous system, constricts blood vessels, and triggers powerful physiological responses.',
        backgroundImage: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
        heroImage: 'https://media.vitalicesf.com/ice-vitalblue.jpg',
        textureImage: 'https://media.vitalicesf.com/ice_vertical-texture.jpg',
        accentColor: '#0040FF',
        tagline: 'Step in cold. Step out clear.',
        benefits: [
          {
            title: 'Nervous System Regulation',
            description:
              'Cold exposure activates the sympathetic nervous system, then supports a rebound into the parasympathetic (rest-and-digest) state — helping to build resilience to stress and improve emotional regulation.',
          },
          {
            title: 'Muscle Recovery',
            description:
              'Vasoconstriction reduces inflammation, muscle soreness, and swelling. When followed by re-warming, it improves circulation and speeds up recovery after intense training.',
          },
          {
            title: 'Improved Circulation',
            description:
              'Cold exposure stimulates blood flow by forcing the cardiovascular system to adapt — strengthening blood vessels and improving oxygen delivery throughout the body.',
          },
          {
            title: 'Mental Clarity & Resilience',
            description:
              'Short-term cold stress has been shown to elevate mood and sharpen focus by increasing norepinephrine up to 5x baseline. Regular exposure builds mental toughness and stress adaptation.',
          },
        ],
        process: [
          {
            step: '01',
            title: 'Preparation',
            description:
              'Begin with a rinse shower and a brief consultation. Our team will guide you through proper techniques.',
          },
          {
            step: '02',
            title: 'Gradual Exposure',
            description:
              "Start with a 30-second to 1-minute immersion, gradually building tolerance. If you can stay in for 3–5 minutes at 40°F or 10 minutes at 50°F, you're hitting what we consider superior tolerance.",
          },
          {
            step: '03',
            title: 'Breathing Focus',
            description:
              'Practice controlled breathing to manage the cold shock response and maximize benefits.',
          },
          {
            step: '04',
            title: 'Recovery',
            description:
              'Warm up gradually. We recommend contrast therapy by alternating between our saunas and cold plunges.',
          },
        ],
        ctaTitle: 'Ready to Experience Cold Plunge?',
        ctaText: 'Book your first session and discover the transformative benefits of cold therapy',
        order: 1,
      },
      {
        id: 'infrared-sauna',
        title: 'Infrared Sauna',
        subtitle: 'Deep tissue warming for detoxification & relaxation',
        description:
          'Infrared saunas introduce a modern, evidence-based approach to the ancient heat ritual. Unlike traditional saunas, which heat the air around you, infrared saunas use specific wavelengths of light, typically in the far-infrared range to warm the body directly. This allows for a deep, penetrating heat that stimulates the body at lower ambient temperatures (typically 120-150°F), making the experience more accessible and less taxing on the cardiovascular system.',
        backgroundImage: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
        heroImage: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
        textureImage: 'https://media.vitalicesf.com/embers_closeup.jpg',
        accentColor: '#E74C3C',
        tagline: 'Release the strain. Welcome the repair.',
        benefits: [
          {
            title: 'Deep Tissue Penetration',
            description:
              'The infrared light penetrates up to 1.5 inches beneath the skin, triggering a thermal effect at the cellular level for enhanced therapeutic benefits.',
          },
          {
            title: 'Improved Circulation',
            description:
              'Increased circulation and oxygen delivery to tissues, supporting faster recovery and tissue repair.',
          },
          {
            title: 'Detoxification',
            description:
              'Improved detoxification by stimulating perspiration and promoting cellular cleansing.',
          },
          {
            title: 'Stress Relief',
            description:
              'Stress relief via parasympathetic nervous system activation, promoting deep relaxation and mental clarity.',
          },
        ],
        process: [
          {
            step: '01',
            title: 'Preparation',
            description:
              'Arrive clean and hydrated, remove any metal jewelry, change into swimwear. Our staff will explain the session and safety guidelines.',
          },
          {
            step: '02',
            title: 'Session',
            description:
              'Spend 20-30 minutes in our infrared sauna at 120-140°F, much lower than traditional saunas. Meditation, breathing exercises and stretching all compliment the sauna very well.',
          },
          {
            step: '03',
            title: 'Hydration',
            description:
              "Stay well-hydrated throughout your session and listen to your body's signals.",
          },
          {
            step: '04',
            title: 'Cool Down',
            description:
              'Gradually cool down. We recommend contrast therapy by alternating between our IR sauna and cold plunges.',
          },
        ],
        ctaTitle: 'Ready to Experience Infrared Sauna?',
        ctaText:
          'Book your session and experience the deep therapeutic benefits of infrared heat therapy',
        order: 2,
      },
      {
        id: 'traditional-sauna',
        title: 'Traditional Sauna',
        subtitle: 'Classic Finnish-style dry heat therapy',
        description:
          'Rooted in centuries of Nordic tradition, the traditional sauna is a centuries old method of recovery and revitalization. Heated between 160-200°F, it uses dry air and radiant heat to create a full-body sweat experience that promotes deep relaxation and physiological reset.',
        backgroundImage: 'https://media.vitalicesf.com/sauna-traditional.jpg',
        heroImage: 'https://media.vitalicesf.com/sauna-traditional.jpg',
        textureImage: 'https://media.vitalicesf.com/lavastones.jpg',
        accentColor: '#F39C12',
        tagline: 'Embrace the heat. Emerge renewed.',
        benefits: [
          {
            title: 'Muscle Recovery',
            description:
              'Muscle recovery and inflammation reduction through deep heat penetration and improved circulation.',
          },
          {
            title: 'Detoxification',
            description:
              'Detoxification through elevated perspiration, promoting natural cleansing and waste removal.',
          },
          {
            title: 'Cardiovascular Stimulation',
            description:
              'Cardiovascular stimulation, mimicking the effects of light aerobic exercise for heart health.',
          },
          {
            title: 'Mental Clarity',
            description:
              'Activation of the parasympathetic nervous system for stress relief and mental clarity.',
          },
        ],
        process: [
          {
            step: '01',
            title: 'Preparation',
            description:
              'Arrive clean and hydrated, remove any metal jewelry, change into swimwear. Our staff will explain the session and safety guidelines.',
          },
          {
            step: '02',
            title: 'Session',
            description:
              "Spend 10-20 minutes in the sauna at 160-200°F, listening to your body's signals. Meditation, breathing exercises and stretching all compliment the sauna very well.",
          },
          {
            step: '03',
            title: 'Hydration',
            description:
              "Stay well-hydrated throughout your session and listen to your body's signals.",
          },
          {
            step: '04',
            title: 'Cool Down',
            description:
              'Gradually cool down. We recommend contrast therapy by alternating between our sauna and cold plunges.',
          },
        ],
        ctaTitle: 'Ready to Experience Traditional Sauna?',
        ctaText: 'Book your session and experience the authentic Finnish sauna tradition',
        order: 3,
      },
      {
        id: 'compression-boots',
        title: 'Compression Boots',
        subtitle: 'Advanced compression therapy for circulation & recovery',
        description:
          'Compression boot therapy uses advanced pneumatic compression technology to enhance circulation and accelerate recovery. This non-invasive treatment applies rhythmic pressure to your legs, mimicking the natural muscle pump action to improve blood flow and lymphatic drainage. Perfect for athletes, active individuals, or anyone seeking improved circulation and faster recovery.',
        backgroundImage: 'https://media.vitalicesf.com/cells-bloodcells.jpg',
        heroImage: 'https://media.vitalicesf.com/stone_whitesky.jpg',
        textureImage: 'https://media.vitalicesf.com/texture_blacksand-landscape.jpg',
        accentColor: '#8B5CF6',
        tagline: 'Compress the stress. Release the relief.',
        benefits: [
          {
            title: 'Circulatory Support',
            description:
              'Sequential compression enhances venous return and stimulates blood flow, helping deliver nutrients and oxygen to muscle tissue while removing waste byproducts like lactic acid.',
          },
          {
            title: 'Reduced Swelling & Inflammation',
            description:
              'By promoting lymphatic drainage and reducing fluid buildup, compression therapy can ease swelling and inflammation caused by intense training, long periods of standing, or injury.',
          },
          {
            title: 'Muscle Recovery & Soreness Relief',
            description:
              'Helps decrease delayed onset muscle soreness (DOMS) and promotes faster muscle repair by increasing circulation and reducing stagnation in fatigued limbs.',
          },
          {
            title: 'Enhanced Lymphatic Function',
            description:
              "Supports healthy lymphatic flow, aiding the body's detoxification processes and immune response — especially beneficial after travel, illness, or physical stress.",
          },
        ],
        process: [
          {
            step: '01',
            title: 'Assessment & Prep',
            description:
              "We'll explain the compression therapy process, help you get set up in the boots and sitting back in one of our zero gravity chairs with your legs elevated.",
          },
          {
            step: '02',
            title: 'Session',
            description:
              'Relax for 15-20 minutes while the compression boots provide rhythmic pressure therapy.',
          },
          {
            step: '03',
            title: 'Monitoring',
            description:
              'Adjust and optimize the pressure settings with device controls to suit yourself.',
          },
          {
            step: '04',
            title: 'Recovery',
            description: 'Feel immediate relief and improved circulation after your session.',
          },
        ],
        ctaTitle: 'Ready to Experience Compression Therapy?',
        ctaText:
          'Book your session and accelerate your recovery with advanced compression technology',
        order: 4,
      },
      {
        id: 'percussion-massage',
        title: 'Percussion Massage',
        subtitle: 'Deep tissue percussion therapy for muscle recovery',
        description:
          'Percussion massage therapy uses advanced percussive technology to deliver deep tissue massage that targets muscle tension and promotes recovery. This innovative therapy combines the benefits of traditional massage with modern technology to provide more consistent and effective treatment. The percussive action helps break up muscle knots, improve blood flow, and accelerate recovery.',
        backgroundImage: 'https://media.vitalicesf.com/percussion_bicep.jpg',
        heroImage: 'https://media.vitalicesf.com/texture_blackmarble-cracks.jpg',
        textureImage: 'https://media.vitalicesf.com/texture_blackrock.jpg',
        accentColor: '#2ECC71',
        tagline: 'Break the tension. Build the strength.',
        benefits: [
          {
            title: 'Increased Circulation',
            description:
              'Percussive pulses stimulate blood flow and deliver oxygen-rich nutrients to muscle tissue, aiding repair and reducing recovery time.',
          },
          {
            title: 'Soreness & Tension Relief',
            description:
              'Breaks up knots and adhesions, alleviates muscle tightness, and decreases delayed onset muscle soreness (DOMS) after physical activity.',
          },
          {
            title: 'Improved Range of Motion',
            description:
              'Loosens stiff muscle groups and fascia, improving flexibility and mobility — especially beneficial pre-workout or after long periods of sitting.',
          },
          {
            title: 'Neuromuscular Activation',
            description:
              'Helps wake up sluggish muscles and reset neuromuscular pathways, making it an effective warm-up tool for both training and daily movement.',
          },
        ],
        process: [
          {
            step: '01',
            title: 'Consultation',
            description: 'Allow us to show you the correct techniques for your specific needs.',
          },
          {
            step: '02',
            title: 'Treatment',
            description:
              'Receive targeted percussion therapy on required muscle groups. Focus directly on and around knots and adhesions.',
          },
          {
            step: '03',
            title: 'Technique',
            description:
              'Focusing directly on and around knots and adhesions, move the massager slowly and in control allowing the device to do the work itself. Adjust pressure and speed based on your comfort and needs.',
          },
          {
            step: '04',
            title: 'Recovery',
            description: 'Experience immediate relief and improved muscle function.',
          },
        ],
        ctaTitle: 'Ready to Experience Percussion Therapy?',
        ctaText:
          'Book your session and experience deep tissue relief with advanced percussion technology',
        order: 5,
      },
      {
        id: 'red-light-therapy',
        title: 'Red Light Therapy',
        subtitle: 'Therapeutic light for cellular regeneration & skin health',
        description:
          "Red Light Therapy, scientifically known as photobiomodulation, is a non-invasive treatment that uses specific wavelengths of red and near-infrared light to stimulate cellular function and support tissue repair. Unlike ultraviolet light, which can damage the skin, red and infrared light penetrate safely beneath the surface — reaching muscles, joints, and even mitochondria (your cells' energy engine).",
        backgroundImage: 'https://media.vitalicesf.com/redlight_mask.jpg',
        heroImage: 'https://media.vitalicesf.com/redlight_jellyfish.jpg',
        textureImage: 'https://media.vitalicesf.com/light_blurryhues.jpg',
        accentColor: '#E91E63',
        tagline: 'Illuminate the healing. Ignite the recovery.',
        benefits: [
          {
            title: 'Cellular Energy Production',
            description:
              'Stimulates cytochrome c oxidase in mitochondria, enhancing ATP (energy) production and boosting cellular performance.',
          },
          {
            title: 'Skin Health & Anti-Aging',
            description:
              'Improved skin tone, collagen production, and wound healing with regular use.',
          },
          {
            title: 'Pain Relief',
            description:
              'Reduced inflammation and pain relief, especially for joint, tendon, and back pain.',
          },
          {
            title: 'Neurological Benefits',
            description:
              'Supports cognitive function and brain health, reducing symptoms of anxiety and seasonal depression.',
          },
        ],
        process: [
          {
            step: '01',
            title: 'Preparation',
            description: 'Remove any makeup or lotions and ensure skin is clean and dry.',
          },
          {
            step: '02',
            title: 'Treatment',
            description:
              'Sit or lie comfortably while the red light penetrates your skin for 10-20 minutes.',
          },
          {
            step: '03',
            title: 'Protection',
            description:
              'No special protection needed - red light therapy is safe and non-damaging.',
          },
          {
            step: '04',
            title: 'Results',
            description:
              'Experience gradual improvements in skin health and pain relief over time.',
          },
          {
            step: '05',
            title: 'Combine',
            description:
              'Enhance your recovery by pairing compression therapy with one of our rejuvenating red light masks.',
          },
        ],
        ctaTitle: 'Ready to Experience Red Light Therapy?',
        ctaText:
          'Book your session and discover the regenerative power of therapeutic light treatment',
        order: 6,
      },
    ];

    return services;
  } catch (error) {
    console.error('❌ Error parsing services data:', error.message);
    return [];
  }
}

// Parse business info data
function parseBusinessInfo() {
  return {
    name: 'Vital Ice',
    description:
      'Live Better — Together. Recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices.',
    tagline: 'Live Better — Together',
    phone: '+1-415-555-0123',
    email: 'info@vitalicesf.com',
    website: 'https://www.vitalicesf.com',
    address: {
      street: '2400 Chestnut St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94123',
      country: 'US',
    },
    coordinates: {
      latitude: 37.800111,
      longitude: -122.443048,
    },
    hours: [
      { day: 'Monday', open: '06:00', close: '22:00' },
      { day: 'Tuesday', open: '06:00', close: '22:00' },
      { day: 'Wednesday', open: '06:00', close: '22:00' },
      { day: 'Thursday', open: '06:00', close: '22:00' },
      { day: 'Friday', open: '06:00', close: '22:00' },
      { day: 'Saturday', open: '08:00', close: '20:00' },
      { day: 'Sunday', open: '08:00', close: '20:00' },
    ],
    services: [
      'Cold Plunge Therapy',
      'Infrared Sauna',
      'Traditional Sauna',
      'Red Light Therapy',
      'Compression Boot Therapy',
      'Percussion Massage',
    ],
    businessCategories: [
      'Wellness Center',
      'Spa',
      'Health Club',
      'Recovery Center',
      'Cold Therapy Center',
      'Sauna Facility',
    ],
    priceRange: '$',
    paymentMethods: ['Cash', 'Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
    amenities: [
      'Cold Plunge Pools',
      'Infrared Sauna',
      'Traditional Sauna',
      'Red Light Therapy',
      'Compression Therapy',
      'Massage Therapy',
      'Changing Rooms',
      'Towel Service',
      'Parking Available',
    ],
    socialMedia: {
      instagram: 'https://www.instagram.com/vitalice',
      facebook: 'https://www.facebook.com/vitalice',
      linkedin: 'https://www.linkedin.com/company/vitalice',
    },
    foundedYear: 2024,
    employeeCount: '2-10',
    areaServed: [
      'San Francisco',
      'Marina District',
      'Pacific Heights',
      'Cow Hollow',
      'Russian Hill',
      'Presidio',
      'Fillmore',
    ],
  };
}

// Parse SEO metadata from metadata.ts file
function parseSEOMetadata(content) {
  // Extract pageMetadata object from the file
  // This is a simplified parser - in production you'd want a proper TypeScript parser
  const metadata = {};

  // For now, return the hardcoded metadata structure
  // In a full implementation, we'd parse the actual file content
  return {
    home: {
      title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
      description:
        'Cold plunge therapy, infrared sauna & red light therapy in San Francisco Marina District. Premium recovery & wellness center. Book your session today.',
      keywords: [
        'cold therapy',
        'cold plunge',
        'infrared sauna',
        'traditional sauna',
        'recovery',
        'wellness',
        'San Francisco',
        'red light therapy',
        'compression therapy',
        'percussion massage',
      ],
      openGraph: {
        title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
        description:
          'Experience transformative recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices. Located in San Francisco.',
        image: 'https://media.vitalicesf.com/seo/desktop-home.png',
      },
      twitter: {
        title: 'Vital Ice | Cold Plunge, Sauna & Recovery in San Francisco',
        description:
          'Experience transformative recovery and wellness through cold therapy, red light therapy, sauna, and traditional healing practices. Located in San Francisco.',
        image: 'https://media.vitalicesf.com/seo/desktop-home.png',
      },
    },
    services: {
      title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
      description:
        'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
      openGraph: {
        title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
        description:
          'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
        image: 'https://media.vitalicesf.com/seo/desktop-services.png',
      },
      twitter: {
        title: 'Wellness Services | Cold Therapy, Sauna & Recovery',
        description:
          'Cold plunge therapy, infrared sauna & red light therapy in San Francisco. Compression boots, percussion massage & traditional sauna. Book your session.',
        image: 'https://media.vitalicesf.com/seo/desktop-services.png',
      },
    },
    about: {
      title: 'About Vital Ice | Our Story & Mission',
      description:
        "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
      openGraph: {
        title: 'About Vital Ice | Our Story & Mission',
        description:
          "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
        image: 'https://media.vitalicesf.com/seo/desktop-about.png',
      },
    },
    contact: {
      title: 'Contact Vital Ice | San Francisco Wellness Center',
      description:
        "Contact Vital Ice, San Francisco's premier wellness center. Visit us in the Marina District or reach out to book your session.",
      openGraph: {
        title: 'Contact Vital Ice | San Francisco Wellness Center',
        description:
          "Contact Vital Ice, San Francisco's premier wellness center. Visit us in the Marina District or reach out to book your session.",
        image: 'https://media.vitalicesf.com/seo/desktop-contact.png',
      },
    },
    faq: {
      title: 'FAQ | Frequently Asked Questions - Vital Ice',
      description:
        "Find answers to frequently asked questions about Vital Ice's services, booking, policies, and wellness programs.",
      openGraph: {
        title: 'FAQ | Frequently Asked Questions - Vital Ice',
        description:
          "Find answers to frequently asked questions about Vital Ice's services, booking, policies, and wellness programs.",
        image: 'https://media.vitalicesf.com/seo/desktop-faq.png',
      },
    },
    book: {
      title: 'Book Your Recovery Session - Vital Ice',
      description:
        'Book your recovery and wellness session at Vital Ice. Schedule cold plunge, sauna, red light therapy, and more.',
      openGraph: {
        title: 'Book Your Recovery Session - Vital Ice',
        description:
          'Book your recovery and wellness session at Vital Ice. Schedule cold plunge, sauna, red light therapy, and more.',
        image: 'https://media.vitalicesf.com/seo/desktop-book.png',
      },
    },
    experience: {
      title: 'Experience Vital Ice - San Francisco Wellness Center',
      description:
        "Experience Vital Ice's state-of-the-art facility featuring cold plunge therapy, infrared sauna, traditional sauna, and recovery services.",
      openGraph: {
        title: 'Experience Vital Ice - San Francisco Wellness Center',
        description:
          "Experience Vital Ice's state-of-the-art facility featuring cold plunge therapy, infrared sauna, traditional sauna, and recovery services.",
        image: 'https://media.vitalicesf.com/seo/desktop-experience.png',
      },
    },
    'cold-plunge': {
      title: 'Cold Plunge Therapy | Vital Ice San Francisco',
      description:
        'Cold plunge therapy at Vital Ice San Francisco. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery.',
      openGraph: {
        title: 'Cold Plunge Therapy | Vital Ice San Francisco',
        description:
          'Cold plunge therapy at Vital Ice San Francisco. 40-50°F immersion for reduced inflammation, mental clarity, and faster recovery.',
        image: 'https://media.vitalicesf.com/seo/desktop-cold-plunge.png',
      },
    },
    'infrared-sauna': {
      title: 'Infrared Sauna | Vital Ice San Francisco',
      description:
        'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
      openGraph: {
        title: 'Infrared Sauna | Vital Ice San Francisco',
        description:
          'Experience infrared sauna therapy at Vital Ice. 120-150°F deep tissue heating for detoxification, pain relief, and stress reduction.',
        image: 'https://media.vitalicesf.com/seo/desktop-infrared-sauna.png',
      },
    },
    'traditional-sauna': {
      title: 'Traditional Sauna | Vital Ice San Francisco',
      description:
        'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
      openGraph: {
        title: 'Traditional Sauna | Vital Ice San Francisco',
        description:
          'Experience traditional sauna therapy at Vital Ice. 160-200°F heat therapy for cardiovascular health, muscle recovery, and immune support.',
        image: 'https://media.vitalicesf.com/seo/desktop-traditional-sauna.png',
      },
    },
    'red-light-therapy': {
      title: 'Red Light Therapy | Vital Ice San Francisco',
      description:
        'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
      openGraph: {
        title: 'Red Light Therapy | Vital Ice San Francisco',
        description:
          'Red light therapy at Vital Ice. Low-level light therapy for cellular regeneration, skin health, and anti-aging benefits in San Francisco.',
        image: 'https://media.vitalicesf.com/seo/desktop-red-light-therapy.png',
      },
    },
    'compression-boots': {
      title: 'Compression Boots | Vital Ice San Francisco',
      description:
        'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
      openGraph: {
        title: 'Compression Boots | Vital Ice San Francisco',
        description:
          'Experience compression boot therapy at Vital Ice. Sequential compression therapy for improved circulation, muscle recovery, and lymphatic drainage.',
        image: 'https://media.vitalicesf.com/seo/desktop-compression-boots.png',
      },
    },
    'percussion-massage': {
      title: 'Percussion Massage | Vital Ice San Francisco',
      description:
        'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
      openGraph: {
        title: 'Percussion Massage | Vital Ice San Francisco',
        description:
          'Experience percussion massage therapy at Vital Ice. Deep tissue percussion therapy for muscle recovery, pain relief, and improved mobility.',
        image: 'https://media.vitalicesf.com/seo/desktop-percussion-massage.png',
      },
    },
  };
}

// Parse FAQ content from FAQPageClient.tsx
function parseFAQContent(content) {
  if (!content) return [];

  // Extract FAQ array from the component
  const faqMatch = content.match(/const faqs = \[([\s\S]*?)\];/);
  if (!faqMatch) {
    console.warn('⚠️  Could not parse FAQ content from file');
    return [];
  }

  // Parse the FAQ array - this is a simplified parser
  // In production, you'd want a proper AST parser
  const faqs = [];
  const faqItems = faqMatch[1].match(
    /{\s*question:\s*['"](.*?)['"],\s*answer:\s*['"](.*?)['"]\s*}/g
  );

  if (faqItems) {
    faqItems.forEach((item, index) => {
      const questionMatch = item.match(/question:\s*['"](.*?)['"]/);
      const answerMatch = item.match(/answer:\s*['"](.*?)['"]/);

      if (questionMatch && answerMatch) {
        faqs.push({
          question: questionMatch[1],
          answer: answerMatch[1].replace(/\\n/g, '\n').replace(/\\'/g, "'"),
        });
      }
    });
  }

  // Fallback: return hardcoded FAQs if parsing fails
  if (faqs.length === 0) {
    return [
      {
        question: 'How do I book a session?',
        answer:
          "You can book sessions directly on our website, through the Mindbody Online portal / Mindbody app, downloading our App, or by visiting our location. We recommend booking in advance, although it's not required, especially for off peak hours.",
      },
      {
        question: 'What services does Vital Ice offer?',
        answer:
          'Vital Ice offers a comprehensive recovery experience including cold plunge therapy, traditional sauna, infrared sauna, red light therapy, compression boots, and percussion massage.',
      },
      {
        question: 'What should I bring for my first visit?',
        answer:
          "Bring clean workout clothes or swimwear, a towel, and a water bottle. We provide towels, but you're welcome to bring your own. Lockers are available for your belongings.",
      },
      {
        question: 'Are there any health restrictions?',
        answer:
          'While our services are generally safe, we recommend consulting with your healthcare provider if you have cardiovascular conditions, are pregnant, or have other health concerns.',
      },
      {
        question: 'How long should I stay in the cold plunge?',
        answer:
          'Start with 1-3 minutes and gradually increase your tolerance. We urge our customers to challenge their limits, but always listen to your body and never force yourself to stay longer than comfortable.',
      },
      {
        question: "What's the difference between traditional and infrared sauna?",
        answer:
          'Traditional saunas use heated air to warm your body, while infrared saunas use light waves to directly heat your body tissues. Infrared saunas typically operate at lower temperatures but can provide deeper tissue penetration.',
      },
      {
        question: 'Do you offer memberships?',
        answer:
          'Yes! In addition to visit packs, we offer month to month membership options including unlimited community and private room memberships.',
      },
      {
        question: 'Can I bring a guest?',
        answer:
          'Guest policies vary by membership type. Private room memberships include limited complimentary guest passes, additional guest passes can be purchased for private room visits.',
      },
      {
        question: "What's your cancellation policy?",
        answer:
          'We require 24-hour notice for cancellations. Late cancellations or no-shows may incur fees: $20 for contrast therapy sessions and $10 for recovery amenities.',
      },
      {
        question: 'Do you offer gift cards?',
        answer:
          'Yes! Gift cards are available for any amount and make perfect gifts for wellness enthusiasts. They expire 12 months after purchase.',
      },
      {
        question: 'Do your passes expire?',
        answer:
          'Yes, all single visits or visits remaining in packs expire 6 months after the date of purchase.',
      },
      {
        question: 'Is there an age requirement?',
        answer:
          'You must be at least 18 years old to use our services. Minors aged 14-17 may require adult supervision. Children under 14 are not permitted.',
      },
      {
        question: 'What are your hours of operation?',
        answer:
          "Our operating hours vary by day: Monday-Friday we're open 6AM-10AM, 12PM-2PM, and 4PM-9PM. Saturdays we're open 7AM-9PM, and Sundays we're open 8AM-7PM.",
      },
      {
        question: 'Do you provide towels and amenities?',
        answer:
          'Yes, we provide towels, hygiene products & toiletries, and locker storage. We also offer refreshments, merchandise and health and wellness products for purchase at our store.',
      },
      {
        question: "Can I use the facilities if I'm not feeling well?",
        answer:
          "While our services may aid in recovery, we ask that you stay home if you're experiencing any illness symptoms. This helps protect our community and staff.",
      },
      {
        question: 'Do you offer corporate memberships?',
        answer:
          'Yes! We offer corporate wellness programs and group memberships. These can include team building events, wellness workshops, and discounted rates for companies.',
      },
      {
        question: 'Do you offer discounts for teams and clubs?',
        answer:
          'Yes! We offer discounts for groups visiting with association to a team/club/group in excess of 6 members. Contact us to learn more before your visit.',
      },
    ];
  }

  return faqs;
}

// Parse testimonials from Testimonials.tsx
function parseTestimonials(content) {
  if (!content) return [];

  // Extract testimonials array
  const testimonialsMatch = content.match(/const testimonials = \[([\s\S]*?)\];/);
  if (!testimonialsMatch) {
    console.warn('⚠️  Could not parse testimonials from file');
    return [];
  }

  const testimonials = [];

  // Fallback: return hardcoded testimonials
  return [
    {
      quote: 'Cold Water is merciless, but righteous.',
      author: 'Wim Hoff',
      role: 'The Iceman',
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      accent: '#00b7b5',
    },
    {
      quote:
        "Sauna bathing is almost like walking on a treadmill… but all you're doing is sitting in the heat.",
      author: 'Dr. Purvi Parikh',
      role: 'MD, Allergist & Immunologist',
      image: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      accent: '#f56f0d',
    },
    {
      quote: 'Conquer your inner bitch.',
      author: 'Joe Rogan',
      role: 'Podcast Host & Comedian',
      image: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      accent: '#f56f0d',
    },
    {
      quote:
        "It's absolute agony, and I dread it, but it allows my body to recover so much more quickly.",
      author: 'Paula Radcliffe',
      role: 'Triathlete & Long-Distance Runner',
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      accent: '#00b7b5',
    },
    {
      quote: 'A person grows by facing resistance — and cold is a pure form of that.',
      author: 'Dr. Andrew Huberman',
      role: 'Neuroscientist',
      image: 'https://media.vitalicesf.com/moon-yosemite.jpg',
      accent: '#8b4513',
    },
    {
      quote: "True strength is in the recovery. That's where the body and mind rebuild.",
      author: 'Tom Brady',
      role: 'NFL Quarterback',
      image: 'https://media.vitalicesf.com/embers_vertical.jpg',
      accent: '#2d1810',
    },
    {
      quote:
        'Building your tolerance to cold water should be slow and gradual. Start with a few minutes and increase steadily.',
      author: 'Dr. Tracy Zaslow',
      role: 'Sports Physician',
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      accent: '#00b7b5',
    },
    {
      quote:
        "Using the sauna regularly changed the way I recover. It's not just heat — it's therapy.",
      author: 'Lebron James',
      role: 'NBA Player',
      image: 'https://media.vitalicesf.com/sauna-traditional.jpg',
      accent: '#ff6b35',
    },
    {
      quote:
        "With women's bodies, we need to support homeostasis, not fight it… Hormetic stressors help homeostasis.",
      author: 'Dr. Jaime Seeman',
      role: 'OB-GYN',
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      accent: '#00b7b5',
    },
    {
      quote: 'Sometimes you just gotta get a little comfortable with being uncomfortable.',
      author: 'Seamus Mullen',
      role: 'Chef & Wellness Advocate',
      image: 'https://media.vitalicesf.com/moon-yosemite.jpg',
      accent: '#8b4513',
    },
    {
      quote: 'Cold water is phenomenal. It has saved my life. In the water, I can do anything.',
      author: 'Menopausal Swimmer',
      role: 'UCL Study Participant',
      image: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
      accent: '#00b7b5',
    },
    {
      quote: 'Sauna bathing has been linked to improved mental health and mood regulation.',
      author: 'Dr. Rhonda Patrick',
      role: 'Biomedical Scientist',
      image: 'https://media.vitalicesf.com/sauna-traditional.jpg',
      accent: '#ff6b35',
    },
    {
      quote:
        'Sauna sessions provide cardiovascular benefits, neuroprotection, and stress reduction.',
      author: 'Dr. Rhonda Patrick',
      role: 'Biomedical Scientist',
      image: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
      accent: '#f56f0d',
    },
  ];
}

// Parse About page content
function parseAboutContent(content) {
  if (!content) return null;

  return {
    values: [
      {
        title: 'Contrast Therapy',
        description:
          'Every session leaves you feeling restored and focused. The alternating cycles of hot and cold create a powerful physiological response that enhances circulation, reduces inflammation, and promotes faster recovery.',
        color: '#00b7b5',
      },
      {
        title: 'Community',
        description:
          "We believe we live better, together. Our space is built for connection and shared goals. Whether you're seeking personal rejuvenation or shared experiences, our members find belonging here.",
        color: '#9ec7c5',
      },
      {
        title: 'Wellness',
        description:
          "It's more than recovery. It's a core ritual for balance, longevity and wellbeing. We focus on holistic health that encompasses physical recovery, mental clarity, and emotional resilience.",
        color: '#ebede5',
      },
      {
        title: 'Integrity & Simplicity',
        description:
          'With thoughtfully chosen materials, sustainable operations, flexible and transparent service, we strive for integrity in every detail. We believe in doing things right, not just doing them.',
        color: '#7a9e9d',
      },
    ],
    team: [
      {
        name: 'Stephen',
        role: 'Co-Founder',
        bio: "I am an Irish immigrant and a hairstylist by trade, and I've always loved helping people feel better — whether that's through a great haircut or simply offering small moments of calm in the midst of busy lives. Fitness has been part of my life from a young age, but as I got older I realized that recovery matters just as much.\n\nVital Ice started because I needed it myself. Life gets a little chaotic sometimes, and contrast therapy became my way to slow things down, clear my head, and hit the reset button. I never imagined it would grow into this — a space where people come together to feel better.\n\nMy personal goal is to create a space where recovery feels accessible, ritual— and shared by the community",
        shortBio:
          "I am an Irish immigrant and a hairstylist by trade, and I've always loved helping people feel better — whether that's through a great haircut or simply offering small moments of calm in the midst of busy lives. Fitness has been part of my life from a young age, but as I got older I realized that recovery matters just as much.",
      },
      {
        name: 'Sean',
        role: 'Co-Founder',
        bio: "I'm a Chicago native, born and raised. At 16, my family relocated to Ireland, where I completed my degree in Electrical Engineering. My journey ultimately brought me to San Francisco, where I now work in business development within the physical security industry.\n\nMy passion for health and wellness is deeply tied to how I spend my free time. In Ireland, I discovered Gaelic Football and went on to compete at the highest level before returning to the States. Today, I still play in the local league here in SF. Sport inspired me to relentlessly pursue the optimization of my health. Contrast therapy—especially cold exposure—has long been a cornerstone of recovery for elite athletes around the world. I have consistently relied on it to stay strong and healthy.\n\nIn a world full of toxins and distractions, I believe more than ever in the importance of accessible recovery—and meaningful connection. We thrive when we feel good, and even more so when we do it together. I hope Vital Ice creates that space and makes a lasting, positive impact on everyone who walks through our doors.",
        shortBio:
          "I'm a Chicago native, born and raised. At 16, my family relocated to Ireland, where I completed my degree in Electrical Engineering. My journey ultimately brought me to San Francisco, where I now work in business development within the physical security industry.",
      },
      {
        name: 'Barry',
        role: 'Co-Founder',
        bio: "Barry is a proud Irish immigrant, lifelong athlete, secretary of a local Gaelic football team and the founder & operator of a successful general contracting business here in the Bay Area. A husband, a father, and a tireless worker, Barry brings a rare mix of grit, heart, and craftsmanship to everything he does.\n\nHis passion for sports and physical performance has shaped much of his life, and that same drive shows up in his work ethic today. As someone who understands the demands of building—both physically and professionally—he's a firm believer in the power of recovery and routine.\n\nBarry is the force behind the construction of the Vital Ice studio. His hands-on involvement ensures every inch of the space reflects intention, durability, and care. He's building more than walls—he's helping shape a space that gives back to the body, the mind, and the community.",
        shortBio:
          'Barry is a proud Irish immigrant, lifelong athlete, secretary of a local Gaelic football team and the founder & operator of a successful general contracting business here in the Bay Area. A husband, a father, and a tireless worker, Barry brings a rare mix of grit, heart, and craftsmanship to everything he does.',
      },
    ],
    story: {
      title: 'Our Story',
      paragraphs: [
        "Behind the name, we're just three local enthusiasts who wanted something simple: a place to cold plunge with our friends, close to home. When we couldn't find anything that felt right—affordable, high-quality, and built around community—we decided to create it ourselves. Vital Ice was built to bridge the gap between high-performance recovery and everyday accessibility.",
        'This started as a personal need and turned into something bigger: a space where people can reset, recover, and connect. No pressure. No BS. Just cold water, hot air, and the pride that comes with prioritizing your health and wellness.',
      ],
    },
  };
}

// Parse Insights/Blog articles
function parseInsightsArticles(content) {
  if (!content) return [];

  // Extract mockArticles array from the file
  // This is a simplified parser - in production you'd want a proper TypeScript parser
  // For now, we'll return the hardcoded articles structure
  // The actual articles are in the file, but parsing TypeScript arrays is complex
  // We'll need to manually extract or use a proper parser

  // Note: This function would ideally parse the TypeScript file
  // For now, we'll return an empty array and note that articles need manual migration
  // or a proper TypeScript parser
  console.warn(
    '⚠️  Insights articles parsing requires TypeScript parser - articles will need manual migration or proper parser implementation'
  );

  return [];
}

// Parse Server-Side SEO content
function parseServerSideSEO(content) {
  if (!content) return {};

  // Extract SEO_CONTENT object - includes all pages from ServerSideSEO.tsx
  return {
    home: {
      h1: 'Vital Ice - Cold Plunge, Red Light Therapy & Sauna in San Francisco',
      h2: [
        'Premier Wellness Center in San Francisco',
        'Cold Plunge Therapy Services',
        'Recovery and Wellness Programs',
      ],
      links: [
        { href: '/services', text: 'Our Services' },
        { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
        { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
        { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
        { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
        { href: '/services/compression-boots', text: 'Compression Boots' },
        { href: '/services/percussion-massage', text: 'Percussion Massage' },
        { href: '/experience', text: 'Experience Our Facility' },
        { href: '/about', text: 'About Vital Ice' },
        { href: '/book', text: 'Book Appointment' },
        { href: '/contact', text: 'Contact Us' },
        { href: '/faq', text: 'Frequently Asked Questions' },
      ],
      content:
        "Vital Ice is San Francisco's premier wellness center offering cold plunge therapy, red light therapy, sauna sessions, and recovery services. Located in the Marina District, we provide transformative wellness experiences through ancient healing practices and modern recovery techniques.",
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
        { href: '/about', text: 'About Vital Ice' },
        { href: '/faq', text: 'Frequently Asked Questions' },
      ],
      content:
        "Vital Ice offers comprehensive wellness services in San Francisco's Marina District. Our services include cold plunge therapy for inflammation reduction and mental clarity, infrared sauna for detoxification and relaxation, traditional sauna for deep heat therapy, red light therapy for cellular health and skin benefits, compression boots for muscle recovery and circulation, and percussion massage for deep tissue relief.",
    },
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
        { href: '/about', text: 'About Vital Ice' },
        { href: '/faq', text: 'FAQ' },
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
  };
}

// Transform service data to Sanity format
function transformServiceToSanity(service) {
  const doc = {
    _type: 'service',
    _id: `service-${service.id}`, // Add _id for createOrReplace
    title: service.title,
    slug: {
      _type: 'slug',
      current: service.id,
    },
    subtitle: service.subtitle,
    description: service.description,
    // Note: Images will need to be uploaded separately via migrate-assets.js
    // Images are optional - services can be created without them
    accentColor: {
      _type: 'color',
      hex: service.accentColor,
    },
    tagline: service.tagline,
    benefits: service.benefits.map(benefit => ({
      _type: 'benefit',
      title: benefit.title,
      description: benefit.description,
    })),
    process: service.process.map(step => ({
      _type: 'processStep',
      step: step.step,
      title: step.title,
      description: step.description,
    })),
    cta: {
      _type: 'object',
      title: service.ctaTitle,
      text: service.ctaText,
      button: {
        _type: 'ctaButton',
        text: 'Book Now',
        link: '/book',
        style: 'primary',
      },
    },
    order: service.order || 0,
    featured: service.order <= 3, // Feature first 3 services
    status: 'active',
  };

  // Only add image fields if we have image references (will be added after asset upload)
  // For now, skip images to allow services to be created
  // Images can be added later via: node scripts/migrate-assets.js

  // Add SEO settings
  doc.seo = {
    _type: 'seoSettings',
    title: `${service.title} | Vital Ice San Francisco`,
    description: service.subtitle,
    keywords: [service.title.toLowerCase(), 'vital ice', 'san francisco', 'wellness', 'recovery'],
  };

  return doc;
}

// Transform business info to Sanity format
function transformBusinessInfoToSanity(businessInfo) {
  return {
    _type: 'globalSettings',
    _id: 'globalSettings',
    businessInfo: {
      _type: 'businessInfo',
      name: businessInfo.name,
      description: businessInfo.description,
      tagline: businessInfo.tagline,
      phone: businessInfo.phone,
      email: businessInfo.email,
      website: businessInfo.website,
      address: {
        _type: 'object',
        street: businessInfo.address.street,
        city: businessInfo.address.city,
        state: businessInfo.address.state,
        zipCode: businessInfo.address.zipCode,
        country: businessInfo.address.country,
      },
      coordinates: {
        _type: 'object',
        latitude: businessInfo.coordinates.latitude,
        longitude: businessInfo.coordinates.longitude,
      },
      hours: businessInfo.hours.map((hour, index) => ({
        _key: `hour-${index}`,
        _type: 'object',
        day: hour.day,
        open: hour.open,
        close: hour.close,
        closed: hour.closed || false,
      })),
      services: businessInfo.services || [],
      businessCategories: businessInfo.businessCategories || [],
      priceRange: businessInfo.priceRange,
      paymentMethods: businessInfo.paymentMethods || [],
      amenities: businessInfo.amenities || [],
      foundedYear: businessInfo.foundedYear,
      employeeCount: businessInfo.employeeCount,
      areaServed: businessInfo.areaServed || [],
    },
    socialMedia: {
      _type: 'socialMedia',
      instagram: businessInfo.socialMedia.instagram,
      facebook: businessInfo.socialMedia.facebook,
      linkedin: businessInfo.socialMedia.linkedin,
    },
    seoDefaults: {
      _type: 'seoSettings',
      title: 'Vital Ice | Cold Plunge, Red Light Therapy & Sauna in San Francisco',
      description:
        "Live Better — Together. San Francisco's premier wellness center offering cold plunge therapy, red light therapy, and sauna sessions.",
      keywords: ['cold therapy', 'cold plunge', 'infrared sauna', 'wellness', 'San Francisco'],
    },
  };
}

// Migrate services to Sanity
async function migrateServices(client, services, dryRun = false) {
  console.log(`\n📋 Migrating ${services.length} services...`);

  const results = [];

  for (const service of services) {
    const sanityService = transformServiceToSanity(service);

    if (dryRun) {
      console.log(`   ✓ Would create service: ${service.title} (${service.id})`);
      results.push({ success: true, id: service.id, action: 'would-create' });
    } else {
      try {
        const result = await client.createOrReplace(sanityService);
        console.log(`   ✅ Created service: ${service.title} (${result._id})`);
        results.push({ success: true, id: result._id, action: 'created' });
      } catch (error) {
        console.error(`   ❌ Failed to create service ${service.title}:`, error.message);
        results.push({ success: false, id: service.id, error: error.message });
      }
    }
  }

  return results;
}

// Migrate business info to Sanity
async function migrateBusinessInfo(client, businessInfo, dryRun = false) {
  console.log('\n🏢 Migrating business information...');

  const sanityBusinessInfo = transformBusinessInfoToSanity(businessInfo);

  if (dryRun) {
    console.log('   ✓ Would create/update global settings');
    return { success: true, action: 'would-create' };
  } else {
    try {
      const result = await client.createOrReplace(sanityBusinessInfo);
      console.log(`   ✅ Created/updated global settings (${result._id})`);
      return { success: true, id: result._id, action: 'created' };
    } catch (error) {
      console.error('   ❌ Failed to create global settings:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Migrate SEO metadata to Sanity (as page documents)
async function migrateSEOMetadata(client, metadata, dryRun = false) {
  console.log('\n🔍 Migrating SEO metadata...');

  const results = [];

  for (const [pageKey, pageMeta] of Object.entries(metadata)) {
    const sanityPage = {
      _type: 'page',
      _id: `page-${pageKey}`,
      title: pageMeta.title,
      slug: {
        _type: 'slug',
        current: pageKey === 'home' ? '/' : pageKey,
      },
      seo: {
        _type: 'seoSettings',
        title: pageMeta.title,
        description: pageMeta.description,
        keywords: pageMeta.keywords || [],
        openGraph: pageMeta.openGraph
          ? {
              _type: 'object',
              title: pageMeta.openGraph.title,
              description: pageMeta.openGraph.description,
              // Note: Image will need to be uploaded separately
            }
          : undefined,
        twitter: pageMeta.twitter
          ? {
              _type: 'object',
              title: pageMeta.twitter.title,
              description: pageMeta.twitter.description,
              // Note: Image will need to be uploaded separately
            }
          : undefined,
      },
      content: [], // Empty content array - will be populated later
    };

    if (dryRun) {
      console.log(`   ✓ Would create page: ${pageKey}`);
      results.push({ success: true, id: pageKey, action: 'would-create' });
    } else {
      try {
        const result = await client.createOrReplace(sanityPage);
        console.log(`   ✅ Created page: ${pageKey} (${result._id})`);
        results.push({ success: true, id: result._id, action: 'created' });
      } catch (error) {
        console.error(`   ❌ Failed to create page ${pageKey}:`, error.message);
        results.push({ success: false, id: pageKey, error: error.message });
      }
    }
  }

  return results;
}

// Migrate FAQ content to Sanity (as page content blocks)
async function migrateFAQ(client, faqs, dryRun = false) {
  console.log('\n❓ Migrating FAQ content...');

  if (!faqs || faqs.length === 0) {
    console.log('   ⚠️  No FAQ content found');
    return [];
  }

  const results = [];

  // Create FAQ page with testimonials block containing all FAQs
  const faqPage = {
    _type: 'page',
    _id: 'page-faq',
    title: 'Frequently Asked Questions',
    slug: {
      _type: 'slug',
      current: 'faq',
    },
    content: [
      {
        _key: 'faq-text-section',
        _type: 'textSection',
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our services, policies, and facilities',
        content: faqs.map((faq, index) => ({
          _key: `faq-${index}`,
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: `Q: ${faq.question}\n\nA: ${faq.answer}`,
            },
          ],
          style: 'normal',
        })),
      },
    ],
    seo: {
      _type: 'seoSettings',
      title: 'FAQ | Frequently Asked Questions - Vital Ice',
      description:
        "Find answers to frequently asked questions about Vital Ice's services, booking, policies, and wellness programs.",
    },
    status: 'published',
  };

  if (dryRun) {
    console.log(`   ✓ Would create/update FAQ page with ${faqs.length} questions`);
    results.push({ success: true, id: 'faq', action: 'would-create', count: faqs.length });
  } else {
    try {
      const result = await client.createOrReplace(faqPage);
      console.log(`   ✅ Created/updated FAQ page with ${faqs.length} questions (${result._id})`);
      results.push({ success: true, id: result._id, action: 'created', count: faqs.length });
    } catch (error) {
      console.error('   ❌ Failed to create FAQ page:', error.message);
      results.push({ success: false, id: 'faq', error: error.message });
    }
  }

  return results;
}

// Migrate testimonials to Sanity (as testimonials content block)
async function migrateTestimonials(client, testimonials, dryRun = false) {
  console.log('\n💬 Migrating testimonials...');

  if (!testimonials || testimonials.length === 0) {
    console.log('   ⚠️  No testimonials found');
    return [];
  }

  const results = [];

  // Create testimonials block
  const testimonialsBlock = {
    _type: 'testimonials',
    title: 'What People Say',
    subtitle: 'Testimonials from wellness experts and athletes',
    testimonials: testimonials.map((testimonial, index) => {
      const testimonialObj = {
        _key: `testimonial-${index}`,
        _type: 'object',
        name: testimonial.author,
        title: testimonial.role,
        text: testimonial.quote,
        // Note: Images will need to be uploaded separately via migrate-assets.js
        // Images are optional - testimonials can be created without them
        featured: index < 3, // Feature first 3
      };
      // Only add image if we have one (will be added after asset upload)
      // For now, skip images to allow testimonials to be created
      return testimonialObj;
    }),
  };

  if (dryRun) {
    console.log(`   ✓ Would create testimonials block with ${testimonials.length} testimonials`);
    results.push({
      success: true,
      id: 'testimonials',
      action: 'would-create',
      count: testimonials.length,
    });
  } else {
    try {
      // Add testimonials to homepage or create a dedicated page
      // For now, we'll add it to the homepage content
      const homepage = await client.fetch('*[_type == "page" && slug.current == "/"][0]');
      if (homepage) {
        // Add _key to testimonials block if it doesn't have one
        if (!testimonialsBlock._key) {
          testimonialsBlock._key = 'testimonials-block';
        }
        const updatedContent = [...(homepage.content || []), testimonialsBlock];
        await client.patch(homepage._id).set({ content: updatedContent }).commit();
        console.log(`   ✅ Added ${testimonials.length} testimonials to homepage`);
        results.push({
          success: true,
          id: homepage._id,
          action: 'updated',
          count: testimonials.length,
        });
      } else {
        console.log('   ⚠️  Homepage not found, skipping testimonials migration');
        results.push({ success: false, id: 'testimonials', error: 'Homepage not found' });
      }
    } catch (error) {
      console.error('   ❌ Failed to migrate testimonials:', error.message);
      results.push({ success: false, id: 'testimonials', error: error.message });
    }
  }

  return results;
}

// Migrate About page content
async function migrateAboutPage(client, aboutContent, dryRun = false) {
  console.log('\n📖 Migrating About page content...');

  if (!aboutContent) {
    console.log('   ⚠️  No About page content found');
    return null;
  }

  const aboutPage = {
    _type: 'page',
    _id: 'page-about',
    title: 'About Vital Ice',
    slug: {
      _type: 'slug',
      current: 'about',
    },
    content: [
      {
        _key: 'about-hero',
        _type: 'hero',
        title: 'About Vital Ice',
        subtitle: 'Where ancient wisdom meets modern wellness',
      },
      {
        _key: 'about-story',
        _type: 'textSection',
        title: aboutContent.story.title,
        content: aboutContent.story.paragraphs.map((para, index) => ({
          _key: `story-para-${index}`,
          _type: 'block',
          children: [{ _type: 'span', text: para }],
          style: 'normal',
        })),
      },
      // Values section
      {
        _key: 'about-values',
        _type: 'textSection',
        title: 'Our Values',
        content: aboutContent.values.map((value, index) => ({
          _key: `value-${index}`,
          _type: 'block',
          children: [{ _type: 'span', text: `${value.title}: ${value.description}` }],
          style: 'normal',
        })),
      },
      // Team section
      {
        _key: 'about-team',
        _type: 'textSection',
        title: 'Our Team',
        content: aboutContent.team.map((member, index) => ({
          _key: `team-${index}`,
          _type: 'block',
          children: [
            { _type: 'span', text: `${member.name} - ${member.role}\n\n${member.shortBio}` },
          ],
          style: 'normal',
        })),
      },
    ],
    seo: {
      _type: 'seoSettings',
      title: 'About Vital Ice | Our Story & Mission',
      description:
        "Learn about Vital Ice, San Francisco's premier wellness center. Discover our mission, founders, and commitment to ancient healing practices.",
    },
    status: 'published',
  };

  if (dryRun) {
    console.log('   ✓ Would create/update About page');
    return { success: true, action: 'would-create' };
  } else {
    try {
      const result = await client.createOrReplace(aboutPage);
      console.log(`   ✅ Created/updated About page (${result._id})`);
      return { success: true, id: result._id, action: 'created' };
    } catch (error) {
      console.error('   ❌ Failed to create About page:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Migrate Insights/Blog articles to Sanity
async function migrateInsightsArticles(client, articles, dryRun = false) {
  console.log('\n📝 Migrating Insights/Blog articles...');

  if (!articles || articles.length === 0) {
    console.log('   ⚠️  No articles found or parsing not implemented');
    console.log(
      '   💡 Note: Article migration requires TypeScript parser or manual data extraction'
    );
    return [];
  }

  const results = [];

  for (const article of articles) {
    const articleDoc = {
      _type: 'article',
      _id: `article-${article.slug || article.id}`,
      title: article.title,
      slug: {
        _type: 'slug',
        current: article.slug,
      },
      subtitle: article.subtitle,
      abstract: article.abstract,
      coverImage: article.coverImage
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: `image-article-cover-${article.slug}`, // Placeholder - will be replaced with actual asset ID
            },
            alt: `${article.title} cover image`,
          }
        : undefined,
      heroImage: article.heroImage
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: `image-article-hero-${article.slug}`, // Placeholder
            },
            alt: `${article.title} hero image`,
          }
        : undefined,
      heroImageSplit: article.heroImageSplit
        ? {
            _type: 'object',
            left: article.heroImageSplit.left
              ? {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: `image-article-hero-left-${article.slug}`, // Placeholder
                  },
                  alt: `${article.title} hero left image`,
                }
              : undefined,
            right: article.heroImageSplit.right
              ? {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: `image-article-hero-right-${article.slug}`, // Placeholder
                  },
                  alt: `${article.title} hero right image`,
                }
              : undefined,
          }
        : undefined,
      // Note: Content will need to be converted from HTML to Portable Text
      // For now, we'll create a placeholder - this requires HTML to Portable Text conversion
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text:
                article.abstract ||
                article.subtitle ||
                'Content migration pending - HTML to Portable Text conversion needed',
            },
          ],
          style: 'normal',
        },
      ],
      category: article.category || 'Wellness Article',
      author: {
        _type: 'object',
        name:
          typeof article.author === 'string'
            ? article.author
            : article.author?.name || 'Vital Ice Team',
        role: typeof article.author === 'object' ? article.author.role : undefined,
        bio: typeof article.author === 'object' ? article.author.bio : undefined,
        avatar:
          typeof article.author === 'object' && article.author.avatar
            ? {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: `image-author-${article.slug}`, // Placeholder
                },
              }
            : undefined,
        social:
          typeof article.author === 'object' && article.author.social
            ? {
                _type: 'object',
                twitter: article.author.social.twitter,
                linkedin: article.author.social.linkedin,
                website: article.author.social.website,
              }
            : undefined,
      },
      tags: article.tags || [],
      status:
        article.status === 'published'
          ? 'published'
          : article.status === 'scheduled'
            ? 'scheduled'
            : 'draft',
      publishDate: article.publishDate || new Date().toISOString().split('T')[0],
      publishAt: article.publishAt ? new Date(article.publishAt).toISOString() : undefined,
      readingTime: article.readingTime,
      featured: false,
      pdfUrl: article.pdfUrl,
      seo: article.seo
        ? {
            _type: 'seoSettings',
            title: article.seo.title || `${article.title} | Vital Ice Insights`,
            description: article.seo.description || article.abstract,
            keywords: article.tags || [],
            openGraph: article.seo.ogImage
              ? {
                  _type: 'object',
                  title: article.seo.title || article.title,
                  description: article.seo.description || article.abstract,
                  image: article.seo.ogImage,
                }
              : undefined,
          }
        : undefined,
    };

    if (dryRun) {
      console.log(`   ✓ Would create article: ${article.title} (${article.slug})`);
      console.log(`     ⚠️  Note: HTML content needs conversion to Portable Text`);
      results.push({ success: true, id: article.slug, action: 'would-create' });
    } else {
      try {
        const result = await client.createOrReplace(articleDoc);
        console.log(`   ✅ Created article: ${article.title} (${result._id})`);
        console.log(`     ⚠️  Note: HTML content needs conversion to Portable Text`);
        results.push({ success: true, id: result._id, action: 'created' });
      } catch (error) {
        console.error(`   ❌ Failed to create article ${article.title}:`, error.message);
        results.push({ success: false, id: article.slug, error: error.message });
      }
    }
  }

  return results;
}

// Migrate Server-Side SEO content to pages
async function migrateServerSideSEO(client, seoContent, dryRun = false) {
  console.log('\n🔍 Migrating Server-Side SEO content...');

  if (!seoContent || Object.keys(seoContent).length === 0) {
    console.log('   ⚠️  No server-side SEO content found');
    return [];
  }

  const results = [];

  for (const [pageKey, content] of Object.entries(seoContent)) {
    try {
      // Find existing page
      const slug = pageKey === 'home' ? '/' : pageKey;
      const existingPage = await client.fetch(`*[_type == "page" && slug.current == "${slug}"][0]`);

      if (existingPage) {
        // Update page with server-side SEO content
        // Note: String arrays don't need _key when passed directly, but object arrays do
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

        if (dryRun) {
          console.log(`   ✓ Would update ${pageKey} with server-side SEO content`);
          results.push({ success: true, id: pageKey, action: 'would-update' });
        } else {
          await client.patch(existingPage._id).set(update).commit();
          console.log(`   ✅ Updated ${pageKey} with server-side SEO content`);
          results.push({ success: true, id: existingPage._id, action: 'updated' });
        }
      } else {
        console.log(`   ⚠️  Page ${pageKey} not found, skipping server-side SEO`);
        results.push({ success: false, id: pageKey, error: 'Page not found' });
      }
    } catch (error) {
      console.error(`   ❌ Failed to update ${pageKey}:`, error.message);
      results.push({ success: false, id: pageKey, error: error.message });
    }
  }

  return results;
}

// Validation functions
function validateMigratedContent(results) {
  console.log('\n🔍 Validating migrated content...');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`   ✅ Successful: ${successful.length}`);
  if (failed.length > 0) {
    console.log(`   ❌ Failed: ${failed.length}`);
    failed.forEach(f => {
      console.log(`      - ${f.id}: ${f.error}`);
    });
  }

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    isValid: failed.length === 0,
  };
}

// Main migration function
async function runMigration(options = {}) {
  const { dryRun = false, type = 'all' } = options;

  console.log('🚀 Starting Sanity content migration...');
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
  console.log(`   Type: ${type}`);
  console.log(`   Dataset: ${SANITY_CONFIG.dataset}`);

  // Validate environment
  validateEnvironment();

  // Create Sanity client
  const client = createSanityClient();

  // Load existing data
  const existingData = loadExistingData();

  // Parse data
  const services = parseServicesData(existingData.services);
  const businessInfo = parseBusinessInfo();
  const seoMetadata = parseSEOMetadata(existingData.metadata);
  const faqs = parseFAQContent(existingData.faq);
  const testimonials = parseTestimonials(existingData.testimonials);
  const aboutContent = parseAboutContent(existingData.about);
  const serverSideSEO = parseServerSideSEO(existingData.serverSideSEO);
  const insightsArticles = parseInsightsArticles(existingData.insights);

  const results = {
    services: [],
    businessInfo: null,
    seoMetadata: [],
    faq: [],
    testimonials: [],
    about: null,
    serverSideSEO: [],
    insights: [],
  };

  // Run migrations based on type
  if (type === 'all' || type === 'services') {
    results.services = await migrateServices(client, services, dryRun);
  }

  if (type === 'all' || type === 'business') {
    results.businessInfo = await migrateBusinessInfo(client, businessInfo, dryRun);
  }

  if (type === 'all' || type === 'seo') {
    results.seoMetadata = await migrateSEOMetadata(client, seoMetadata, dryRun);
  }

  if (type === 'all' || type === 'faq') {
    results.faq = await migrateFAQ(client, faqs, dryRun);
  }

  if (type === 'all' || type === 'testimonials') {
    results.testimonials = await migrateTestimonials(client, testimonials, dryRun);
  }

  if (type === 'all' || type === 'about') {
    results.about = await migrateAboutPage(client, aboutContent, dryRun);
  }

  if (type === 'all' || type === 'server-seo') {
    results.serverSideSEO = await migrateServerSideSEO(client, serverSideSEO, dryRun);
  }

  if (type === 'all' || type === 'insights') {
    results.insights = await migrateInsightsArticles(client, insightsArticles, dryRun);
  }

  // Validate results
  const allResults = [
    ...results.services,
    ...(results.businessInfo ? [results.businessInfo] : []),
    ...results.seoMetadata,
    ...results.faq,
    ...results.testimonials,
    ...(results.about ? [results.about] : []),
    ...results.serverSideSEO,
    ...results.insights,
  ];

  const validation = validateMigratedContent(allResults);

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log(`   Total items: ${validation.total}`);
  console.log(`   Successful: ${validation.successful}`);
  console.log(`   Failed: ${validation.failed}`);
  console.log(`   Status: ${validation.isValid ? '✅ SUCCESS' : '❌ PARTIAL FAILURE'}`);

  // Detailed breakdown
  if (results.services.length > 0) {
    console.log(
      `\n   Services: ${results.services.filter(r => r.success).length}/${results.services.length}`
    );
  }
  if (results.businessInfo) {
    console.log(`   Business Info: ${results.businessInfo.success ? '✅' : '❌'}`);
  }
  if (results.seoMetadata.length > 0) {
    console.log(
      `   SEO Metadata: ${results.seoMetadata.filter(r => r.success).length}/${results.seoMetadata.length}`
    );
  }
  if (results.faq.length > 0) {
    console.log(
      `   FAQ: ${results.faq.filter(r => r.success).length}/${results.faq.length} (${results.faq[0]?.count || 0} questions)`
    );
  }
  if (results.testimonials.length > 0) {
    console.log(
      `   Testimonials: ${results.testimonials.filter(r => r.success).length}/${results.testimonials.length} (${results.testimonials[0]?.count || 0} testimonials)`
    );
  }
  if (results.about) {
    console.log(`   About Page: ${results.about.success ? '✅' : '❌'}`);
  }
  if (results.serverSideSEO.length > 0) {
    console.log(
      `   Server-Side SEO: ${results.serverSideSEO.filter(r => r.success).length}/${results.serverSideSEO.length} pages`
    );
  }
  if (results.insights.length > 0) {
    console.log(
      `   Insights Articles: ${results.insights.filter(r => r.success).length}/${results.insights.length}`
    );
  }

  if (!dryRun && validation.isValid) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('   Next steps:');
    console.log('   1. Upload media assets using the asset migration script');
    console.log('   2. Update asset references in the migrated documents');
    console.log('   3. Test content rendering in your Next.js application');
  }

  return {
    success: validation.isValid,
    results,
    validation,
  };
}

// CLI interface
function showHelp() {
  console.log(`
Sanity Content Migration Script

Usage:
  node scripts/migrate-to-sanity.js [options]

Options:
  --dry-run         Show what would be migrated without making changes
  --type=TYPE       Migrate specific content type:
                    - services: Service content (6 services)
                    - business: Business information
                    - seo: SEO metadata (13 pages)
                    - faq: FAQ questions and answers (17 items)
                    - testimonials: Customer testimonials (13 items)
                    - about: About page content (values, team, story)
                    - server-seo: Server-side SEO (H1/H2/Links)
                    - insights: Blog/Insights articles
                    - all: Migrate everything (default)
  --help           Show this help message

Examples:
  node scripts/migrate-to-sanity.js --dry-run
  node scripts/migrate-to-sanity.js --type=services
  node scripts/migrate-to-sanity.js --type=all

Environment Variables Required:
  NEXT_PUBLIC_SANITY_PROJECT_ID    Your Sanity project ID
  SANITY_API_TOKEN                 Sanity API token with write permissions
  NEXT_PUBLIC_SANITY_DATASET       Dataset name (default: production)
`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    type: 'all',
    help: false,
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1];
    } else if (arg === '--help') {
      options.help = true;
    }
  }

  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Validate type option
  const validTypes = [
    'services',
    'business',
    'seo',
    'faq',
    'testimonials',
    'about',
    'server-seo',
    'insights',
    'all',
  ];
  if (!validTypes.includes(options.type)) {
    console.error(`❌ Invalid type: ${options.type}`);
    console.error(`   Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  runMigration(options)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runMigration,
  parseServicesData,
  parseBusinessInfo,
  parseSEOMetadata,
  parseFAQContent,
  parseTestimonials,
  parseAboutContent,
  parseServerSideSEO,
  parseInsightsArticles,
  transformServiceToSanity,
  transformBusinessInfoToSanity,
  validateMigratedContent,
};
