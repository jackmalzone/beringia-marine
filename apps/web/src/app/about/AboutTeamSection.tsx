'use client';

/**
 * Client component for founder bios with expand/collapse
 * All bio content stays in DOM for SEO - we toggle visibility with height animation
 */

import { motion } from '@/lib/motion';
import { useUserPreferences } from '@/lib/store/AppStore';
import styles from './page.module.css';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  shortBio: string;
}

export default function AboutTeamSection({ team }: { team: readonly TeamMember[] }) {
  const { expandedFounders, setExpandedFounders } = useUserPreferences();
  const safeExpandedFounders = Array.isArray(expandedFounders) ? expandedFounders : [];

  const handleToggle = (index: number) => {
    if (safeExpandedFounders.includes(index)) {
      setExpandedFounders(safeExpandedFounders.filter((i) => i !== index));
    } else {
      setExpandedFounders([...safeExpandedFounders, index]);
    }
  };

  return (
    <motion.div
      className={styles.team}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={styles.team__container}>
        <motion.h2
          className={styles.team__title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Meet Our Founders
        </motion.h2>
        <div className={styles.team__grid}>
          {team.map((member, index) => {
            const isExpanded = safeExpandedFounders.includes(index);
            const bioParagraphs = member.bio.split('\n\n');
            const extendedParagraphs = bioParagraphs.slice(1);

            return (
              <motion.div
                key={member.name}
                className={styles.team__member}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.team__info}>
                  <h3 className={styles.team__name}>{member.name}</h3>
                  <p className={styles.team__role}>{member.role}</p>
                  <div className={styles.team__bio}>
                    <p className={styles.team__paragraph}>{member.shortBio}</p>
                    {extendedParagraphs.length > 0 && (
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0,
                          overflow: 'hidden',
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {extendedParagraphs.map((paragraph, idx) => (
                          <p key={idx} className={styles.team__paragraph}>
                            {paragraph}
                          </p>
                        ))}
                      </motion.div>
                    )}
                    <button
                      className={isExpanded ? styles.team__readLess : styles.team__readMore}
                      onClick={() => handleToggle(index)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Read Less' : '... Read More'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
