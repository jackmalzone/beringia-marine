import styles from './DemoSection.module.css';

export function DemoSection({
  title,
  description,
  videoUrl,
}: {
  title: string;
  description?: string;
  videoUrl: string;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        <video className={styles.video} src={videoUrl} controls playsInline preload="metadata" />
      </div>
    </section>
  );
}
