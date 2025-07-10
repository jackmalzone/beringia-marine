import { notFound } from 'next/navigation'
import { fetchClientBySlug, getAllClientSlugs } from '@/lib/sanity'
import { Client } from '@/types'
import ClientPageContent from './ClientPageContent'
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
  const { slug } = await params
  
  try {
    const clientData = await fetchClientBySlug(slug)
    
    if (!clientData) {
      notFound()
    }

    return (
      <div className={styles.client}>
        <ClientPageContent clientData={clientData} slug={slug} />
      </div>
    )
  } catch (error) {
    console.error('Error loading client data:', error)
    notFound()
  }
} 