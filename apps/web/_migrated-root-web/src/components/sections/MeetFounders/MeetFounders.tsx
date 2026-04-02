'use client';

import { FC } from 'react';
import { motion } from '@/lib/motion';
import Image from 'next/image';
import styles from './MeetFounders.module.css';

const MeetFounders: FC = () => {
  const founders = [
    {
      name: 'Sean',
      role: 'Co-Founder',
      image: 'https://media.vitalicesf.com/founder-sean.png',
      philosophy:
        "Recovery isn't just about physical healing—it's about creating moments of presence and clarity in our fast-paced world. I believe everyone deserves access to these ancient wellness practices reimagined for modern life.",
      linkedin: 'https://linkedin.com/in/sean-vitalice',
    },
    {
      name: 'Stephen',
      role: 'Co-Founder',
      image: 'https://media.vitalicesf.com/founder-stephen.jpg',
      philosophy:
        "Technology should enhance our connection to natural healing, not replace it. We're building the bridge between cutting-edge wellness science and time-tested recovery practices.",
      linkedin: 'https://linkedin.com/in/stephen-vitalice',
    },
    {
      name: 'Barry',
      role: 'Co-Founder',
      image: 'https://media.vitalicesf.com/founder-barry.jpg',
      philosophy:
        'Community is the foundation of sustainable wellness. When people come together with shared intention, the healing potential multiplies exponentially.',
      linkedin: 'https://linkedin.com/in/barry-vitalice',
    },
  ];

  return (
    <section id="founders" className={styles.founders}>
      <div className={styles.founders__container}>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className={styles.founders__content}
        >
          <motion.h2
            className={styles.founders__title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet the Founders
          </motion.h2>

          <motion.p
            className={styles.founders__subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Three friends united by a shared vision of accessible, community-driven recovery
          </motion.p>

          <motion.div
            className={styles.founders__grid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                className={styles.founder__card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.founder__image}>
                  <Image
                    src={founder.image}
                    alt={`${founder.name} - ${founder.role}`}
                    width={300}
                    height={400}
                    className={styles.founder__imageElement}
                  />
                </div>
                <div className={styles.founder__info}>
                  <h3 className={styles.founder__name}>{founder.name}</h3>
                  <p className={styles.founder__role}>{founder.role}</p>
                  <p className={styles.founder__philosophy}>{founder.philosophy}</p>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.founder__linkedin}
                  >
                    Connect on LinkedIn
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetFounders;
