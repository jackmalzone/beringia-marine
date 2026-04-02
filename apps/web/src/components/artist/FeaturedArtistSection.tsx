'use client';

import { useState } from 'react';
import type { DepthZone } from '@/lib/depth-zones';
import styles from './FeaturedArtistSection.module.css';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface FeaturedArtistSectionProps {
  className?: string;
  /** Homepage depth observer — which zone this section belongs to */
  depthZone?: DepthZone;
}

const artworks: Artwork[] = [
  {
    id: 'galapagos-seamounts-1',
    title: 'Galapagos Seamounts I',
    imageUrl: '/assets/beringia/galapagos-seascape.jpg',
    description:
      "Created during Rutstein's time as an Artist at Sea aboard the Nautilus exploration vessel, this piece incorporates live sonar data from the Galapagos seamounts. The underwater mountains, formed by volcanic activity, host unique ecosystems that Rutstein captured through her artistic interpretation of the scientific mapping data.",
  },
  {
    id: 'galapagos-seamounts-2',
    title: 'Galapagos Seamounts II',
    imageUrl: '/assets/beringia/galapagos-seascape2.jpg',
    description:
      "Working in the ship's wet lab, Rutstein collaborated with scientists using multi-beam sonar technology to map the ocean floor. This piece represents her direct engagement with the scientific process, as she transformed real-time data feeds into visual art while the ship conducted high-resolution mapping of the East Pacific region.",
  },
  {
    id: 'galapagos-1',
    title: 'Artist at Sea | Galapagos I',
    imageUrl: '/assets/beringia/seascape-wallpaper.jpg',
    description:
      "As a Science Communication Fellow, Rutstein connected with museum groups worldwide through telepresence technology, sharing the expedition's discoveries in real-time. This artwork reflects her dual role as both artist and science communicator, incorporating elements from her shipboard studio and the live interactions with global audiences.",
  },
];

export default function FeaturedArtistSection({ className = '', depthZone }: FeaturedArtistSectionProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  const handleBioClick = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  return (
    <section
      className={`${styles.artist} ${className}`}
      id="featured-artist"
      {...(depthZone ? { 'data-depth': depthZone } : {})}
    >
      <div className={styles.artist__container}>
        <div className={styles.artist__header}>
          <h2 className={styles.artist__title}>Featured Artist</h2>
          <h3 className={styles.artist__name}>Rebecca Rutstein</h3>
        </div>

        <div className={styles.artist__bio}>
          <div
            className={`${styles.artist__bioContent} ${isBioExpanded ? styles['artist__bioContent--expanded'] : ''}`}
            onClick={handleBioClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBioClick();
              }
            }}
            aria-label={isBioExpanded ? 'Collapse bio' : 'Expand bio'}
          >
            <div className={styles.artist__bioText}>
              <p>
                Rebecca Rutstein is a multidisciplinary artist whose practice bridges art and science. For over twenty
                years she has created painting, sculpture, interactive installation and public art inspired by the
                natural world. Her environmentally-focused work sheds light on places and processes hidden from view to
                foster deeper connection in the face of our climate crisis. As an artist-in-residence, Rutstein&apos;s
                collaborations with scientists have taken her around the world including eight expeditions at sea and
                three deep-sea dives to the ocean floor in the three-person Alvin submersible, supported by the
                National Science Foundation. Her work with oceanographers, ecologists, microbiologists, molecular
                scientists and planetary geologists give her a unique perspective and broad view of the
                interconnectedness of all things in nature.
              </p>

              <p>
                A recipient of the Pew Fellowship in the Arts with recognition from the National Endowment for the
                Arts, her work has been featured on NPR, ABC, NBC, CBS, Washington Post, Wall Street Journal,
                Huffington Post, Vice & Vogue magazines. Rutstein has exhibited internationally in over forty solo
                shows, and her work can be found in more than fifty public collections including the Philadelphia
                Museum of Art, Georgia Museum of Art, Museum of the Pennsylvania Academy of the Fine Arts, National
                Academy of Sciences, U.S. Department of State, U.S. Consulate in Thailand, and Yale University. She
                has had over 70 speaking engagements about her interdisciplinary practice including at the Barnes
                Foundation, National Academy of Sciences, Pennsylvania Academy of the Fine Arts, MIT Media Labs,
                Stanford, Georgetown and Cornell Universities, and the University of Georgia where she was awarded the
                Delta Visiting Chair for Global Understanding. Rutstein received a Master of Fine Arts from University
                of Pennsylvania and a Bachelor of Fine Arts (Magna Cum Laude) from Cornell University. She is
                represented by the Bridgette Mayer Gallery in Philadelphia.
              </p>
            </div>
            <a
              href="https://www.rebeccarutstein.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.artist__bioLink}
              onClick={(e) => e.stopPropagation()}
            >
              Visit Rebecca&apos;s Website →
            </a>
          </div>
        </div>

        <div className={styles.artist__gallery}>
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className={`${styles.artist__galleryItem} ${selectedArtwork?.id === artwork.id ? styles['artist__galleryItem--active'] : ''}`}
              onClick={() => handleArtworkClick(artwork)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleArtworkClick(artwork);
                }
              }}
              aria-label={`View ${artwork.title}`}
            >
              <img src={artwork.imageUrl} alt={artwork.title} className={styles.artist__galleryImage} />
              <div className={styles.artist__galleryOverlay}>
                <h4 className={styles.artist__galleryTitle}>{artwork.title}</h4>
                <p className={styles.artist__galleryDescription}>{artwork.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedArtwork && (
        <div
          className={styles.artist__modal}
          onClick={handleCloseModal}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Close fullscreen view"
        >
          <div className={styles.artist__modalContent}>
            <button className={styles.artist__modalClose} onClick={handleCloseModal} aria-label="Close">
              ×
            </button>
            <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title} className={styles.artist__modalImage} />
            <div className={styles.artist__modalInfo}>
              <h4 className={styles.artist__modalTitle}>{selectedArtwork.title}</h4>
              <p className={styles.artist__modalDescription}>{selectedArtwork.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
