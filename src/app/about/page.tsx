'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

export default function AboutPage() {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className={styles.about}>
      <div className={styles.about__content}>
        <div className={styles.about__hero}>
          <div className={styles.about__hero_content}>
            <h1 className={styles.about__hero_title}>About Beringia Marine</h1>
            <div className={styles.about__hero_image_wrapper}>
              <div 
                className={`${styles.about__hero_image_container} ${isFlipped ? styles.flipped : ''}`}
                onClick={handleFlip}
              >
                <div className={styles.about__hero_image_front}>
                  <Image 
                    src="/assets/beringia/penguin.jpeg"
                    alt="Chris Malzone with Emperor Penguin in Antarctica" 
                    className={styles.about__hero_image}
                    width={300}
                    height={225}
                  />
                </div>
                <div className={styles.about__hero_image_back}>
                  <p className={styles.about__hero_image_caption}>
                    Chris Malzone, 1994. Emperor Penguin encounter captured on Konica Autoreflex A 
                    with Polarizing Lens and Fuji Velvia film. Antarctica.
                  </p>
                </div>
              </div>
              <span className={styles.about__flip_hint}>Click to flip</span>
            </div>
          </div>
        </div>
        
        <div className={styles.about__container}>
          <h2 className={styles.about__title}>Bridging Solutions</h2>
          <p className={styles.about__text}>
            Beringia Marine was founded after three decades of experience in marine technology, spanning marine research, ocean engineering, field operations, business development, and executive-level leadership. Throughout this journey, we identified significant gaps in the market, particularly in the early stages of design and solution viability.
          </p>
          
          <p className={styles.about__text}>
            We aim to bridge these gaps by leveraging our diverse expertise and extensive network across all verticals of the marine industry. We conduct thorough market research to identify real-world needs for our oceans, focusing on areas that minimize competition and offer high-impact solutions. From initial concept through engineering, business development, and scaling, we ensure solutions are technically sound, aligned with market demands, and positioned for sustainable, long-term growth. By connecting our clients with the right partners and resources, we help businesses maximize their impact and fulfill crucial needs for ocean preservation and innovation.
          </p>

          <h2 className={styles.about__title}>Leadership</h2>
          <h3 className={styles.about__subtitle}>Chris Malzone</h3>
          <p className={styles.about__text}>
            Chris Malzone is a seasoned marine technologist and business strategist with over three decades of experience in marine technology, sales, and project management. As the Principal of Beringia Marine Technologies, Chris has led the development and deployment of innovative offshore technologies, successfully managing key offshore projects and consulting clients on the integration of advanced subsea systems.
          </p>
          
          <p className={styles.about__text}>
            Throughout his career, Chris has held senior roles, including at Advanced Navigation, where he contributed to significant sales growth, and at AML Oceanographic, where he helped the company achieve record revenues. His focus is on product development, business growth, and market strategy, with expertise in subsea technology and autonomous systems.
          </p>
          
          <p className={styles.about__text}>
            With a Bachelor's degree in Geology and a Masters degree in Oceanography, Chris brings a unique technical perspective to every project, driving success through innovative solutions and strategic partnerships.
          </p>

          <div className={styles.about__social}>
            <a href="https://linkedin.com/in/chrismalzone" target="_blank" rel="noopener noreferrer" className={styles.about__social_link}>LinkedIn</a>
            <a href="https://instagram.com/inoceansgroup" target="_blank" rel="noopener noreferrer" className={styles.about__social_link}>Instagram</a>
          </div>
        </div>
      </div>
    </div>
  )
} 