'use client';

import React from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useUserPreferences } from '@/lib/store/AppStore';
import { VITAL_ICE_BUSINESS } from '@/lib/config/business-info';
import styles from './page.module.css';

const CareersPageClient: React.FC = () => {
  const { expandedJobs, setExpandedJobs } = useUserPreferences();

  const handleToggleJobExpansion = (jobTitle: string) => {
    const currentJobs = expandedJobs;
    if (currentJobs.includes(jobTitle)) {
      setExpandedJobs(currentJobs.filter(job => job !== jobTitle));
    } else {
      setExpandedJobs([...currentJobs, jobTitle]);
    }
  };

  const jobOpenings = [
    {
      title: 'Vital Ice Wellness & Operations Coordinator',
      type: 'Full-time or Part-time',
      location: 'San Francisco, CA',
      description:
        'A pivotal, hands-on role responsible for ensuring the smooth daily operation of our facility, delivering outstanding client service, driving sales, and actively contributing to our partnership growth strategy.',
      requirements: [
        'Minimum 2-3 years of experience in a customer-facing role, preferably in hospitality, retail, wellness, or a service-oriented environment',
        'Demonstrated experience in sales or business development is highly desirable',
        'Experience with administrative tasks and scheduling software',
        'Exceptional interpersonal and communication skills (verbal and written)',
        'Strong organizational abilities and attention to detail',
        'Proficiency with Google Workspace (Docs, Sheets, Calendar) and familiarity with POS/scheduling software',
        'Proactive problem-solver with a positive, can-do attitude',
        'Ability to work independently and manage multiple priorities effectively',
        'Comfortable with light cleaning duties and maintaining high hygiene standards',
        'Genuine passion for health, wellness, and recovery',
        'Professional demeanor and appearance',
        'Reliable, punctual, and highly dependable',
        'Ability to adapt quickly in a fast-paced, evolving environment',
        'A keen eye for opportunities to improve client experience and business growth',
      ],
      responsibilities: [
        'On-Site Reception & Client Experience (40%): Warmly greet and welcome all clients, partners, and visitors to the Vital Ice facility. Manage client check-ins, bookings, and inquiries (in-person, phone, email) using our scheduling system. Provide comprehensive information about Vital Ice services, pricing, benefits, and safety protocols. Assist clients with waivers, onboarding, and preparing for their cold therapy sessions. Ensure a comfortable, safe, and positive atmosphere for all individuals before, during, and after sessions. Address client feedback, concerns, and special requests promptly and professionally.',
        'Administrative & Operational Support (25%): Maintain accurate client records, sales data, and administrative files. Process payments, manage point-of-sale (POS) transactions, and reconcile daily revenue. Assist with inventory management of retail products and operational supplies. Manage incoming and outgoing correspondence and communications. Support management with various administrative tasks as needed, including report generation and data entry. Oversee facility schedule optimization to maximize capacity and client flow.',
        'Sales & Partnership Strategy & Execution (20%): Actively engage clients to understand their needs and recommend appropriate Vital Ice services, packages, and retail products. Identify and cultivate potential partnership opportunities with local wellness businesses (e.g., massage therapists, physical therapists, nutritionists, gyms) for reciprocal referrals, rebates, discounts, and freebies. Assist in outreach efforts, scheduling introductory meetings, and preparing presentation materials for potential partners. Track and report on sales performance and partnership pipeline development. Collaborate with management to refine sales techniques and partnership strategies.',
        'General Light Cleaning & Facility Maintenance (15%): Ensure the facility, including reception area, changing rooms, restrooms, and common areas, is consistently clean, tidy, and well-maintained. Perform routine cleaning tasks such as wiping surfaces, vacuuming/mopping, emptying trash, and restocking supplies. Monitor cleanliness of the cold plunge areas and ensure they meet hygiene standards (specific technical cleaning of plunge units will be handled by specialized staff, but general area cleanliness is key). Report any maintenance issues or equipment malfunctions promptly to management.',
      ],
      benefits: [
        'Competitive hourly wage or salary',
        'Opportunities for performance-based bonuses related to sales and partnerships',
        'Complimentary Vital Ice sessions and employee discounts on services/retail',
        'A dynamic, supportive, and health-focused work environment',
        'Significant opportunity for growth and professional development as Vital Ice expands',
        'The chance to be a key player in shaping the client experience and strategic direction of a pioneering wellness business',
      ],
    },
  ];

  return (
    <div className={styles.careersPage}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Join Our Team</h1>
          <p className={styles.subtitle}>Help us build the future of recovery and wellness</p>
        </motion.div>

        {/* Job Openings Section */}
        <motion.section
          className={styles.jobsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>Current Openings</h2>
          <div className={styles.jobsList}>
            {jobOpenings.map((job, index) => {
              const isExpanded = expandedJobs.includes(job.title);
              return (
                <motion.div
                  key={job.title}
                  className={styles.jobCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <div className={styles.jobHeader}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobType}>{job.type}</span>
                      <span className={styles.jobLocation}>{job.location}</span>
                    </div>
                  </div>

                  <p
                    className={styles.jobDescription}
                    style={{ lineHeight: '1.6', fontSize: '1.1rem' }}
                  >
                    {job.description}{' '}
                    <motion.button
                      className={styles.seeMoreButton}
                      onClick={() => handleToggleJobExpansion(job.title)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isExpanded ? 'See Less.' : 'See More.'}
                    </motion.button>
                  </p>

                  {/* Expandable Details Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className={styles.jobDetails}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className={styles.jobSection}>
                          <h4 className={styles.jobSectionTitle}>Requirements</h4>
                          <ul className={styles.jobList}>
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div className={styles.jobSection}>
                          <h4 className={styles.jobSectionTitle}>Responsibilities</h4>
                          <ul className={styles.jobList}>
                            {job.responsibilities.map((resp, respIndex) => (
                              <li key={respIndex}>
                                <strong>{resp.split(':')[0]}:</strong>
                                {resp.includes(':') ? resp.split(':').slice(1).join(':') : resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {job.benefits && (
                          <div className={styles.jobSection}>
                            <h4 className={styles.jobSectionTitle}>What We Offer</h4>
                            <ul className={`${styles.jobList} ${styles.benefitsList}`}>
                              {job.benefits.map((benefit, benefitIndex) => (
                                <li key={benefitIndex}>✓ {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.contactInfo}>
                    <p className={styles.contactText}>
                      To apply for this position, please contact us at:
                    </p>
                    <a href={`mailto:${VITAL_ICE_BUSINESS.email}`} className={styles.contactEmail}>
                      {VITAL_ICE_BUSINESS.email}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.div
          className={styles.contact}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3>Interested in joining our team?</h3>
          <p>We&apos;re looking for passionate individuals who share our vision.</p>
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
  );
};

export default CareersPageClient;
