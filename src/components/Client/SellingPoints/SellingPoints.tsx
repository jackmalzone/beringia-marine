'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './SellingPoints.module.css'

interface SellingPoint {
  id: string
  icon?: string
  title: string
  description: string
  features: string[]
  link?: string
  documentation?: {
    specs: string
    manual?: string
  }
}

interface SellingPointsProps {
  title: string
  points: SellingPoint[]
}

const isExternalUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://')
}

export const SellingPoints: React.FC<SellingPointsProps> = ({ title, points }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleTitleClick = (id: string, link?: string) => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  const handleCardClick = (id: string, link?: string, isTitle: boolean = false) => {
    if (!isTitle) {
      setExpandedItem(expandedItem === id ? null : id)
    }
  }

  const handleSpecsClick = (e: React.MouseEvent, specs: string, title: string) => {
    e.stopPropagation()
    if (isExternalUrl(specs)) {
      window.open(specs, '_blank')
    } else {
      // Handle PDF modal here if needed
      console.log('PDF modal not implemented yet')
    }
  }

  const renderIcon = (icon?: string) => {
    if (!icon) return null
    
    return (
      <Image
        src={icon}
        alt=""
        className={styles.selling_points__icon}
        width={64}
        height={64}
        aria-hidden="true"
      />
    )
  }

  return (
    <section className={styles.selling_points}>
      <div className={styles.selling_points__container}>
        <h2 className={styles.selling_points__title}>{title}</h2>
        <div className={styles.selling_points__grid}>
          {points.map((point) => (
            <div 
              key={point.id} 
              className={`${styles.selling_points__item} ${expandedItem === point.id ? styles.selling_points__item_expanded : ''}`}
              onClick={() => handleCardClick(point.id, point.link)}
            >
              <div className={styles.selling_points__header}>
                {renderIcon(point.icon)}
                <h3 
                  className={`${styles.selling_points__item_title} ${point.link ? styles.selling_points__item_title_clickable : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTitleClick(point.id, point.link)
                  }}
                >
                  {point.title}
                </h3>
              </div>
              <p className={styles.selling_points__text}>{point.description}</p>
              <ul className={`${styles.selling_points__list} ${expandedItem === point.id ? styles.selling_points__list_expanded : ''}`}>
                {point.features.map((feature, index) => (
                  <li key={index} className={styles.selling_points__list_item}>
                    {feature}
                  </li>
                ))}
              </ul>
              {point.documentation && (
                <div className={styles.selling_points__item_docs}>
                  <button 
                    className={styles.selling_points__doc_link}
                    onClick={(e) => handleSpecsClick(e, point.documentation!.specs, point.title)}
                  >
                    Specs
                  </button>
                  {point.documentation.manual && (
                    <>
                      <span className={styles.selling_points__doc_separator}>|</span>
                      <a 
                        href={point.documentation.manual}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.selling_points__doc_link}
                      >
                        Manual
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 