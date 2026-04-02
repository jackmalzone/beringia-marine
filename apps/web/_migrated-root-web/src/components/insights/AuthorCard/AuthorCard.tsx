/**
 * AuthorCard Component
 *
 * Displays detailed author information including avatar, name, role, bio, and social links.
 * Supports both string author names and full Author objects.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Author, isAuthorObject } from '@/types/insights';
import styles from './AuthorCard.module.css';

interface AuthorCardProps {
  author: string | Author;
  className?: string;
}

export default function AuthorCard({ author, className }: AuthorCardProps) {
  const [avatarError, setAvatarError] = useState(false);

  // If author is just a string, render simple version
  if (!isAuthorObject(author)) {
    return (
      <div className={`${styles.authorCard} ${styles['authorCard--simple']} ${className || ''}`}>
        <div className={styles.authorCard__content}>
          <p className={styles.authorCard__name}>{author}</p>
        </div>
      </div>
    );
  }

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Render full author card with all details
  return (
    <div className={`${styles.authorCard} ${className || ''}`}>
      {author.avatar && (
        <div className={styles.authorCard__avatarContainer}>
          {!avatarError ? (
            <Image
              src={author.avatar}
              alt={`${author.name} avatar`}
              width={64}
              height={64}
              className={styles.authorCard__avatar}
              onError={handleAvatarError}
            />
          ) : (
            <div className={styles.authorCard__avatarPlaceholder} aria-label={author.name}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      <div className={styles.authorCard__content}>
        <div className={styles.authorCard__header}>
          <h3 className={styles.authorCard__name}>{author.name}</h3>
          {author.role && <p className={styles.authorCard__role}>{author.role}</p>}
        </div>

        {author.bio && <p className={styles.authorCard__bio}>{author.bio}</p>}

        {author.social && (
          <div className={styles.authorCard__social}>
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorCard__socialLink}
                aria-label={`${author.name} on Twitter`}
              >
                <svg
                  className={styles.authorCard__socialIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}

            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorCard__socialLink}
                aria-label={`${author.name} on LinkedIn`}
              >
                <svg
                  className={styles.authorCard__socialIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}

            {author.social.website && (
              <a
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorCard__socialLink}
                aria-label={`${author.name}'s website`}
              >
                <svg
                  className={styles.authorCard__socialIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
