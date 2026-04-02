'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import { trackMetaPixelViewContent } from '@/lib/utils/metaPixel';
import {
  GiSnowflake1,
  GiFire,
  GiCampfire,
  GiLightningTrio,
  GiLeg,
  GiVibratingBall,
} from 'react-icons/gi';
import {
  FaUsers,
  FaUserFriends,
  FaFire,
  FaSnowflake,
  FaShower,
  FaBed,
  FaBox,
  FaDumbbell,
  FaSpa,
  FaStore,
} from 'react-icons/fa';
import { servicesData } from '@/lib/data/services';
import VILogo from '@/components/ui/Logo/VILogo';
import { SmartPanel } from '@/components/ui/SmartPanel/SmartPanel';
import styles from './page.module.css';

const SERVICE_COLORS = {
  'cold-plunge': '#00bcd4',
  'infrared-sauna': '#ff3e36',
  'traditional-sauna': '#d45700',
  'red-light-therapy': '#e63e80',
  'compression-boots': '#80cbc4',
  'percussion-massage': '#64b5f6',
};

const ServiceIcons = {
  'cold-plunge': GiSnowflake1,
  'infrared-sauna': GiFire,
  'traditional-sauna': GiCampfire,
  'red-light-therapy': GiLightningTrio,
  'compression-boots': GiLeg,
  'percussion-massage': GiVibratingBall,
} as const;

interface ServiceNodeProps {
  service: {
    id: string;
    title: string;
    subtitle: string;
  };
  angle: number;
  radius: number;
  index: number;
  onHover: (index: number) => void;
  onLeave: () => void;
  onSelect: (id: string) => void;
  isHovered: boolean;
}

const ServiceNode: React.FC<ServiceNodeProps> = ({
  service,
  angle,
  radius,
  index,
  onHover,
  onLeave,
  onSelect,
  isHovered,
}) => {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const accentColor = SERVICE_COLORS[service.id as keyof typeof SERVICE_COLORS] || '#00bcd4';

  return (
    <motion.div
      className={styles.serviceNode}
      data-service-index={index}
      style={
        {
          '--x': `${x}px`,
          '--y': `${y}px`,
          '--accent-color': accentColor,
          '--index': index,
        } as React.CSSProperties
      }
      initial={{
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: x,
        y: y,
      }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => onHover(index)}
      onHoverEnd={onLeave}
      onClick={() => onSelect(service.id)}
    >
      <div className={styles.serviceIcon}>
        <div
          className={styles.serviceIconInner}
          style={{
            borderColor: accentColor,
            boxShadow: isHovered ? `0 0 20px ${accentColor}40` : 'none',
          }}
        >
          {(() => {
            const IconComponent = ServiceIcons[service.id as keyof typeof ServiceIcons];
            return IconComponent ? <IconComponent size={24} /> : <GiSnowflake1 size={24} />;
          })()}
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.trailEffect}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExperiencePage: React.FC = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Track ViewContent event when experience page loads
  useEffect(() => {
    trackMetaPixelViewContent('Experience', 'experience');
  }, []);

  const services = [
    servicesData['cold-plunge'],
    servicesData['infrared-sauna'],
    servicesData['traditional-sauna'],
    servicesData['red-light-therapy'],
    servicesData['compression-boots'],
    servicesData['percussion-massage'],
  ];

  const serviceDescriptions = {
    'cold-plunge': 'Cold water immersion therapy for muscle recovery and inflammation reduction',
    'infrared-sauna': 'Infrared heat therapy for detoxification and stress relief',
    'traditional-sauna': 'Finnish sauna therapy for cardiovascular health and wellness',
    'red-light-therapy': 'Red light phototherapy for skin health and muscle recovery',
    'compression-boots': 'Compression therapy for improved circulation and recovery',
    'percussion-massage': 'Percussive massage therapy for deep tissue muscle relief',
  };

  const getLogoColor = () => {
    if (hoveredIndex === null) return '#ffffff';
    const serviceId = services[hoveredIndex]?.id;
    return SERVICE_COLORS[serviceId as keyof typeof SERVICE_COLORS] || '#ffffff';
  };

  const handleServiceSelect = (id: string) => {
    router.push(`/services/${id}`);
  };

  const handleHover = (hoverIndex: number) => {
    setHoveredIndex(hoverIndex);
  };

  const handleLeave = () => {
    setHoveredIndex(null);
  };

  const getPanelSideForIndex = (index: number | null) => {
    if (index === null) return 'right';
    const rightSideIndices = [0, 1, 5];
    const isRightSide = rightSideIndices.includes(index);
    return isRightSide ? 'right' : 'left';
  };

  const hoveredService = hoveredIndex !== null ? services[hoveredIndex] : null;
  const panelSide = getPanelSideForIndex(hoveredIndex);

  return (
    <div className={styles.experiencePage}>
      {/* Facility Overview Section */}
      <motion.div
        className={styles.facilityOverview}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.div
          className={styles.overviewHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className={styles.overviewTitle}>Your Recovery Journey</h1>
          <p className={styles.overviewSubtitle}>Discover spaces designed for transformation</p>
        </motion.div>

        <div className={styles.spacesContainer}>
          {/* Community Space */}
          <motion.div
            className={styles.spaceNode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.spaceIcon}>
              <FaUsers size={32} />
            </div>
            <h3 className={styles.spaceTitle}>Community Space</h3>
            <p className={styles.spaceCapacity}>Up to 20 guests</p>
            <p className={styles.spaceDescription}>
              Our main community space features a large 10-person infrared sauna and a large
              10-person traditional sauna, offering both modern and classic heat experiences. The
              area also includes a rinse shower and three barrel-style cold plunges, set at
              incremental temperatures. It&apos;s a comfortable, open environment built for shared
              recovery and connection.
            </p>
            <div className={styles.spaceFeatures}>
              <div className={styles.feature}>
                <FaFire className={styles.featureIcon} />
                <span>10-person infrared sauna</span>
              </div>
              <div className={styles.feature}>
                <FaFire className={styles.featureIcon} />
                <span>10-person traditional sauna</span>
              </div>
              <div className={styles.feature}>
                <FaSnowflake className={styles.featureIcon} />
                <span>Three barrel-style cold plunges</span>
              </div>
              <div className={styles.feature}>
                <FaShower className={styles.featureIcon} />
                <span>Rinse shower</span>
              </div>
            </div>
          </motion.div>

          {/* Private Spaces */}
          <motion.div
            className={styles.spaceNode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.spaceIcon}>
              <FaUserFriends size={32} />
            </div>
            <h3 className={styles.spaceTitle}>Private Spaces</h3>
            <p className={styles.spaceCapacity}>2 to 4 guests</p>
            <p className={styles.spaceDescription}>
              Two intimate private rooms provide a comfortable, self-contained environment for two
              to four guests. Each space is equipped with an infrared sauna, a lay-down cold plunge,
              a rinse shower, and convenient personal storage.
            </p>
            <div className={styles.spaceFeatures}>
              <div className={styles.feature}>
                <FaFire className={styles.featureIcon} />
                <span>Infrared sauna</span>
              </div>
              <div className={styles.feature}>
                <FaBed className={styles.featureIcon} />
                <span>Lay-down cold plunge</span>
              </div>
              <div className={styles.feature}>
                <FaShower className={styles.featureIcon} />
                <span>Rinse shower</span>
              </div>
              <div className={styles.feature}>
                <FaBox className={styles.featureIcon} />
                <span>Personal storage</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Facilities */}
        <motion.div
          className={styles.additionalFacilities}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.2 }}
        >
          <div className={styles.facilitySection}>
            <h4 className={styles.facilityTitle}>Stretch & Recovery Zone</h4>
            <p className={styles.facilitiesDescription}>
              Adjacent to the private rooms is the stretch and recovery zone that combines
              performance and relaxation featuring percussion massagers, compression boots, red
              light therapy masks, and mobility essentials like mats, bands, and rollers to help you
              loosen up and rejuvenate.
            </p>
          </div>

          <div className={styles.facilitySection}>
            <h4 className={styles.facilityTitle}>Complete Experience</h4>
            <p className={styles.facilitiesDescription}>
              To complete the experience, you will enjoy access to luxury men&apos;s and
              women&apos;s locker rooms, an all-gender ADA-accessible suite, plush towel service,
              filtered hydration, hygiene & personal care amenities, and refreshments.
            </p>
            <p className={styles.facilitiesDescription}>
              Our reception area offers a curated mix of wellness products, apparel, and supplements
              to help you support your recovery and wellbeing beyond your visit.
            </p>
          </div>
        </motion.div>

        {/* Enhancement Zones */}
        <motion.div
          className={styles.enhancementZones}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.2 }}
        >
          <div className={styles.zoneNode}>
            <FaDumbbell className={styles.zoneIcon} />
            <span className={styles.zoneLabel}>Recovery Zone</span>
          </div>
          <div className={styles.zoneNode}>
            <FaSpa className={styles.zoneIcon} />
            <span className={styles.zoneLabel}>Premium Facilities</span>
          </div>
          <div className={styles.zoneNode}>
            <FaStore className={styles.zoneIcon} />
            <span className={styles.zoneLabel}>Wellness Retail</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.pageTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <h2 className={styles.pageTitleHeading}>Choose Your Experience</h2>
        <p className={styles.pageTitleSubheading}>
          Select a service to begin your recovery journey
        </p>
      </motion.div>

      <div className={styles.mainGridNew}>
        <div className={styles.radialMenu}>
          <motion.div
            className={styles.backgroundRing}
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <motion.div
            className={styles.centralLogo}
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <VILogo
              width={140}
              height={80}
              color={getLogoColor()}
              strokeWidth={4}
              className={styles.logo}
            />
          </motion.div>

          {services.map((service, serviceIndex) => {
            if (!service) return null;

            const angle = serviceIndex * 60 * (Math.PI / 180);
            const radius = 160;

            return (
              <ServiceNode
                key={service.id}
                service={service}
                angle={angle}
                radius={radius}
                index={serviceIndex}
                onHover={handleHover}
                onLeave={handleLeave}
                onSelect={handleServiceSelect}
                isHovered={hoveredIndex === serviceIndex}
              />
            );
          })}
        </div>
      </div>

      {hoveredService && hoveredService.id && (
        <SmartPanel
          isVisible={hoveredIndex !== null}
          title=""
          accentColor={
            SERVICE_COLORS[hoveredService.id as keyof typeof SERVICE_COLORS] || '#00bcd4'
          }
          anchorSelector={`[data-service-index="${hoveredIndex}"]`}
          panelSide={panelSide}
        >
          <div>
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '1.4rem',
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: '400',
                color: SERVICE_COLORS[hoveredService.id as keyof typeof SERVICE_COLORS],
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'left',
                lineHeight: '1.2',
              }}
            >
              {hoveredService.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4',
                textAlign: 'left',
              }}
            >
              {serviceDescriptions[hoveredService.id as keyof typeof serviceDescriptions]}
            </p>
          </div>
        </SmartPanel>
      )}

      <div className={styles.footerSpacing} />

      <div className={styles.particles}>
        {[...Array(12)].map((_, particleIndex) => (
          <motion.div
            key={particleIndex}
            className={styles.particle}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + particleIndex * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particleIndex * 0.3,
            }}
            style={
              {
                '--delay': `${particleIndex * 0.3}s`,
                '--duration': `${4 + particleIndex * 0.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;
