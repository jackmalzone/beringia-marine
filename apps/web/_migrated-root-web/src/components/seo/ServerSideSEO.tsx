/**
 * ServerSideSEO - Critical SEO elements that must be in server-side rendered HTML
 * This ensures search engines and crawlers can see them in the raw HTML
 * Uses screen-reader-only positioning to be visible to crawlers but not to users
 */

interface ServerSideSEOProps {
  pageKey:
    | 'home'
    | 'services'
    | 'book'
    | 'register'
    | 'experience'
    | 'about'
    | 'contact'
    | 'faq'
    | 'cold-plunge'
    | 'infrared-sauna'
    | 'traditional-sauna'
    | 'red-light-therapy'
    | 'compression-boots'
    | 'percussion-massage';
}

const SEO_CONTENT = {
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
      "Vital Ice is San Francisco's premier wellness center offering cold plunge therapy, red light therapy, sauna sessions, and recovery services. Located in the Marina District, we provide transformative wellness experiences through ancient healing practices and modern recovery techniques. Our services include cold plunge therapy for inflammation reduction, infrared sauna for detoxification, traditional sauna for relaxation, red light therapy for cellular health, compression therapy for muscle recovery, and percussion massage for deep tissue relief.",
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
      "Vital Ice offers comprehensive wellness services in San Francisco's Marina District. Our services include cold plunge therapy for inflammation reduction and mental clarity, infrared sauna for detoxification and relaxation, traditional sauna for deep heat therapy, red light therapy for cellular health and skin benefits, compression boots for muscle recovery and circulation, and percussion massage for deep tissue relief. Each service is designed to optimize recovery and enhance overall wellness. Book your session today to experience the transformative benefits of our premium recovery services.",
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
      "Book your recovery and wellness session at Vital Ice in San Francisco's Marina District. Schedule cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, or percussion massage sessions online. Our booking system makes it easy to reserve your preferred time slot for any of our premium recovery services. Whether you're looking for cold therapy for inflammation reduction, heat therapy for detoxification, or recovery services for muscle repair, we have flexible scheduling options to fit your needs. Experience the transformative benefits of our comprehensive wellness services.",
  },
  register: {
    h1: 'New Member Registration - Vital Ice San Francisco',
    h2: [
      'Create Your Vital Ice Account',
      'Register with Mindbody to Book Sessions',
      'Complete Your Registration & Review Policies',
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
      { href: '/book', text: 'Book Your Session' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
      { href: '/client-policy', text: 'Client Policy & Waiver' },
    ],
    content:
      "Register for your Vital Ice account to access recovery and wellness services in San Francisco's Marina District. Complete your new member registration through Mindbody to create your account, book sessions, and manage your membership. During registration, you'll review and accept our liability waiver and release of claims, terms of service, and privacy policy. Once registered, you'll be able to schedule cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, and percussion massage sessions online. Join our recovery community and start your wellness journey with Vital Ice today.",
  },
  'cold-plunge': {
    h1: 'Cold Plunge Therapy - San Francisco Recovery & Wellness',
    h2: [
      'Cold Water Immersion Therapy Benefits',
      'How Cold Plunge Therapy Works',
      'Recovery & Mental Resilience Through Cold Exposure',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Cold Plunge Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience cold plunge therapy at Vital Ice in San Francisco's Marina District. Our 40-50°F cold water immersion therapy helps reduce inflammation, improve mental clarity, and accelerate muscle recovery. Cold plunge therapy is an ancient practice used for centuries in Nordic cultures and Japanese onsen traditions. The controlled cold exposure activates the nervous system, constricts blood vessels, and triggers powerful physiological responses that support recovery, resilience, and overall wellness. Book your cold plunge session today to experience the transformative benefits of cold water immersion therapy.",
  },
  'infrared-sauna': {
    h1: 'Infrared Sauna Therapy - San Francisco Detox & Recovery',
    h2: [
      'Infrared Sauna Benefits & Detoxification',
      'Deep Tissue Heating Therapy',
      'Pain Relief & Stress Reduction Through Heat Therapy',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Infrared Sauna Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience infrared sauna therapy at Vital Ice in San Francisco's Marina District. Our 120-150°F deep tissue heating therapy provides detoxification, pain relief, and stress reduction. Infrared sauna uses far-infrared wavelengths to penetrate deep into tissues, promoting circulation, reducing inflammation, and supporting recovery. Unlike traditional saunas, infrared saunas heat your body directly rather than the air around you, making them more comfortable while delivering powerful therapeutic benefits. Book your infrared sauna session today to experience the transformative benefits of deep tissue heat therapy.",
  },
  'traditional-sauna': {
    h1: 'Traditional Sauna Therapy - San Francisco Heat Therapy',
    h2: [
      'Traditional Sauna Benefits & Cardiovascular Health',
      'High-Temperature Heat Therapy',
      'Muscle Recovery & Immune Support Through Sauna',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Traditional Sauna Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience traditional sauna therapy at Vital Ice in San Francisco's Marina District. Our 160-200°F heat therapy supports cardiovascular health, muscle recovery, and immune function. Traditional saunas use dry heat to raise your core body temperature, promoting sweating, circulation, and detoxification. The high-temperature environment stimulates the cardiovascular system, improves circulation, and supports recovery after intense training. Book your traditional sauna session today to experience the time-tested benefits of high-temperature heat therapy.",
  },
  'red-light-therapy': {
    h1: 'Red Light Therapy - San Francisco Cellular Health & Recovery',
    h2: [
      'Red Light Therapy Benefits & Cellular Regeneration',
      'Low-Level Light Therapy for Skin Health',
      'Anti-Aging & Recovery Through Red Light Therapy',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Red Light Therapy Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience red light therapy at Vital Ice in San Francisco's Marina District. Our low-level red and near-infrared light therapy supports cellular regeneration, skin health, and anti-aging benefits. Red light therapy uses specific wavelengths of light to penetrate deep into tissues, stimulating mitochondria to produce more ATP energy. This cellular energy boost supports healing, reduces inflammation, improves skin appearance, and accelerates recovery. Book your red light therapy session today to experience the transformative benefits of photobiomodulation therapy.",
  },
  'compression-boots': {
    h1: 'Compression Boot Therapy - San Francisco Muscle Recovery',
    h2: [
      'Compression Boot Benefits & Circulation',
      'Sequential Compression Therapy for Recovery',
      'Lymphatic Drainage & Muscle Recovery',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Compression Boot Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience compression boot therapy at Vital Ice in San Francisco's Marina District. Our sequential compression therapy improves circulation, accelerates muscle recovery, and supports lymphatic drainage. Compression boots use rhythmic pressure to massage your legs, promoting blood flow, reducing swelling, and flushing metabolic waste from muscles. This advanced recovery technology is used by professional athletes and fitness enthusiasts to speed up recovery between training sessions. Book your compression boot session today to experience the transformative benefits of sequential compression therapy.",
  },
  'percussion-massage': {
    h1: 'Percussion Massage Therapy - San Francisco Deep Tissue Recovery',
    h2: [
      'Percussion Massage Benefits & Pain Relief',
      'Deep Tissue Percussion Therapy',
      'Muscle Recovery & Improved Mobility',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Percussion Massage Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience percussion massage therapy at Vital Ice in San Francisco's Marina District. Our deep tissue percussion therapy supports muscle recovery, pain relief, and improved mobility. Percussion massage uses rapid, targeted pulses to penetrate deep into muscle tissue, breaking up adhesions, reducing tension, and promoting blood flow. This advanced massage technology delivers consistent, powerful pressure that manual massage cannot match, making it ideal for athletes and anyone dealing with muscle soreness or tightness. Book your percussion massage session today to experience the transformative benefits of deep tissue percussion therapy.",
  },
  experience: {
    h1: 'Experience Vital Ice - San Francisco Wellness Center',
    h2: [
      'Explore Our Premium Wellness Facility',
      'Recovery & Wellness Services Available',
      'Book Your Wellness Experience Today',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'All Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Experience Vital Ice, San Francisco's premier wellness center located in the Marina District. Explore our state-of-the-art facility featuring cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, and percussion massage. Our wellness center is designed to provide transformative recovery and wellness experiences through ancient healing practices and modern recovery techniques. Whether you're looking to reduce inflammation, accelerate muscle recovery, improve mental clarity, or enhance overall wellness, Vital Ice offers comprehensive recovery solutions in a premium, welcoming environment. Visit us to experience the future of wellness and recovery.",
  },
  about: {
    h1: 'About Vital Ice - San Francisco Wellness Center',
    h2: [
      'Our Mission & Story',
      'Ancient Healing Practices for Modern Wellness',
      'Committed to Your Recovery & Wellbeing',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Vital Ice is San Francisco's premier wellness center, founded on the principle of bringing ancient healing practices to modern recovery and wellness. Located in the Marina District, we are committed to providing transformative wellness experiences through cold therapy, heat therapy, light therapy, and advanced recovery techniques. Our mission is to help you live better through evidence-based recovery methods that have been used for centuries in cultures around the world. We combine the wisdom of traditional healing practices with cutting-edge recovery technology to create a comprehensive wellness experience. Learn more about our story, our founders, and our commitment to your health and wellbeing.",
  },
  contact: {
    h1: 'Contact Vital Ice - San Francisco Wellness Center',
    h2: [
      'Visit Our Marina District Location',
      'Get in Touch With Our Team',
      'Book Your Wellness Session',
    ],
    links: [
      { href: '/', text: 'Home' },
      { href: '/services', text: 'Our Services' },
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/about', text: 'About Vital Ice' },
      { href: '/faq', text: 'FAQ' },
    ],
    content:
      "Contact Vital Ice, San Francisco's premier wellness center located in the Marina District. Visit us at 2400 Chestnut Street for cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, and percussion massage sessions. Our team is here to help you schedule your recovery and wellness appointments, answer questions about our services, and guide you through your wellness journey. Whether you're looking to reduce inflammation, accelerate muscle recovery, improve mental clarity, or enhance overall wellness, we're here to help. Reach out to us today to learn more about our services or to book your first session.",
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
      { href: '/services/cold-plunge', text: 'Cold Plunge Therapy' },
      { href: '/services/infrared-sauna', text: 'Infrared Sauna' },
      { href: '/services/traditional-sauna', text: 'Traditional Sauna' },
      { href: '/services/red-light-therapy', text: 'Red Light Therapy' },
      { href: '/services/compression-boots', text: 'Compression Boots' },
      { href: '/services/percussion-massage', text: 'Percussion Massage' },
      { href: '/experience', text: 'Experience Our Facility' },
      { href: '/book', text: 'Book Your Session' },
      { href: '/contact', text: 'Contact Us' },
      { href: '/about', text: 'About Vital Ice' },
    ],
    content:
      "Find answers to frequently asked questions about Vital Ice, San Francisco's premier wellness center. Learn about our cold plunge therapy, infrared sauna, traditional sauna, red light therapy, compression boots, and percussion massage services. Get information about booking appointments, session durations, what to expect during your visit, and how our recovery and wellness services can benefit you. Our FAQ section covers common questions about cold therapy benefits, sauna safety, red light therapy effectiveness, compression therapy for athletes, and more. Whether you're new to recovery therapies or looking to optimize your wellness routine, find the answers you need to make informed decisions about your health and recovery.",
  },
};

export default function ServerSideSEO({ pageKey }: ServerSideSEOProps) {
  const content = SEO_CONTENT[pageKey];

  if (!content) {
    // Fallback for unknown page keys
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="false"
    >
      {/* Critical H1 for SEO - must be in server-side HTML */}
      <h1>{content.h1}</h1>

      {/* H2 headings for page structure */}
      {content.h2.map((heading: string, index: number) => (
        <h2 key={index}>{heading}</h2>
      ))}

      {/* Server-side navigation links for crawlers */}
      <nav aria-label="Main navigation">
        {content.links.map((link: { href: string; text: string }) => (
          <a key={link.href} href={link.href}>
            {link.text}
          </a>
        ))}
      </nav>

      {/* Additional descriptive content for word count and context */}
      <p>{content.content}</p>
    </div>
  );
}
