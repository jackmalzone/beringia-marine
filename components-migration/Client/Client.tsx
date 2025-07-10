import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ClientData } from '../../data/types.ts'
import { ROUTES } from '../../utils/constants.ts'
import { SKETCHFAB_MODEL_IDS } from '../../utils/sketchfab'
import { SEOHead } from '../shared/SEOHead'
import { Overview } from './Overview/Overview.tsx'
import { SellingPoints } from './SellingPoints/SellingPoints.tsx'
import { ValueProposition } from './ValueProposition/ValueProposition.tsx'
import { MediaLinks } from './MediaLinks/MediaLinks.tsx'
import { MediaGallery } from './MediaGallery/MediaGallery.tsx'
import ClientNav from './ClientNav/ClientNav.tsx'
import { UseCases } from './UseCases/UseCases'
import { Interactive } from './Interactive/Interactive'
import { Demo } from './Demo/Demo'
import { useScrollToSection } from '../../hooks/useScrollToSection'
import { fetchClientBySlug } from '../../lib/fetchClients'
import './Client.css'
import ErrorBoundary from '../shared/ErrorBoundary/ErrorBoundary'

const Client = () => {
  const params = useParams<{ clientSlug: string }>()
  const clientSlug = params.clientSlug

  if (!clientSlug) {
    return <div className="client__error">No client specified</div>
  }

  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const overviewRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const interactiveRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  // Memoize section refs to prevent unnecessary re-renders
  const sectionRefs = useMemo(() => {
    const basePath = ROUTES.CLIENT(clientSlug)
    return {
      [basePath]: overviewRef,
      [`${basePath}/features`]: featuresRef,
      [`${basePath}/value`]: valueRef,
      [`${basePath}/media`]: mediaRef,
      [`${basePath}/interactive`]: interactiveRef,
      [`${basePath}/demo`]: demoRef,
    }
  }, [clientSlug])

  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const data = await fetchClientBySlug(clientSlug)
        if (!data) {
          setError('Client not found')
          return
        }
        
        setClientData(data)
      } catch (err) {
        setError('Failed to load client data')
        console.error('Error loading client data:', err)
      } finally {
        // Add a small delay to prevent flash of loading state
        setTimeout(() => setIsLoading(false), 300)
      }
    }

    loadClientData()
  }, [clientSlug])

  // Use the scroll to section hook
  useScrollToSection(sectionRefs, {
    headerOffset: 80,
    behavior: 'smooth'
  })

  if (isLoading) {
    return <div className="client__loading">Loading...</div>
  }

  if (error) {
    return <div className="client__error">{error}</div>
  }

  if (!clientData) {
    return <div className="client__error">Client not found</div>
  }

  const navContainerClasses = `client__nav-container ${isLoading ? 'client__nav-container--loading' : ''}`

  return (
    <div className="client">
      <SEOHead
        title={String(clientData.seo.title ?? '')}
        description={String(clientData.seo.description ?? '')}
        image={String(clientData.seo.ogImage ?? '')}
      />
      
      <div className={navContainerClasses}>
        <ErrorBoundary>
          {!isLoading && (
            <ClientNav 
              clientSlug={clientSlug} 
              sectionRefs={sectionRefs}
            />
          )}
        </ErrorBoundary>
      </div>
      
      <div className="client__content">
        <div ref={overviewRef} className="client__section">
          <ErrorBoundary>
            <Overview 
              {...clientData.overview} 
              logo={clientData.logo} 
              website={clientData.mediaLinks.website}
            />
          </ErrorBoundary>
        </div>
        <div ref={featuresRef} className="client__section">
          <ErrorBoundary>
            <SellingPoints {...clientData.sellingPoints} />
            <UseCases {...clientData.useCases} />
          </ErrorBoundary>
        </div>
        {clientData.modelId === SKETCHFAB_MODEL_IDS.HYDRUS_SHIPWRECK && (
          <div ref={interactiveRef} className="client__section">
            <ErrorBoundary>
              <Interactive 
                modelId={clientData.modelId}
                title={clientData.interactiveTitle}
                description={clientData.interactiveDescription}
              />
            </ErrorBoundary>
          </div>
        )}
        <div ref={valueRef} className="client__section">
          <ErrorBoundary>
            <ValueProposition {...clientData.valueProposition} />
          </ErrorBoundary>
        </div>
        <div ref={mediaRef} className="client__section">
          <ErrorBoundary>
            <MediaLinks links={clientData.mediaLinks} />
            <MediaGallery items={clientData.gallery} />
          </ErrorBoundary>
        </div>
        {clientData.demo && (
          <div ref={demoRef} className="client__section">
            <ErrorBoundary>
              <Demo {...clientData.demo} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  )
}

export default Client