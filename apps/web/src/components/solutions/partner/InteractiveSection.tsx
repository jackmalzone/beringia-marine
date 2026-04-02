import { sketchfabEmbedUrl } from '@/lib/media/sketchfab';
import styles from './InteractiveSection.module.css';

export function InteractiveSection({
  modelId,
  title,
  description,
}: {
  modelId: string;
  title: string;
  description: string;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore {title} in 3D</h2>
        <p className={styles.description}>{description}</p>
        <iframe
          title={`${title} 3D model`}
          className={styles.embed}
          src={sketchfabEmbedUrl(modelId.trim())}
          allow="fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    </section>
  );
}
