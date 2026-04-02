import styles from './loading.module.css';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.logoWrap}>
        <Image
          src="/assets/beringia/logo-white-transparent.png"
          alt="Beringia Marine"
          width={360}
          height={360}
          className={styles.logo}
          priority
        />
        <span className={styles.pulse} aria-hidden="true" />
        <span className={styles.pulse2} aria-hidden="true" />
      </div>

      <div className={styles.phrases}>
        <span className={styles.phrase}>Initializing marine systems...</span>
      </div>
    </div>
  );
}
