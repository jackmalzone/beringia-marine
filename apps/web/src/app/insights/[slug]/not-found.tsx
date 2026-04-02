import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__content}>
        <h1 className={styles.notFound__title}>Article Not Found</h1>
        <p className={styles.notFound__message}>
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/insights" className={styles.notFound__link}>
          Back to Insights
        </Link>
      </div>
    </div>
  );
}
