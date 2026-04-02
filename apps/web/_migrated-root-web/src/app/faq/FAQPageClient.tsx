'use client';

import React from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import PageSchema from '@/components/seo/PageSchema';
import { useUserPreferences } from '@/lib/store/AppStore';
import { VITAL_ICE_BUSINESS } from '@/lib/config/business-info';
import styles from './page.module.css';

const FAQPageClient: React.FC = () => {
  const { openFAQItem, setOpenFAQItem } = useUserPreferences();

  const faqs = [
    {
      question: 'How do I book a session?',
      answer:
        'You can book sessions directly on our <a href="/book" style="color: #00b7b5; text-decoration: underline;">website</a>, through the Mindbody Online portal / Mindbody app, downloading our <a href="https://apps.apple.com/us/app/vital-ice/id6748015943" target="_blank" rel="noopener noreferrer" style="color: #00b7b5; text-decoration: underline;">App</a>, or by visiting our location. We recommend booking in advance, although it\'s not required, especially for off peak hours.',
    },
    {
      question: 'What services does Vital Ice offer?',
      answer:
        'Vital Ice offers a comprehensive recovery <a href="/experience" style="color: #00b7b5; text-decoration: underline;">experience</a> including cold plunge therapy, traditional sauna, infrared sauna, red light therapy, compression boots, and percussion massage. We recommend contrast therapy - alternating between cold and heat exposure for optimal recovery benefits. <a href="/services/cold-plunge" style="color: #00b7b5; text-decoration: underline; margin-left: 8px;">Cold Plunge</a> • <a href="/services/traditional-sauna" style="color: #00b7b5; text-decoration: underline;">Traditional Sauna</a> • <a href="/services/infrared-sauna" style="color: #00b7b5; text-decoration: underline;">Infrared Sauna</a> • <a href="/services/red-light-therapy" style="color: #00b7b5; text-decoration: underline;">Red Light Therapy</a> • <a href="/services/compression-boots" style="color: #00b7b5; text-decoration: underline;">Compression Boots</a> • <a href="/services/percussion-massage" style="color: #00b7b5; text-decoration: underline;">Percussion Massage</a>',
    },
    {
      question: 'What should I bring for my first visit?',
      answer:
        "Bring clean workout clothes or swimwear, a towel, and a water bottle. We provide towels, but you're welcome to bring your own. Lockers are available for your belongings. Shower facilities are provided. Outdoor clothing or footwear is not permitted in the facility areas.",
    },
    {
      question: 'Are there any health restrictions?',
      answer:
        'While our services are generally safe, we recommend consulting with your healthcare provider if you have cardiovascular conditions, are pregnant, or have other health concerns. Our staff can help guide you to appropriate services. Please review our customer policies for further detail.',
    },
    {
      question: 'How long should I stay in the cold plunge?',
      answer:
        'Start with 1-3 minutes and gradually increase your tolerance. We urge our customers to challenge their limits, but always listen to your body and never force yourself to stay longer than comfortable. Our staff can provide guidance based on your experience level. <a href="/services/cold-plunge" style="color: #00b7b5; text-decoration: underline; margin-left: 8px;">Learn More.</a>',
    },
    {
      question: "What's the difference between traditional and infrared sauna?",
      answer:
        '<a href="/services/traditional-sauna" style="color: #00b7b5; text-decoration: underline;">Traditional saunas</a> use heated air to warm your body, while <a href="/services/infrared-sauna" style="color: #00b7b5; text-decoration: underline;">infrared saunas</a> use light waves to directly heat your body tissues. Infrared saunas typically operate at lower temperatures but can provide deeper tissue penetration.',
    },
    {
      question: 'Do you offer memberships?',
      answer:
        'Yes! In addition to visit packs, we offer month to month membership options including unlimited community and private room memberships. Memberships include special perks, exclusive events, and additional amenities. You can view and purchase memberships by following through with any of the booking options and selecting your desired contract. Vital Ice membership offers are not limited to what is available online, ask us about our memberships on site.',
    },
    {
      question: 'Can I bring a guest?',
      answer:
        'Guest policies vary by membership type. Private room memberships include limited complimentary guest passes, additional guest passes can be purchased for private room visits. All guests must complete our waiver form. The community space is accessed individually.',
    },
    {
      question: "What's your cancellation policy?",
      answer:
        'We require 24-hour notice for cancellations. Late cancellations or no-shows may incur fees: $20 for contrast therapy sessions and $10 for recovery amenities. You can cancel or reschedule appointments through your Mindbody account, or by contacting us. See our full cancellation policy for details.',
    },
    {
      question: 'Do you offer gift cards?',
      answer:
        'Yes! Gift cards are available for any amount and make perfect gifts for wellness enthusiasts. You can purchase them through our Mindbody portal or in person. They expire 12 months after purchase and can applied to any of our services or memberships.',
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
        'Our operating hours vary by day: Monday-Friday we\'re open <span style="color: #00b7b5; font-weight: 500;">6AM-10AM, 12PM-2PM, and 4PM-9PM</span>. Saturdays we\'re open <span style="color: #00b7b5; font-weight: 500;">7AM-9PM</span>, and Sundays we\'re open <span style="color: #00b7b5; font-weight: 500;">8AM-7PM</span>. Our busiest hours are weekends and weekday mornings & evenings, walk ins are always accepted but bookings take priority.',
    },
    {
      question: 'Do you provide towels and amenities?',
      answer:
        'Yes, we provide towels, hygiene products & toiletries, and locker storage. We also offer refreshments, merchandise and health and wellness products for purchase at our store.',
    },
    {
      question: "Can I use the facilities if I'm not feeling well?",
      answer:
        "While our services may aid in recovery, we ask that you stay home if you're experiencing any illness symptoms. This helps protect our community and staff. You can reschedule your session without penalty if you're feeling unwell.",
    },
    {
      question: 'Do you offer corporate memberships?',
      answer:
        "Yes! We offer corporate wellness programs and group memberships. These can include team building events, wellness workshops, and discounted rates for companies. Contact us to discuss your organization's needs.",
    },
    {
      question: 'Do you offer discounts for teams and clubs?',
      answer:
        'Yes! We offer discounts for groups visiting with association to a team/club/group in excess of 6 members. Contact us to learn more before your visit.',
    },
  ];

  const toggleItem = (index: number) => {
    setOpenFAQItem(openFAQItem === index ? null : index);
  };

  return (
    <>
      <PageSchema pageKey="faq" />
      <div className={styles.faqPage}>
        <div className={styles.container}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.title}>Frequently Asked Questions</h1>
            <p className={styles.subtitle}>
              Find answers to common questions about our services, policies, and facilities
            </p>
          </motion.div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={styles.faqItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <button
                  className={`${styles.faqQuestion} ${openFAQItem === index ? styles.active : ''}`}
                  onClick={() => toggleItem(index)}
                  aria-expanded={openFAQItem === index}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <motion.span
                    className={styles.arrow}
                    animate={{ rotate: openFAQItem === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openFAQItem === index && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: faq.answer,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.contact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3>Still have questions?</h3>
            <p>Can&apos;t find what you&apos;re looking for? We&apos;re here to help!</p>
            <div className={styles.contactInfo}>
              <a href={`mailto:${VITAL_ICE_BUSINESS.email}`} className={styles.contactLink}>
                {VITAL_ICE_BUSINESS.email}
              </a>

              <p className={styles.address}>
                {VITAL_ICE_BUSINESS.address.street}
                <br />
                {VITAL_ICE_BUSINESS.address.city}, {VITAL_ICE_BUSINESS.address.state}{' '}
                {VITAL_ICE_BUSINESS.address.zipCode}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQPageClient;
