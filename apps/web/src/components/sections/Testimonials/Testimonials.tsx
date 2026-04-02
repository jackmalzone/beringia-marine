'use client';

import { FC, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import Image from 'next/image';
import { useNavigation } from '@/lib/store/AppStore';
import { templateRaster } from '@/lib/config/template-assets';
import styles from './Testimonials.module.css';

const Testimonials: FC = () => {
  const { currentTestimonialIndex, setCurrentTestimonialIndex } = useNavigation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      quote:
        'The team anticipated questions I had not even asked yet. Every step felt calm and deliberate.',
      author: 'Morgan Ellis',
      role: 'Product Director',
      image: templateRaster(40),
      accent: '#00b7b5',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a3a3a 100%)',
    },
    {
      quote:
        'I appreciate how consistent the experience is. Same warmth at the desk, same polish in the room.',
      author: 'Priya Nandakumar',
      role: 'Operations Lead',
      image: templateRaster(41),
      accent: '#f56f0d',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #3a1a0a 100%)',
    },
    {
      quote:
        'Booking was straightforward, arrival was effortless, and the follow-up note was actually helpful.',
      author: 'Jordan Reyes',
      role: 'Consultant',
      image: templateRaster(41),
      accent: '#f56f0d',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #3a1a0a 100%)',
    },
    {
      quote:
        'This is the rare studio that feels premium without being precious—confident hospitality, zero attitude.',
      author: 'Casey Morales',
      role: 'Creative Producer',
      image: templateRaster(40),
      accent: '#00b7b5',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a3a3a 100%)',
    },
    {
      quote:
        'They explain what will happen, how long it takes, and what I might feel—no jargon, no rush.',
      author: 'Dr. Sam Okonkwo',
      role: 'Physician',
      image: templateRaster(42),
      accent: '#8b4513',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)',
    },
    {
      quote:
        'I travel constantly for work. Here, the routine is predictable enough to feel like a home base.',
      author: 'Taylor Brooks',
      role: 'Finance Partner',
      image: templateRaster(43),
      accent: '#2d1810',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #1a0a0a 100%)',
    },
    {
      quote:
        'Small details add up: lighting, sound, the way staff move through the space—it is clearly designed.',
      author: 'Riley Chen',
      role: 'Architect',
      image: templateRaster(40),
      accent: '#00b7b5',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a3a3a 100%)',
    },
    {
      quote:
        'I brought a colleague who was nervous about their first visit. The team made it effortless.',
      author: 'Alex Park',
      role: 'People Manager',
      image: templateRaster(44),
      accent: '#ff6b35',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)',
    },
    {
      quote:
        'Communication is crisp: reminders, directions, and policies all read like a brand that respects your time.',
      author: 'Jamie Alvarez',
      role: 'Attorney',
      image: templateRaster(40),
      accent: '#00b7b5',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a3a3a 100%)',
    },
    {
      quote:
        'Even on a busy evening, the floor felt composed. That is harder than it looks.',
      author: 'Renee Foster',
      role: 'Studio Owner (peer visit)',
      image: templateRaster(42),
      accent: '#8b4513',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)',
    },
    {
      quote:
        'I keep coming back because the experience matches what the website promises—no surprises.',
      author: 'Chris Ibarra',
      role: 'Entrepreneur',
      image: templateRaster(40),
      accent: '#00b7b5',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a3a3a 100%)',
    },
    {
      quote:
        'Professional, discreet, and genuinely kind. That combination is worth recommending.',
      author: 'Dr. Helen Zhou',
      role: 'Dentist',
      image: templateRaster(44),
      accent: '#ff6b35',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)',
    },
    {
      quote:
        'If you want a template for how a modern service business should feel, start by studying how they greet you.',
      author: 'Noah Patel',
      role: 'Hospitality Advisor',
      image: templateRaster(41),
      accent: '#f56f0d',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #3a1a0a 100%)',
    },
  ];

  useEffect(() => {
    const nextTestimonial = () => {
      setTimeout(() => {
        setCurrentTestimonialIndex((currentTestimonialIndex + 1) % testimonials.length);
      }, 400);
    };

    timeoutRef.current = setTimeout(nextTestimonial, 6000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentTestimonialIndex, testimonials.length, setCurrentTestimonialIndex]);

  const handleDotClick = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTimeout(() => {
      setCurrentTestimonialIndex(index);
    }, 400);
  };

  return (
    <section id="testimonials" className={styles.testimonials}>
      {/* Background Image */}
      <div className={styles.testimonials__background}>
        <Image
          src={templateRaster(45)}
          alt="Textured dark background for client testimonials"
          fill
          className={styles.testimonials__backgroundImage}
          loading="lazy"
          sizes="100vw"
        />
        <div className={styles.testimonials__backgroundOverlay} />
      </div>

      {/* Ambient Background */}
      <div className={styles.testimonials__ambient} />

      {/* Gradient Overlays */}
      <div className={styles.testimonials__gradientTop} />
      <div className={styles.testimonials__gradientBottom} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTestimonialIndex}
          className={styles.testimonial__section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Split Layout: Image and Content */}
          <div className={styles.testimonial__layout}>
            {/* Image Side */}
            <motion.div
              className={styles.testimonial__imageSide}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.testimonial__imageContainer}>
                <Image
                  src={testimonials[currentTestimonialIndex].image}
                  alt={`${testimonials[currentTestimonialIndex].author} testimonial`}
                  fill
                  className={styles.testimonial__image}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.testimonial__imageOverlay} />

                {/* Floating Accent Elements */}
                <motion.div
                  className={styles.testimonial__accentElement}
                  style={{ background: testimonials[currentTestimonialIndex].accent }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              className={styles.testimonial__contentSide}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.testimonial__content}>
                {/* Quote Icon */}
                <motion.div
                  className={styles.testimonial__quoteIcon}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'backOut' }}
                  style={{ color: testimonials[currentTestimonialIndex].accent }}
                >
                  &quot;
                </motion.div>

                <motion.blockquote
                  className={styles.testimonial__quote}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {testimonials[currentTestimonialIndex].quote.replace(/"/g, '&quot;')}
                </motion.blockquote>

                <motion.div
                  className={styles.testimonial__author}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <cite className={styles.testimonial__name}>
                    {testimonials[currentTestimonialIndex].author}
                  </cite>
                  <span className={styles.testimonial__role}>
                    {testimonials[currentTestimonialIndex].role}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <motion.div
        className={styles.testimonials__dots}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.button
            key={index}
            className={`${styles.testimonial__dot} ${index === currentTestimonialIndex ? styles.active : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            style={
              {
                '--accent-color': testimonial.accent,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
