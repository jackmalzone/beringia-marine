import { Metadata } from 'next';
import { mergeMetadata } from '@/lib/seo/metadata';
import { SHELL_LEGAL } from '@vital-ice/config';
import { BERINGIA_TERMS_FOOTER, BERINGIA_TERMS_SECTIONS } from '@/lib/content/beringia-static';
import styles from './page.module.css';

export const metadata: Metadata = mergeMetadata('terms');

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.oceanField}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{SHELL_LEGAL.termsPageTitle}</h1>
          </header>

          <div className={styles.content}>
            <div className={styles.sections}>
              {BERINGIA_TERMS_SECTIONS.map((section) => (
                <section key={section.title} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <p className={styles.sectionText}>{section.body}</p>
                </section>
              ))}
            </div>

            <footer className={styles.docFooter}>
              <p className={styles.docFooterLine}>{BERINGIA_TERMS_FOOTER.versionLabel}</p>
              <p className={styles.docFooterLine}>{BERINGIA_TERMS_FOOTER.dateLabel}</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
