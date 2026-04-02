'use client';

import styles from './ArticleHero.module.css';

interface ArticleHeroPdfButtonProps {
  pdfUrl: string;
  title: string;
}

export default function ArticleHeroPdfButton({ pdfUrl, title }: ArticleHeroPdfButtonProps) {
  const handlePdfDownload = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handlePdfDownload}
      className={styles.hero__pdfButton}
      aria-label={`Download ${title} as PDF`}
    >
      <svg
        className={styles.hero__pdfIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10 12.5L6.25 8.75L7.5 7.5L9.375 9.375V2.5H10.625V9.375L12.5 7.5L13.75 8.75L10 12.5Z"
          fill="currentColor"
        />
        <path
          d="M3.75 17.5C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V13.75H3.75V16.25H16.25V13.75H17.5V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H3.75Z"
          fill="currentColor"
        />
      </svg>
      Download PDF
    </button>
  );
}
