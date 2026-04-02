import { FaCheckCircle } from 'react-icons/fa';
import styles from './ValuePropositionSection.module.css';

export function ValuePropositionSection({
  title,
  description,
  highlights,
}: {
  title: string;
  description?: string;
  highlights: string[];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        <div className={styles.highlights}>
          {highlights.map((h, i) => (
            <div key={`${h}-${i}`} className={styles.row}>
              <FaCheckCircle className={styles.icon} aria-hidden />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
