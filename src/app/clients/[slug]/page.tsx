import { notFound } from 'next/navigation'
import Image from 'next/image'
import { fetchClientBySlug, getAllClientSlugs } from '@/lib/sanity'
import { Client } from '@/types'
import styles from './page.module.css'

// Generate static params for all clients
export async function generateStaticParams() {
  const clients = await getAllClientSlugs()
  
  return clients.map((client: { slug: string }) => ({
    slug: client.slug,
  }))
}

// Revalidate every hour (3600 seconds)
export const revalidate = 3600

interface ClientPageProps {
  params: {
    slug: string
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const client: Client | null = await fetchClientBySlug(params.slug)
  
  if (!client) {
    notFound()
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        {client.logo?.asset?.url && (
          <div className={styles.logo}>
            <Image 
              src={client.logo.asset.url}
              alt={client.logo.alt || `${client.name} logo`}
              width={200}
              height={100}
              className={styles.logoImage}
            />
          </div>
        )}
        <h1 className={styles.title}>{client.name}</h1>
        {client.overview?.description && (
          <p className={styles.description}>{client.overview.description}</p>
        )}
      </div>

      {/* Overview Section */}
      {client.overview?.title && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{client.overview.title}</h2>
          {client.overview.headerImage?.asset?.url && (
            <div className={styles.headerImage}>
              <Image
                src={client.overview.headerImage.asset.url}
                alt="Header image"
                width={800}
                height={400}
                className={styles.image}
              />
            </div>
          )}
        </section>
      )}

      {/* Selling Points Section */}
      {client.sellingPoints && (
        <section className={styles.section}>
          {client.sellingPoints.title && (
            <h2 className={styles.sectionTitle}>{client.sellingPoints.title}</h2>
          )}
          {client.sellingPoints.points && client.sellingPoints.points.length > 0 && (
            <div className={styles.sellingPoints}>
              {client.sellingPoints.points.map((point, index) => (
                <div key={point.id || index} className={styles.sellingPoint}>
                  {point.icon?.asset?.url && (
                    <Image
                      src={point.icon.asset.url}
                      alt={point.title || 'Icon'}
                      width={64}
                      height={64}
                      className={styles.pointIcon}
                    />
                  )}
                  <div className={styles.pointContent}>
                    <h3 className={styles.pointTitle}>{point.title}</h3>
                    {point.description && (
                      <p className={styles.pointDescription}>{point.description}</p>
                    )}
                    {point.features && point.features.length > 0 && (
                      <ul className={styles.featuresList}>
                        {point.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className={styles.feature}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Use Cases Section */}
      {client.useCases && (
        <section className={styles.section}>
          {client.useCases.title && (
            <h2 className={styles.sectionTitle}>{client.useCases.title}</h2>
          )}
          {client.useCases.description && (
            <p className={styles.sectionDescription}>{client.useCases.description}</p>
          )}
          {client.useCases.cases && client.useCases.cases.length > 0 && (
            <div className={styles.useCases}>
              {client.useCases.cases.map((useCase, index) => (
                <div key={useCase.id || index} className={styles.useCase}>
                  <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
                  {useCase.description && (
                    <p className={styles.useCaseDescription}>{useCase.description}</p>
                  )}
                  {useCase.keyPoints && useCase.keyPoints.length > 0 && (
                    <ul className={styles.keyPoints}>
                      {useCase.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className={styles.keyPoint}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Value Proposition Section */}
      {client.valueProposition && (
        <section className={styles.section}>
          {client.valueProposition.title && (
            <h2 className={styles.sectionTitle}>{client.valueProposition.title}</h2>
          )}
          {client.valueProposition.description && (
            <p className={styles.sectionDescription}>{client.valueProposition.description}</p>
          )}
          {client.valueProposition.highlights && client.valueProposition.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {client.valueProposition.highlights.map((highlight, index) => (
                <li key={index} className={styles.highlight}>{highlight}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Media Links Section */}
      {client.mediaLinks && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Connect With Us</h2>
          <div className={styles.mediaLinks}>
            {client.mediaLinks.website && (
              <a href={client.mediaLinks.website} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                Website
              </a>
            )}
            {client.mediaLinks.youtube && (
              <a href={client.mediaLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                YouTube
              </a>
            )}
            {client.mediaLinks.linkedin && (
              <a href={client.mediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                LinkedIn
              </a>
            )}
            {client.mediaLinks.sketchfab && (
              <a href={client.mediaLinks.sketchfab} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                Sketchfab
              </a>
            )}
            {client.mediaLinks.email && (
              <a href={`mailto:${client.mediaLinks.email}`} className={styles.mediaLink}>
                Email
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
} 