import { FaCubes, FaGlobe, FaLinkedin, FaYoutube } from 'react-icons/fa';
import styles from './MediaLinksSection.module.css';

export interface MediaLinks {
  website?: string;
  youtube?: string;
  linkedin?: string;
  sketchfab?: string;
  email?: string;
}

const items: Array<{
  key: keyof MediaLinks;
  label: string;
  icon: typeof FaGlobe;
}> = [
  { key: 'website', label: 'Website', icon: FaGlobe },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'sketchfab', label: 'Sketchfab', icon: FaCubes },
];

export function MediaLinksSection({ links }: { links: MediaLinks & { email?: string } }) {
  const email = links.email;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Connect with us</h2>
        <div className={styles.grid}>
          {items.map(({ key, label, icon: Icon }) => {
            const url = links[key] as string | undefined;
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Icon className={styles.icon} aria-hidden />
                {label}
              </a>
            );
          })}
          {email ? (
            <a href={`mailto:${email}`} className={styles.link}>
              Email
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
