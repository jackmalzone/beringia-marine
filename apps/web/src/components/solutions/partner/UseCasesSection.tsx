import styles from './UseCasesSection.module.css';

export interface UseCaseItem {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
}

export function UseCasesSection({
  title,
  description,
  cases,
}: {
  title: string;
  description?: string;
  cases: UseCaseItem[];
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        <div className={styles.grid}>
          {cases.map((c) => (
            <article key={c.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.description}</p>
              <ul className={styles.points}>
                {c.keyPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
