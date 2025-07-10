'use client'

import { useRef, useMemo } from 'react'
import { Client } from '@/types'
import { Overview } from '@/components/Client/Overview/Overview'
import { SellingPoints } from '@/components/Client/SellingPoints/SellingPoints'
import { ValueProposition } from '@/components/Client/ValueProposition/ValueProposition'
import { MediaLinks } from '@/components/Client/MediaLinks/MediaLinks'
import { MediaGallery } from '@/components/Client/MediaGallery/MediaGallery'
import ClientNav from '@/components/Client/ClientNav/ClientNav'
import styles from './page.module.css'

interface ClientPageContentProps {
  clientData: Client
  slug: string
}

export default function ClientPageContent({ clientData, slug }: ClientPageContentProps) {
  const overviewRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const interactiveRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  // Memoize section refs to prevent unnecessary re-renders
  const sectionRefs = useMemo(() => {
    const basePath = `/clients/${slug}`
    return {
      [basePath]: overviewRef,
      [`${basePath}/features`]: featuresRef,
      [`${basePath}/value`]: valueRef,
      [`${basePath}/media`]: mediaRef,
    } as Record<string, React.RefObject<HTMLDivElement>>
  }, [slug])

  return (
    <>
      <div className={styles.client__nav_container}>
        <ClientNav 
          clientSlug={slug} 
          sectionRefs={sectionRefs}
        />
      </div>
      
      <div className={styles.client__content}>
        <div ref={overviewRef} className={styles.client__section}>
          {clientData.overview && clientData.overview.title && clientData.overview.description && clientData.overview.headerImage && (
            <Overview 
              title={clientData.overview.title}
              description={clientData.overview.description}
              headerImage={clientData.overview.headerImage.asset.url}
              logo={clientData.logo?.asset?.url} 
              website={clientData.mediaLinks?.website}
            />
          )}
        </div>
        <div ref={featuresRef} className={styles.client__section}>
          {clientData.sellingPoints && clientData.sellingPoints.title && clientData.sellingPoints.points && (
            <SellingPoints 
              title={clientData.sellingPoints.title}
              points={clientData.sellingPoints.points
                .filter(point => point.id && point.title && point.description)
                .map(point => ({
                  id: point.id!,
                  title: point.title!,
                  description: point.description!,
                  icon: point.icon?.asset.url,
                  features: point.features || [],
                  link: point.link,
                  documentation: point.documentation ? {
                    specs: point.documentation.specs?.url || point.documentation.specs?.file?.asset.url || '',
                    manual: point.documentation.manual?.url || point.documentation.manual?.file?.asset.url
                  } : undefined
                }))}
            />
          )}
        </div>
        <div ref={valueRef} className={styles.client__section}>
          <ValueProposition {...clientData.valueProposition} />
        </div>
        <div ref={mediaRef} className={styles.client__section}>
          <MediaLinks links={clientData.mediaLinks} />
          <MediaGallery items={clientData.gallery} />
        </div>
      </div>
    </>
  )
} 