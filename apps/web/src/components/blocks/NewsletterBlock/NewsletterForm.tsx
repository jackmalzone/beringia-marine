'use client';

import { motion } from '@/lib/motion';
import styles from './NewsletterBlock.module.css';

interface NewsletterFormProps {
  placeholder: string;
  buttonText: string;
}

/**
 * Client component for newsletter form (requires interactivity)
 */
export default function NewsletterForm({ placeholder, buttonText }: NewsletterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (email) {
      // TODO: Integrate with newsletter service
      console.log('Newsletter signup:', email);
      alert('Thank you for joining our waitlist!');
    }
  };

  return (
    <motion.form
      className={styles.newsletter__form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className={styles.newsletter__inputGroup}>
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          className={styles.newsletter__input}
          required
        />
        <motion.button
          type="submit"
          className={styles.newsletter__button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.form>
  );
}
